import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getOrdersByPaidEmail, getOrdersByUserUuid } from "@/models/order";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || !session.user.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userUuid = session.user.id;
    const userEmail = session.user.email;

    // Get user orders
    let orders = await getOrdersByUserUuid(userUuid, 1, 100);
    if (!orders || orders.length === 0) {
      orders = await getOrdersByPaidEmail(userEmail, 1, 100);
    }

    return NextResponse.json({
      success: true,
      orders: orders || [],
    });
  } catch (error) {
    console.error("Failed to fetch user orders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}