import moment from "moment";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { RiFileList3Line, RiReceiptLine } from "react-icons/ri";
import { DiscordInviteButton } from "@/components/discord";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { getOrdersByPaidEmail, getOrdersByUserUuid } from "@/models/order";
import { BindGithubCell } from "./BindGithubCell";

export default async function MyOrdersPage() {
  const t = await getTranslations();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || !session.user.email) {
    redirect("/");
  }

  const userUuid = session.user.id;
  const userEmail = session.user.email;

  // Get user orders
  let orders = await getOrdersByUserUuid(userUuid, 1, 100);
  if (!orders || orders.length === 0) {
    orders = await getOrdersByPaidEmail(userEmail, 1, 100);
  }

  // Check if user has any paid orders
  const hasPaidOrders = orders.some((order) => order.status === "paid");

  return (
    <div className="space-y-6">
      {/* Orders Content */}
      {orders && orders.length > 0 ? (
        <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-600 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RiFileList3Line className="h-5 w-5 text-[#F14636]" />
                <h2 className="text-xl font-semibold text-[#151417] dark:text-white">
                  {t("my_orders.title")}
                </h2>
              </div>
              <div className="flex gap-2">
                <DiscordInviteButton
                  orderNo={
                    orders.find((order) => order.status === "paid")?.orderNo ||
                    ""
                  }
                  disabled={!hasPaidOrders}
                />
              </div>
            </div>
            <p className="text-[#666666] dark:text-[#A0A0A0] mt-1">
              {t("my_orders.table_description", { count: orders.length })}
            </p>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-[#2A2A2A] border-b border-gray-200 dark:border-gray-600">
                  <TableHead className="w-[120px] text-[#151417] dark:text-white font-semibold">
                    {t("my_orders.table.order_no")}
                  </TableHead>
                  <TableHead className="text-[#151417] dark:text-white font-semibold">
                    {t("my_orders.table.product_name")}
                  </TableHead>
                  <TableHead className="w-[100px] text-[#151417] dark:text-white font-semibold">
                    {t("my_orders.table.amount")}
                  </TableHead>
                  <TableHead className="w-[120px] text-[#151417] dark:text-white font-semibold">
                    {t("my_orders.table.interval")}
                  </TableHead>
                  <TableHead className="w-[180px] text-[#151417] dark:text-white font-semibold">
                    {t("my_orders.table.paid_at")}
                  </TableHead>
                  <TableHead className="w-[100px] text-[#151417] dark:text-white font-semibold">
                    {t("my_orders.table.status")}
                  </TableHead>
                  <TableHead className="w-[220px] text-[#151417] dark:text-white font-semibold">
                    GitHub ID
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow
                    key={order.id}
                    className="hover:bg-gray-50 dark:hover:bg-[#2A2A2A] h-16 border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                  >
                    <TableCell className="font-medium py-4">
                      <code className="text-xs bg-gray-100 dark:bg-[#2A2A2A] px-2 py-1 rounded text-[#151417] dark:text-white border border-gray-200 dark:border-gray-600">
                        {order.orderNo}
                      </code>
                    </TableCell>
                    <TableCell className="font-medium py-4 text-[#151417] dark:text-white">
                      {order.productName || "-"}
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="font-semibold text-[#151417] dark:text-white">
                        {order.currency === "CNY" ? "¥" : "$"}
                        {order.amount / 100}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge
                        variant="outline"
                        className="border-gray-300 dark:border-gray-600 text-[#151417] dark:text-white bg-gray-50 dark:bg-[#2A2A2A]"
                      >
                        {order.interval === "month"
                          ? t("my_orders.table.interval_month")
                          : order.interval === "year"
                            ? t("my_orders.table.interval_year")
                            : t("my_orders.table.interval_one_time")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#666666] dark:text-[#A0A0A0] py-4">
                      {order.paidAt
                        ? moment(order.paidAt).format("YYYY-MM-DD HH:mm")
                        : "-"}
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge
                        variant={
                          order.status === "paid"
                            ? "default"
                            : order.status === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                        className={cn(
                          order.status === "paid" &&
                            "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
                          order.status === "pending" &&
                            "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
                          order.status === "failed" &&
                            "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
                        )}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      <BindGithubCell
                        orderNo={order.orderNo}
                        status={order.status}
                        githubUsername={(order as any).githubUsername}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-600 rounded-2xl shadow-sm">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-gray-100 dark:bg-[#2A2A2A] p-4 mb-4">
              <RiReceiptLine className="h-8 w-8 text-[#666666] dark:text-[#A0A0A0]" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-[#151417] dark:text-white">
              {t("my_orders.no_orders")}
            </h3>
            <p className="text-[#666666] dark:text-[#A0A0A0] text-center max-w-sm">
              {t("my_orders.no_orders_description")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
