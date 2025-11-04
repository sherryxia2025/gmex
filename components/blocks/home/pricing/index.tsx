"use client";

import { useLocale } from "next-intl";
import { useState } from "react";
import { AiOutlineAlipay } from "react-icons/ai";
import { IoLogoWechat } from "react-icons/io5";
import AuthDialog from "@/components/auth/auth-dialog";
import CheckmarkIcon from "@/components/icon/checkmark-icon";
import { useAuth } from "@/store/auth";

interface PricingProps {
  title?: string;
  description?: string;
  plans?: Array<{
    name: string;
    price: string;
    unit: string;
    description: string;
    features: string[];
    tip: string;
    isMostPopular: boolean;
    buttonText?: string;
    buttonHref?: string;
    metadata: {
      product_id: string;
      product_name: string;
      amount: number;
      currency: string;
      interval: "month" | "year" | "one-time";
      credits: number;
      valid_months: number;
      payMethod: "us" | "cn";
    };
    supportPayments?: Array<"alipay" | "wechatpay" | "card">;
  }>;
  className?: string;
}

export default function Pricing(props: PricingProps) {
  const locale = useLocale();
  const { title, description, plans, className } = props;
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

  const handlePayment = async (productId: string) => {
    const pricingItem = plans?.find(
      (plan) => plan.metadata.product_id === productId,
    );
    if (!pricingItem) {
      console.error("Product not found:", productId);
      alert("Product not found. Please try again.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/payment/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: pricingItem.metadata.product_id,
          productName: pricingItem.metadata.product_name,
          amount: pricingItem.metadata.amount,
          currency: pricingItem.metadata.currency,
          interval: pricingItem.metadata.interval,
          credits: pricingItem.metadata.credits,
          validMonths: pricingItem.metadata.valid_months,
          userUuid: user?.id,
          userEmail: user?.email,
          successUrl: `${window.location.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/payment/canceled`,
          payMethod: ["zh", "cn", "zh-CN"].includes(locale) ? "cn" : "us",
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
      setLoading(false);
    }
  };

  if (!title && !description && (!plans || plans.length === 0)) {
    return null;
  }

  return (
    <>
      <section
        id="pricing"
        className={`min-h-screen py-12 md:py-20 lg:py-25 flex items-center justify-between flex-col gap-5 px-4 md:px-6 ${className || ""}`}
      >
        {title && (
          <h1 className="font-extrabold text-[#3D3D3D] dark:text-[#E5E5E5] text-2xl sm:text-3xl md:text-4xl text-center">
            {title}
          </h1>
        )}
        {description && (
          <p className="text-[#666666] dark:text-[#A0A0A0] text-sm sm:text-base text-center max-w-2xl">
            {description}
          </p>
        )}
        {plans && plans.length > 0 && (
          <div className="flex flex-col md:flex-row items-center justify-center mt-8 md:mt-12 lg:mt-15 gap-6 md:gap-8 lg:gap-10 w-full max-w-7xl">
            {plans.map((plan) => (
              <article
                key={plan.price}
                className={`border border-[#EAEAEA] dark:border-[#404040] rounded-lg p-4 md:p-6 flex flex-col gap-4 w-full md:w-100 ${plan.isMostPopular ? "border-[#F9F8F5] dark:border-[#404040] bg-[#F9F8F5] dark:bg-[#2A2A2A]" : "dark:bg-[#2A2A2A]/50"}`}
              >
                <h3 className="font-semibold text-[#3D3D3D] dark:text-[#E5E5E5] text-lg md:text-xl">
                  {plan.name}
                </h3>
                <h2 className="font-extrabold text-[#3D3D3D] dark:text-[#E5E5E5] text-3xl md:text-4xl flex items-end gap-3 md:gap-4">
                  <span>{plan.price}</span>
                  <span className="uppercase font-semibold text-sm md:text-base">
                    {plan.unit}
                  </span>
                </h2>
                <p className="text-[#666666] dark:text-[#A0A0A0] text-sm md:text-base">
                  {plan.description}
                </p>
                <ul className="space-y-3 md:space-y-4 py-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={feature || featureIndex}
                      className="text-[#555555] dark:text-[#A0A0A0] flex items-center gap-3 text-sm md:text-base"
                    >
                      <CheckmarkIcon className="flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <p className="w-full font-medium">
                  {"buttonHref" in plan && plan.buttonHref ? (
                    <a
                      href={plan.buttonHref}
                      className={`cursor-pointer rounded-lg w-full flex items-center p-3 md:p-4 text-center justify-center gap-2 border border-[#F14636] text-sm md:text-base transition-colors ${plan.isMostPopular ? "bg-[#F14636] text-white hover:bg-[#F14636]/90" : "hover:bg-gray-100/50 dark:hover:bg-[#404040]/50"}`}
                    >
                      {plan.buttonText || "Get PressFast"}
                    </a>
                  ) : (
                    <button
                      onClick={() => {
                        if (!user) {
                          setAuthDialogOpen(true);
                          return;
                        }
                        handlePayment(plan.metadata.product_id);
                      }}
                      disabled={loading}
                      type="button"
                      className={`cursor-pointer rounded-lg w-full flex items-center p-3 md:p-4 text-center justify-center gap-2 border border-[#F14636] text-sm md:text-base transition-colors ${plan.isMostPopular ? "bg-[#F14636] text-white hover:bg-[#F14636]/90" : "hover:bg-gray-100/50 dark:hover:bg-[#404040]/50"}`}
                    >
                      <span className="inline-flex items-center gap-2">
                        {plan.supportPayments?.includes("alipay") && (
                          <AiOutlineAlipay className="size-4" />
                        )}
                        {plan.supportPayments?.includes("wechatpay") && (
                          <IoLogoWechat className="size-4" />
                        )}
                      </span>
                      <span>{plan.buttonText || "Get PressFast"}</span>
                    </button>
                  )}
                </p>
                <p className="text-xs md:text-sm text-[#999999] dark:text-[#707070] text-center">
                  {plan.tip}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </>
  );
}
