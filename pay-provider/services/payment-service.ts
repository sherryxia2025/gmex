import landingEn from "@/i18n/pages/landing/en.json";
import landingZh from "@/i18n/pages/landing/zh.json";

export interface PricingItem {
  title: string;
  description: string;
  label?: string;
  features_title: string;
  features: string[];
  interval: string;
  amount: number;
  cn_amount?: number;
  currency: string;
  price: string;
  original_price?: string;
  unit: string;
  is_featured: boolean;
  tip?: string;
  button: {
    title: string;
    url: string;
    icon: string;
  };
  product_id: string;
  product_name: string;
  credits: number;
  valid_months: number;
  group: string;
}

type PlanMetadata = {
  product_id: string;
  product_name: string;
  amount: number;
  currency: string;
  interval: string;
  credits: number;
  valid_months: number;
  payMethod?: string;
  cn_amount?: number;
};

type LandingPlan = {
  name: string;
  price: string;
  unit: string;
  description: string;
  features: string[];
  tip?: string;
  isMostPopular?: boolean;
  buttonText: string;
  buttonHref: string;
  label?: string;
  original_price?: string;
  metadata: PlanMetadata;
};

type LandingPricing = {
  title: string;
  description: string;
  plans: LandingPlan[];
};

export function getPricingData(locale: string = "en"): LandingPricing {
  return (
    locale === "zh"
      ? (landingZh as { pricing: LandingPricing })
      : (landingEn as { pricing: LandingPricing })
  ).pricing;
}

export function getPricingItem(
  productId: string,
  locale: string = "en",
): PricingItem | null {
  const pricingData = getPricingData(locale);
  // landing pricing uses pricing.plans[].metadata.product_id
  const plan = pricingData?.plans?.find(
    (p) => p?.metadata?.product_id === productId,
  );
  if (!plan) return null;
  const meta = plan.metadata || {};
  const mapped: PricingItem = {
    title: plan.name,
    description: plan.description,
    label: plan.label,
    features_title: "What's included",
    features: plan.features || [],
    interval: meta.interval,
    amount: meta.amount,
    cn_amount: meta.cn_amount ?? meta.amount,
    currency: meta.currency,
    price: plan.price,
    original_price: plan.original_price,
    unit: plan.unit,
    is_featured: Boolean(plan.isMostPopular),
    tip: plan.tip,
    button: {
      title: plan.buttonText,
      url: plan.buttonHref,
      icon: "",
    },
    product_id: meta.product_id,
    product_name: meta.product_name,
    credits: meta.credits,
    valid_months: meta.valid_months,
    group: meta.interval === "one-time" ? "one-time" : "subscription",
  };
  return mapped;
}

export function createCheckoutSessionData(
  productId: string,
  userUuid: string,
  userEmail: string,
  locale: string = "en",
  successUrl?: string,
  cancelUrl?: string,
) {
  const pricingItem = getPricingItem(productId, locale);

  if (!pricingItem) {
    throw new Error("Product not found");
  }

  return {
    productId: pricingItem.product_id,
    productName: pricingItem.product_name,
    amount: pricingItem.amount,
    currency: pricingItem.currency,
    interval: pricingItem.interval,
    credits: pricingItem.credits,
    validMonths: pricingItem.valid_months,
    userUuid,
    userEmail,
    successUrl,
    cancelUrl,
  };
}
