import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import enLanding from "@/i18n/pages/landing/en.json";
import zhLanding from "@/i18n/pages/landing/zh.json";
import { createOrder } from "@/pay-provider/services";
import { getPricingItem } from "@/pay-provider/services/payment-service";
import { newStripeClient } from "@/pay-provider/stripe";
import { PrismaClient } from "@/prisma/generated/prisma";

// Constants
const DEFAULT_CURRENCY = "USD";
const DEFAULT_LOCALE = "en";
const CHINESE_PAYMENT_METHOD = "cn";
const CHINESE_CURRENCY = "CNY";

// Payment method types
const PAYMENT_METHODS = {
  CARD: ["card"] as Stripe.Checkout.SessionCreateParams.PaymentMethodType[],
  CHINESE: [
    "card",
    "alipay",
    "wechat_pay",
  ] as Stripe.Checkout.SessionCreateParams.PaymentMethodType[],
};

const prisma = new PrismaClient();

// Types
interface CheckoutRequest {
  productId: string;
  productName?: string;
  amount: number;
  currency?: string;
  interval?: string;
  credits: number;
  validMonths?: number;
  userUuid: string;
  userEmail: string;
  successUrl?: string;
  cancelUrl?: string;
  payMethod?: string;
  locale?: string;
}

// Helper functions
function generateOrderNumber(): string {
  return `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function validateRequiredFields(body: CheckoutRequest): string | null {
  const { productId, amount, userUuid, userEmail } = body;
  if (!productId || !amount || !userUuid || !userEmail) {
    return "Missing required fields";
  }
  return null;
}

function getPaymentConfiguration(
  isSubscription: boolean,
  payMethod: string,
  productId: string,
  amount: number,
  currency: string,
) {
  const isChinesePayment =
    !isSubscription && payMethod === CHINESE_PAYMENT_METHOD;

  if (isSubscription) {
    return {
      amount,
      currency: DEFAULT_CURRENCY,
      paymentMethods: PAYMENT_METHODS.CARD,
    };
  }

  if (isChinesePayment) {
    const zhItem = getPricingItem(productId, "zh");
    if (!zhItem) {
      throw new Error("Product not found for CN payment");
    }
    return {
      amount: zhItem.cn_amount,
      currency: CHINESE_CURRENCY,
      paymentMethods: PAYMENT_METHODS.CHINESE,
    };
  }

  return {
    amount,
    currency,
    paymentMethods: PAYMENT_METHODS.CARD,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json();
    const {
      productId,
      productName,
      amount,
      currency = DEFAULT_CURRENCY,
      interval,
      credits,
      validMonths,
      userUuid,
      userEmail,
      successUrl,
      cancelUrl,
      payMethod,
      locale = DEFAULT_LOCALE,
    } = body;

    // Validate required fields
    const validationError = validateRequiredFields(body);
    if (validationError) {
      console.error("Validation error:", validationError);
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const stripe = newStripeClient().stripe();
    const orderNo = generateOrderNumber();
    const isSubscription = Boolean(interval && interval !== "one-time");

    // Resolve github_repo_name from landing metadata by product_id or name
    const allPlans = [
      ...(enLanding?.pricing?.plans || []),
      ...(zhLanding?.pricing?.plans || []),
    ] as Array<{
      name: string;
      metadata?: {
        product_id?: string;
        product_name?: string;
        github_repo_name?: string;
      };
    }>;
    const matchedPlan = allPlans.find(
      (p) =>
        (p.metadata?.product_id && p.metadata.product_id === productId) ||
        (p.metadata?.product_name &&
          p.metadata.product_name === (productName || "")) ||
        p.name === (productName || ""),
    );
    const githubRepoName = matchedPlan?.metadata?.github_repo_name || null;

    // Create order in database
    await createOrder({
      orderNo,
      userUuid,
      userEmail,
      amount,
      interval,
      status: "pending",
      credits,
      currency,
      productId,
      productName,
      validMonths,
      orderDetail: JSON.stringify(body),
    });

    // Persist githubRepoName to order if resolved
    if (githubRepoName) {
      await prisma.order.update({
        where: { orderNo },
        data: { githubRepoName } as unknown as Record<string, unknown>,
      });
    }

    // Get payment configuration
    const paymentConfig = getPaymentConfiguration(
      isSubscription,
      payMethod ?? "",
      productId,
      amount,
      currency,
    );

    const baseLineItem: Stripe.Checkout.SessionCreateParams.LineItem = {
      price_data: {
        currency: paymentConfig.currency.toLowerCase(),
        product_data: {
          name: productName || "VibeStarter Plan",
        },
        unit_amount: paymentConfig.amount,
        ...(isSubscription && {
          recurring: {
            interval: interval as Stripe.Price.Recurring.Interval,
          },
        }),
      },
      quantity: 1,
    };

    const isChinesePayment =
      !isSubscription && payMethod === CHINESE_PAYMENT_METHOD;
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: paymentConfig.paymentMethods,
      ...(isChinesePayment && {
        payment_method_options: {
          wechat_pay: { client: "web" },
        } as Stripe.Checkout.SessionCreateParams.PaymentMethodOptions,
      }),
      line_items: [baseLineItem],
      mode: isSubscription ? "subscription" : "payment",
      success_url:
        successUrl ||
        `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:
        cancelUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/payment/canceled`,
      customer_email: userEmail,
      metadata: {
        order_no: orderNo,
        user_uuid: userUuid,
        user_email: userEmail,
        product_id: productId,
        credits: credits.toString(),
        valid_months: validMonths?.toString() || "",
        pay_method: payMethod ?? "",
        locale,
        ...(githubRepoName ? { github_repo_name: githubRepoName } : {}),
      },
      // Only add payment_intent_data for one-time payments (not subscriptions)
      ...(!isSubscription && {
        payment_intent_data: {
          metadata: {
            order_no: orderNo,
            user_uuid: userUuid,
            user_email: userEmail,
            product_id: productId,
            credits: credits.toString(),
            valid_months: validMonths?.toString() || "",
            pay_method: payMethod ?? "",
            locale,
            ...(githubRepoName ? { github_repo_name: githubRepoName } : {}),
          },
        },
      }),
    };

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create(sessionConfig);

    // Update order with Stripe session ID
    await prisma.order.update({
      where: { orderNo },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
      orderNo,
    });
  } catch (error) {
    console.error("Payment checkout error:", error);

    // Handle specific error types
    if (error instanceof Error && error.message.includes("Product not found")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
