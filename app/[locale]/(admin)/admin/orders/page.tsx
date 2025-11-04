"use client";

import {
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Eye,
  Loader2,
  Package,
  Search,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Order {
  id: number;
  orderNo: string;
  createdAt: string;
  userUuid: string;
  userEmail: string;
  amount: number;
  interval?: string;
  status: string;
  stripeSessionId?: string;
  credits: number;
  currency?: string;
  productId?: string;
  productName?: string;
  validMonths?: number;
  orderDetail?: string;
  paidAt?: string;
  paidEmail?: string;
  paidDetail?: string;
  githubUsername?: string | null;
}

interface OrderStats {
  totalOrders: number;
  revenue: number;
  pendingOrders: number;
  completedOrders: number;
}

export default function OrdersPage() {
  const t = useTranslations("admin.orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats>({
    totalOrders: 0,
    revenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter }),
      });

      const response = await fetch(`/api/admin/orders?${params}`);
      const data = await response.json();

      if (data.success) {
        setOrders(data.data.orders);
        setStats(data.data.stats);
        setTotalPages(data.data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter]);

  const updateOrderStatus = async (orderNo: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderNo}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        await fetchOrders(); // Refresh data
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const formatCurrency = (amount: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const clearGithubBinding = async (orderNo: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderNo}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ githubUsername: null, githubRepoName: null }),
      });
      if (response.ok) {
        await fetchOrders();
      }
    } catch (error) {
      console.error("Failed to clear GitHub binding:", error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="relative">
        <h1 className="text-4xl font-bold tracking-tighter">{t("title")}</h1>
        <p className="text-muted-foreground mt-2">{t("description")}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-muted-foreground">
                {t("stats.totalOrders")}
              </p>
              <p className="text-2xl font-semibold">
                {stats.totalOrders.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-muted-foreground">
                {t("stats.revenue")}
              </p>
              <p className="text-2xl font-semibold">
                {formatCurrency(stats.revenue)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-xl bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center">
                <Package className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-muted-foreground">
                {t("stats.pending")}
              </p>
              <p className="text-2xl font-semibold">{stats.pendingOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                <Truck className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-muted-foreground">
                {t("stats.completed")}
              </p>
              <p className="text-2xl font-semibold">{stats.completedOrders}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("search.placeholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={statusFilter || "all"}
            onValueChange={(value) =>
              setStatusFilter(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("search.allStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("search.allStatus")}</SelectItem>
              <SelectItem value="pending">{t("search.pending")}</SelectItem>
              <SelectItem value="paid">{t("search.paid")}</SelectItem>
              <SelectItem value="failed">{t("search.failed")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders table */}
      <div className="bg-card border rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin h-8 w-8 text-primary" />
            <span className="ml-3 text-muted-foreground">
              {t("messages.loading")}
            </span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>{t("table.order")}</TableHead>
                  <TableHead>{t("table.customer")}</TableHead>
                  <TableHead>{t("table.product")}</TableHead>
                  <TableHead>{t("table.total")}</TableHead>
                  <TableHead>GitHub</TableHead>
                  <TableHead>{t("table.status")}</TableHead>
                  <TableHead>{t("table.date")}</TableHead>
                  <TableHead>{t("table.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow
                    key={order.id}
                    className="hover:bg-muted/50 transition-colors h-16"
                  >
                    <TableCell className="whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium">
                          {order.orderNo}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {order.credits} {t("table.credits")}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium">
                          {order.userEmail}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {order.userUuid.slice(0, 8)}...
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {order.productName || "N/A"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {order.interval || t("table.oneTime")}
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="text-sm font-medium">
                        {formatCurrency(order.amount, order.currency)}
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <span>{order.githubUsername || "-"}</span>
                        {order.githubUsername ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => clearGithubBinding(order.orderNo)}
                          >
                            Clear
                          </Button>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${
                          order.status === "paid"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700"
                            : order.status === "pending"
                              ? "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700"
                              : "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Select
                          value={order.status}
                          onValueChange={(value) =>
                            updateOrderStatus(order.orderNo, value)
                          }
                        >
                          <SelectTrigger className="w-[100px] h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">
                              {t("search.pending")}
                            </SelectItem>
                            <SelectItem value="paid">
                              {t("search.paid")}
                            </SelectItem>
                            <SelectItem value="failed">
                              {t("search.failed")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {t("pagination.showingPage", {
              current: currentPage,
              total: totalPages,
            })}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-3 py-2 text-sm">{currentPage}</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
