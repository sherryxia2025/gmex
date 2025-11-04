import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orderNo: string }> },
) {
  try {
    const { orderNo } = await params;
    const { username } = (await request.json()) as { username?: string };

    if (!username || !username.trim()) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 },
      );
    }

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure order belongs to user (by userUuid or paidEmail)
    const order = await prisma.order.findUnique({ where: { orderNo } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const isOwner =
      order.userUuid === session.user.id ||
      (!!session.user.email && order.userEmail === session.user.email) ||
      (!!session.user.email && order.paidEmail === session.user.email);

    if (!isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (order.status !== "paid") {
      return NextResponse.json({ error: "Order not paid" }, { status: 400 });
    }

    if (order.githubUsername) {
      return NextResponse.json(
        { error: "GitHub already bound for this order" },
        { status: 400 },
      );
    }

    const updated = await prisma.order.update({
      where: { orderNo },
      data: { githubUsername: username },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error("Failed to bind GitHub username:", error);
    return NextResponse.json(
      { error: "Failed to bind GitHub username" },
      { status: 500 },
    );
  }
}
