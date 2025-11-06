"use client";

import { CheckCircle, XCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Header } from "@/components/blocks/header";
import { DiscordInviteCard } from "@/components/payment/discord-invite-card";
import { GitHubInviteCard } from "@/components/payment/github-invite-card";
import { cn } from "@/lib/utils";
import { getOrderByOrderNo } from "@/pay-provider/services";

interface OrderData {
  id: number;
  orderNo: string;
  createdAt: Date;
  userUuid: string;
  userEmail: string;
  amount: number;
  interval?: string | null;
  status: string;
  credits: number;
  currency?: string | null;
  productId?: string | null;
  productName?: string | null;
  validMonths?: number | null;
  paidAt?: Date | null;
  paidEmail?: string | null;
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("payment.success");

  const sessionId = searchParams.get("session_id");
  const orderNo = searchParams.get("order_no");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);

        // Try to get order by session_id first, then by order_no
        let orderData = null;

        if (sessionId) {
          // Try to find order by session_id
          try {
            const response = await fetch(
              `/api/payment/order-by-session?session_id=${sessionId}`,
            );
            if (response.ok) {
              orderData = await response.json();
            }
          } catch (err) {
            console.log("Failed to fetch by session_id:", err);
          }
        }

        // Fallback to order_no if session_id method failed
        if (!orderData && orderNo) {
          orderData = await getOrderByOrderNo(orderNo);
        }

        if (orderData) {
          setOrder(orderData);
        } else {
          console.log(
            "No order found with session_id:",
            sessionId,
            "or order_no:",
            orderNo,
          );
          setError(t("orderNotFound"));
        }
      } catch (err) {
        console.error("Failed to fetch order:", err);
        setError(t("loadError"));
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [sessionId, orderNo, t]);

  const formatAmount = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount / 100);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  if (loading) {
    return (
      <article
        className={cn(
          "min-h-screen w-full bg-white dark:bg-[#212121] transition-colors select-none",
        )}
      >
        {/* Header with theme and language switchers */}
        <Header />

        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F14636] mx-auto mb-4"></div>
            <p className="text-[#666666] dark:text-[#A0A0A0]">{t("loading")}</p>
          </div>
        </div>
      </article>
    );
  }

  if (error || !order) {
    return (
      <article
        className={cn(
          "min-h-screen w-full bg-white dark:bg-[#212121] transition-colors select-none",
        )}
      >
        {/* Header with theme and language switchers */}
        <Header />

        <div className="flex items-center justify-center min-h-screen">
          <div className="max-w-md mx-auto text-center px-4">
            <div className="bg-red-500/10 border border-red-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-[#151417] dark:text-white mb-2">
              {t("error")}
            </h1>
            <p className="text-[#666666] dark:text-[#A0A0A0] mb-6">
              {error || t("loadError")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 bg-[#F14636] text-white rounded-lg hover:bg-[#F14636]/80 transition-colors"
              >
                {t("refreshPage")}
              </button>
              <a
                href="/"
                className="inline-flex items-center px-4 py-2 bg-[#666666] dark:bg-[#A0A0A0] text-white rounded-lg hover:bg-[#666666]/80 dark:hover:bg-[#A0A0A0]/80 transition-colors"
              >
                {t("returnHome")}
              </a>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "min-h-screen w-full bg-white dark:bg-[#212121] transition-colors select-none",
      )}
    >
      {/* Header with theme and language switchers */}
      <Header />

      <div className="min-h-screen flex items-center py-12">
        <div className="max-w-6xl mx-auto px-4 w-full">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-full w-12 h-12 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold text-[#151417] dark:text-white">
                {t("title")}
              </h1>
            </div>
            <p className="text-[#666666] dark:text-[#A0A0A0]">
              {t("description")}
            </p>
          </div>

          {/* Main Content - Left Right Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 items-stretch">
            {/* Left Column - Order Details */}
            <div className="flex flex-col">
              {/* Order Details Card */}
              <div className="bg-white dark:bg-[#2A2A2A] border border-gray-200 dark:border-gray-700 rounded-2xl p-6 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gray-100 dark:bg-gray-800/40 p-2 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-[#151417] dark:text-white">
                    {t("orderDetails")}
                  </h2>
                </div>

                <div className="space-y-4 flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[#666666] dark:text-[#A0A0A0]">
                      {t("orderNumber")}:
                    </span>
                    <span className="text-[#151417] dark:text-white font-mono">
                      {order.orderNo}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[#666666] dark:text-[#A0A0A0]">
                      {t("product")}:
                    </span>
                    <span className="text-[#151417] dark:text-white">
                      {order.productName}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[#666666] dark:text-[#A0A0A0]">
                      {t("amount")}:
                    </span>
                    <span className="text-[#151417] dark:text-white font-semibold">
                      {formatAmount(order.amount, order.currency || "USD")}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[#666666] dark:text-[#A0A0A0]">
                      {t("credits")}:
                    </span>
                    <span className="text-[#151417] dark:text-white">
                      {order.credits}
                    </span>
                  </div>

                  {order.interval && order.interval !== "one-time" && (
                    <div className="flex justify-between items-center">
                      <span className="text-[#666666] dark:text-[#A0A0A0]">
                        {t("billing")}:
                      </span>
                      <span className="text-[#151417] dark:text-white capitalize">
                        {order.interval}ly subscription
                      </span>
                    </div>
                  )}

                  {order.validMonths && (
                    <div className="flex justify-between items-center">
                      <span className="text-[#666666] dark:text-[#A0A0A0]">
                        {t("validFor")}:
                      </span>
                      <span className="text-[#151417] dark:text-white">
                        {order.validMonths === -1
                          ? t("unlimited")
                          : `${order.validMonths} ${t("months")}`}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-[#666666] dark:text-[#A0A0A0]">
                      {t("status")}:
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
                      {order.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[#666666] dark:text-[#A0A0A0]">
                      {t("paidAt")}:
                    </span>
                    <span className="text-[#151417] dark:text-white">
                      {order.paidAt
                        ? formatDate(order.paidAt)
                        : formatDate(order.createdAt)}
                    </span>
                  </div>

                  {order.paidEmail && (
                    <div className="flex justify-between items-center">
                      <span className="text-[#666666] dark:text-[#A0A0A0]">
                        {t("email")}:
                      </span>
                      <span className="text-[#151417] dark:text-white">
                        {order.paidEmail}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Invitations */}
            <div className="flex">
              <div className="bg-white dark:bg-[#2A2A2A] border border-gray-200 dark:border-gray-700 rounded-2xl p-6 h-full w-full flex flex-col">
                <div className="space-y-6 flex-1">
                  {/* Discord Invite Card */}
                  {order.status === "paid" && (
                    <DiscordInviteCard orderNo={order.orderNo} />
                  )}

                  {/* GitHub Invite Card */}
                  {order.status === "paid" && (
                    <GitHubInviteCard orderNo={order.orderNo} />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center">
            <a
              href="/user-center"
              className="inline-flex items-center px-8 py-3 bg-[#F14636] text-white rounded-lg hover:bg-[#F14636]/80 transition-colors font-medium text-lg"
            >
              {t("returnToUserCenter")}
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
