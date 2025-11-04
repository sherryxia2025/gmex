import { PrismaClient } from "@/prisma/generated/prisma";

const prisma = new PrismaClient();

export interface CreateOrderData {
  orderNo: string;
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
}

export interface UpdateOrderData {
  orderNo: string;
  paidEmail?: string;
  paidDetail?: string;
  status?: string;
  paidAt?: Date;
}

export interface UpdateSubOrderData {
  orderNo: string;
  userEmail: string;
  subId: string;
  subIntervalCount: number;
  subCycleAnchor: number;
  subPeriodEnd: number;
  subPeriodStart: number;
  subTimes: number;
  paidDetail: string;
}

export async function createOrder(data: CreateOrderData) {
  try {
    const order = await prisma.order.create({
      data: {
        orderNo: data.orderNo,
        userUuid: data.userUuid,
        userEmail: data.userEmail,
        amount: data.amount,
        interval: data.interval,
        status: data.status,
        stripeSessionId: data.stripeSessionId,
        credits: data.credits,
        currency: data.currency,
        productId: data.productId,
        productName: data.productName,
        validMonths: data.validMonths,
        orderDetail: data.orderDetail,
      },
    });
    return order;
  } catch (error) {
    console.error("Failed to create order:", error);
    throw error;
  }
}

export async function updateOrder(data: UpdateOrderData) {
  try {
    const order = await prisma.order.update({
      where: { orderNo: data.orderNo },
      data: {
        paidEmail: data.paidEmail,
        paidDetail: data.paidDetail,
        status: data.status,
        paidAt: data.paidAt,
      },
    });
    return order;
  } catch (error) {
    console.error("Failed to update order:", error);
    throw error;
  }
}

export async function updateSubOrder(data: UpdateSubOrderData) {
  try {
    const order = await prisma.order.update({
      where: { orderNo: data.orderNo },
      data: {
        userEmail: data.userEmail,
        subId: data.subId,
        subIntervalCount: data.subIntervalCount,
        subCycleAnchor: data.subCycleAnchor,
        subPeriodEnd: data.subPeriodEnd,
        subPeriodStart: data.subPeriodStart,
        subTimes: data.subTimes,
        paidDetail: data.paidDetail,
        status: "paid",
        paidAt: new Date(),
      },
    });
    return order;
  } catch (error) {
    console.error("Failed to update subscription order:", error);
    throw error;
  }
}

export async function getOrderByOrderNo(orderNo: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { orderNo },
    });
    return order;
  } catch (error) {
    console.error("Failed to get order:", error);
    throw error;
  }
}

export async function getOrdersByUser(userUuid: string) {
  try {
    const orders = await prisma.order.findMany({
      where: { userUuid },
      orderBy: { createdAt: "desc" },
    });
    return orders;
  } catch (error) {
    console.error("Failed to get user orders:", error);
    throw error;
  }
}
