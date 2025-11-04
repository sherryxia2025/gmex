"use client";

import { ArrowRight, Check, CreditCard, Loader2 } from "lucide-react";
import { useLocale } from "next-intl";
import { useState } from "react";
import AuthDialog from "@/components/auth/auth-dialog";
import landingEn from "@/i18n/pages/landing/en.json";
import landingZh from "@/i18n/pages/landing/zh.json";
import { useAuth } from "@/store/auth";

export default function PricingSection() {
  const locale = useLocale();
  const [activeGroup, setActiveGroup] = useState("one-time");
  const [loading, setLoading] = useState<string | null>(null);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [payMethod, setPayMethod] = useState<"cn" | "us">("us");
  const { user } = useAuth();

  // Types for landing pricing
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

  // Get pricing data based on locale (landing pricing)
  const pricingData: LandingPricing = (
    locale === "zh"
      ? (landingZh as { pricing: LandingPricing })
      : (landingEn as { pricing: LandingPricing })
  ).pricing;

  // Old-style groups derived from interval
  const groups = [
    {
      name: "one-time",
      title: locale === "zh" ? "一次性付费" : "Pay as you go",
      is_featured: false,
      label: undefined as string | undefined,
    },
    {
      name: "monthly",
      title: locale === "zh" ? "Monthly" : "Monthly",
      is_featured: true,
      label: locale === "zh" ? "save 15%" : "save 15%",
    },
  ];

  const handlePayment = async (productId: string) => {
    // Check if user is logged in
    if (!user) {
      setAuthDialogOpen(true);
      return;
    }

    try {
      setLoading(productId);

      // Find plan by metadata.product_id from landing pricing
      const plan = pricingData.plans.find(
        (p) => p.metadata?.product_id === productId,
      );
      if (!plan) {
        console.error("Product not found:", productId);
        alert("Product not found. Please try again.");
        return;
      }

      const response = await fetch("/api/payment/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: plan.metadata.product_id,
          productName: plan.metadata.product_name,
          amount: plan.metadata.amount,
          currency: plan.metadata.currency,
          interval: plan.metadata.interval,
          credits: plan.metadata.credits,
          validMonths: plan.metadata.valid_months,
          userUuid: user?.id,
          userEmail: user?.email,
          successUrl: `${window.location.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/payment/canceled`,
          payMethod,
          locale,
        }),
      });

      const data = await response.json();

      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        console.error("Payment failed:", data);
        const errorMessage = data.details
          ? `Payment failed: ${data.error}\nDetails: ${JSON.stringify(data.details, null, 2)}`
          : `Payment failed: ${data.error}`;
        alert(errorMessage);
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment initialization failed. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const plans = pricingData.plans || [];
  const filteredPlans = plans.filter((p) =>
    activeGroup === "one-time"
      ? p.metadata?.interval === "one-time"
      : p.metadata?.interval !== "one-time",
  );

  return (
    <section
      id="pricing"
      className="sm:p-8 bg-gray-900/40 border-gray-800 border rounded-[36px] mt-16 mb-16 pt-6 pr-6 pb-6 pl-6 backdrop-blur-xl"
    >
      <div className="flex flex-col items-center text-center border-b border-gray-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800/50 border border-gray-700 text-gray-300">
          <CreditCard className="w-3 h-3" />
          <span className="text-xs font-normal font-space-grotesk">
            Pricing
          </span>
        </div>
        <h2 className="mt-4 text-[40px] sm:text-6xl lg:text-7xl leading-[0.95] text-white font-space-grotesk font-bold tracking-tighter">
          {pricingData.title}
        </h2>
        <p className="mt-2 text-sm sm:text-base text-gray-400 font-space-grotesk">
          {pricingData.description}
        </p>
      </div>
      {/* Pricing Toggle */}
      <div className="flex justify-center mt-8">
        <div className="inline-flex items-center bg-gray-800/50 border border-gray-700 rounded-full p-1">
          {groups.map((group) => (
            <button
              key={group.name}
              type="button"
              onClick={() => setActiveGroup(group.name)}
              className={`relative px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 font-space-grotesk ${
                activeGroup === group.name
                  ? "text-white bg-gray-700 shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {group.title}
              {group.is_featured && group.label && (
                <span className="absolute -top-1 -right-1 text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full">
                  {group.label}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      {/* Pricing Cards */}
      <div
        className={`grid gap-6 max-w-4xl mt-8 mx-auto ${
          filteredPlans.length === 1
            ? "grid-cols-1 max-w-md"
            : "grid-cols-1 lg:grid-cols-2"
        }`}
      >
        {filteredPlans.map((plan) => (
          <article
            key={plan.metadata?.product_id}
            className={`relative overflow-hidden p-6 bg-gray-900/60 border rounded-2xl backdrop-blur-xl ${
              plan.isMostPopular
                ? "border-blue-500/30 ring-1 ring-blue-500/20"
                : "border-gray-800"
            }`}
          >
            {plan.label && (
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-300 bg-blue-500/10 border border-blue-500/20 rounded-full px-2 py-0.5 font-space-grotesk">
                  {plan.label}
                </span>
              </div>
            )}

            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white font-space-grotesk tracking-tighter">
                  {plan.name}
                </h3>
                <p className="mt-1 text-sm text-gray-400 font-space-grotesk">
                  {plan.description}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white font-space-grotesk tracking-tighter">
                    {plan.price}
                  </span>
                  <span className="text-sm text-gray-400 font-space-grotesk">
                    {plan.unit}
                  </span>
                </div>
                {plan.original_price && (
                  <p className="text-sm text-gray-500 line-through font-space-grotesk">
                    {plan.original_price}
                  </p>
                )}
              </div>
            </div>

            {/* Pay method selector */}
            {plan?.metadata?.interval === "one-time" ? (
              <div className="mb-4 flex items-center gap-4">
                <span className="text-xs text-gray-400 font-space-grotesk">
                  Payment Method
                </span>
                <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    name={`pay-method-${plan.metadata?.product_id}`}
                    checked={payMethod === "cn"}
                    onChange={(e) =>
                      setPayMethod(e.target.checked ? "cn" : "us")
                    }
                  />
                  <span> Alipay / WeChat Pay</span>
                </label>
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => handlePayment(plan.metadata?.product_id)}
              disabled={loading === plan.metadata?.product_id}
              className={`w-full inline-flex items-center justify-center gap-2 h-11 rounded-full text-sm font-medium transition font-space-grotesk ${
                plan.isMostPopular
                  ? "bg-white text-gray-900 hover:opacity-90 disabled:opacity-50"
                  : "bg-gray-800/50 text-white hover:bg-gray-800/70 border border-gray-700 disabled:opacity-50"
              }`}
            >
              {loading === plan.metadata?.product_id ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Processing...
                </>
              ) : (
                <>
                  {plan.buttonText}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="mt-6 pt-6 border-t border-gray-800">
              <h4 className="text-sm font-medium text-white mb-3 font-space-grotesk">
                {locale === "zh" ? "包含" : "Includes"}
              </h4>
              <ul className="space-y-2">
                {(plan.features || []).slice(0, 6).map((feature: string) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-gray-400 font-space-grotesk"
                  >
                    <Check className="text-emerald-400 w-4 h-4 mt-0.5 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
                {(plan.features || []).length > 6 && (
                  <li className="text-sm text-gray-500 font-space-grotesk">
                    +{(plan.features || []).length - 6} more features
                  </li>
                )}
              </ul>
            </div>

            {plan.tip && (
              <div className="mt-4 p-3 bg-gray-800/50 border border-gray-700 rounded-lg">
                <p className="text-xs text-gray-300 font-space-grotesk">
                  {plan.tip}
                </p>
              </div>
            )}
          </article>
        ))}
      </div>
      <div className="flex flex-col text-center mt-8 items-center border-t border-gray-800 pt-6">
        <p className="text-xs text-gray-500 font-space-grotesk">
          All plans include a 14‑day free trial.{" "}
          <a
            href="#"
            className="underline decoration-gray-700 underline-offset-4 text-gray-300 hover:text-white font-space-grotesk"
          >
            View detailed comparison
          </a>
          .
        </p>
      </div>
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </section>
  );
}
