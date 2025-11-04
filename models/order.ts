import { PrismaClient } from "@/prisma/generated/prisma";

const prisma = new PrismaClient();

export interface Order {
  id: number;
  orderNo: string;
  createdAt: Date;
  userUuid: string;
  userEmail: string;
  amount: number;
  interval?: string | null;
  expiredAt?: Date | null;
  status: string;
  stripeSessionId?: string | null;
  credits: number;
  currency?: string | null;
  subId?: string | null;
  subIntervalCount?: number | null;
  subCycleAnchor?: number | null;
  subPeriodEnd?: number | null;
  subPeriodStart?: number | null;
  subTimes?: number | null;
  productId?: string | null;
  productName?: string | null;
  validMonths?: number | null;
  orderDetail?: string | null;
  paidAt?: Date | null;
  paidEmail?: string | null;
  paidDetail?: string | null;
}

export async function getOrdersByUserUuid(
  userUuid: string,
  page: number = 1,
  limit: number = 10,
): Promise<Order[]> {
  try {
    const skip = (page - 1) * limit;

    const orders = await prisma.order.findMany({
      where: { userUuid },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    return orders;
  } catch (error) {
    console.error("Failed to get orders by user UUID:", error);
    throw error;
  }
}

export async function getOrdersByPaidEmail(
  paidEmail: string,
  page: number = 1,
  limit: number = 10,
): Promise<Order[]> {
  try {
    const skip = (page - 1) * limit;

    const orders = await prisma.order.findMany({
      where: { paidEmail },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    return orders;
  } catch (error) {
    console.error("Failed to get orders by paid email:", error);
    throw error;
  }
}

export async function getOrderByOrderNo(
  orderNo: string,
): Promise<Order | null> {
  try {
    const order = await prisma.order.findUnique({
      where: { orderNo },
    });

    return order;
  } catch (error) {
    console.error("Failed to get order by order number:", error);
    throw error;
  }
}

export async function getOrdersCount(userUuid: string): Promise<number> {
  try {
    const count = await prisma.order.count({
      where: { userUuid },
    });

    return count;
  } catch (error) {
    console.error("Failed to get orders count:", error);
    throw error;
  }
}
