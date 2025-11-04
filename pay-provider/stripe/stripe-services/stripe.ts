import type Stripe from "stripe";
import { updateOrder, updateSubOrder } from "@/pay-provider/services";

export async function handleCheckoutSession(
  stripe: Stripe,
  session: Stripe.Checkout.Session,
) {
  try {
    // Check if we should process this session
    let shouldProcess = false;

    // Standard paid sessions
    if (
      session.payment_status === "paid" ||
      session.payment_status === "no_payment_required"
    ) {
      shouldProcess = true;
    }

    // For alternative payment methods (Alipay/WeChat Pay)
    if (!shouldProcess && session.payment_intent) {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        session.payment_intent as string,
      );
      if (paymentIntent.status === "succeeded") {
        shouldProcess = true;
      }
    }

    // For completed sessions without payment intent (free orders)
    if (
      !shouldProcess &&
      session.status === "complete" &&
      session.amount_total === 0
    ) {
      shouldProcess = true;
    }

    if (!shouldProcess) {
      throw new Error("session not eligible for processing");
    }

    const metadata = session.metadata;
    if (!metadata || !metadata.order_no) {
      throw new Error("no metadata in session");
    }

    const subId = session.subscription as string;
    if (subId) {
      const subscription = await stripe.subscriptions.retrieve(subId);

      await stripe.subscriptions.update(subId, {
        metadata: metadata,
      });

      const item = subscription.items.data[0];

      metadata["sub_id"] = subId;
      metadata["sub_times"] = "1";
      metadata["sub_interval"] = item.plan.interval;
      metadata["sub_interval_count"] = item.plan.interval_count.toString();
      metadata["sub_cycle_anchor"] =
        subscription.billing_cycle_anchor.toString();
      metadata["sub_period_start"] =
        subscription.current_period_start.toString();
      metadata["sub_period_end"] = subscription.current_period_end.toString();

      await updateSubOrder({
        orderNo: metadata.order_no,
        userEmail: metadata.user_email,
        subId: subId,
        subIntervalCount: Number(metadata.sub_interval_count),
        subCycleAnchor: Number(metadata.sub_cycle_anchor),
        subPeriodEnd: Number(metadata.sub_period_end),
        subPeriodStart: Number(metadata.sub_period_start),
        subTimes: Number(metadata.sub_times),
        paidDetail: JSON.stringify(session),
      });

      // GitHub invitation is now triggered by user via UI with username input

      return;
    }

    const orderNo = metadata.order_no;
    const paidEmail =
      session.customer_details?.email || session.customer_email || "";
    const paidDetail = JSON.stringify(session);

    await updateOrder({
      orderNo,
      paidEmail,
      paidDetail,
      status: "paid",
      paidAt: new Date(),
    });

    // GitHub invitation is now triggered by user via UI with username input
  } catch (e) {
    throw e;
  }
}

export async function handleInvoice(stripe: Stripe, invoice: Stripe.Invoice) {
  try {
    if (invoice.status !== "paid") {
      throw new Error("invoice not paid");
    }

    const subId = invoice.subscription as string;
    if (!subId) {
      throw new Error("not a subscription payment");
    }

    // Skip first subscription creation (handled in session completed)
    if (invoice.billing_reason === "subscription_create") {
      return;
    }

    const subscription = await stripe.subscriptions.retrieve(subId);
    let metadata = subscription.metadata;

    if (!metadata || !metadata.order_no) {
      const checkoutSessions = await stripe.checkout.sessions.list({
        subscription: subId,
      });

      if (checkoutSessions.data.length > 0) {
        const session = checkoutSessions.data[0];
        if (session.metadata) {
          metadata = session.metadata;
          await stripe.subscriptions.update(subId, {
            metadata: metadata,
          });
        }
      }
    }

    if (!metadata || !metadata.order_no) {
      throw new Error("no metadata in subscription");
    }

    const item = subscription.items.data[0];
    const anchor = subscription.billing_cycle_anchor;
    const start = subscription.current_period_start;
    const end = subscription.current_period_end;

    const periodDuration = end - start;
    const subTimes = Math.round((start - anchor) / periodDuration) + 1;

    metadata["sub_id"] = subId;
    metadata["sub_times"] = subTimes.toString();
    metadata["sub_interval"] = item.plan.interval;
    metadata["sub_interval_count"] = item.plan.interval_count.toString();
    metadata["sub_cycle_anchor"] = subscription.billing_cycle_anchor.toString();
    metadata["sub_period_start"] = subscription.current_period_start.toString();
    metadata["sub_period_end"] = subscription.current_period_end.toString();

    await updateSubOrder({
      orderNo: metadata.order_no,
      userEmail: metadata.user_email,
      subId: subId,
      subIntervalCount: Number(metadata.sub_interval_count),
      subCycleAnchor: Number(metadata.sub_cycle_anchor),
      subPeriodEnd: Number(metadata.sub_period_end),
      subPeriodStart: Number(metadata.sub_period_start),
      subTimes: Number(metadata.sub_times),
      paidDetail: JSON.stringify(invoice),
    });

    // GitHub invitation is now triggered by user via UI with username input
  } catch (e) {
    throw e;
  }
}
