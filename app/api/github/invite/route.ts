import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import enLanding from "@/i18n/pages/landing/en.json";
import zhLanding from "@/i18n/pages/landing/zh.json";
import { auth } from "@/lib/auth";
import { inviteToRepo } from "@/lib/github-invite";
import prisma from "@/prisma";

export async function POST(request: NextRequest) {
  try {
    const { username, orderNo } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 },
      );
    }

    if (!orderNo) {
      return NextResponse.json(
        { error: "orderNo is required" },
        { status: 400 },
      );
    }

    // get current session user
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // enforce single github binding per user
    const currentUser = (await prisma.user.findUnique({
      where: { id: session.user.id },
    })) as unknown as { githubId: string | null } | null;

    if (currentUser?.githubId && currentUser.githubId !== username) {
      return NextResponse.json(
        { error: "GitHub account already bound" },
        { status: 400 },
      );
    }

    // find order and repo name
    const order = await prisma.order.findUnique({
      where: { orderNo: orderNo },
      select: {
        status: true,
        orderNo: true,
        productName: true,
        productId: true,
        paidEmail: true,
        userEmail: true,
        credits: true,
        githubRepoName: true,
        orderDetail: true,
        paidDetail: true,
      } as unknown as Record<string, unknown>,
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    let repoName =
      (order as unknown as { githubRepoName?: string | null }).githubRepoName ||
      null;

    // Prefer reading from order meta first (orderDetail or paidDetail)
    if (!repoName) {
      const o = order as unknown as {
        orderDetail?: string | null;
        paidDetail?: string | null;
      };
      // orderDetail: our own created payload
      if (o.orderDetail) {
        try {
          const od = JSON.parse(o.orderDetail);
          const candidate =
            od?.metadata?.github_repo_name || od?.github_repo_name;
          if (candidate && typeof candidate === "string") {
            repoName = candidate;
          }
        } catch {}
      }
      // paidDetail: stripe webhook/session payload
      if (!repoName && o.paidDetail) {
        try {
          const pd = JSON.parse(o.paidDetail);
          const candidate = pd?.metadata?.github_repo_name;
          if (candidate && typeof candidate === "string") {
            repoName = candidate;
          }
        } catch {}
      }
      if (repoName) {
        await prisma.order.update({
          where: { orderNo },
          data: { githubRepoName: repoName } as unknown as Record<
            string,
            unknown
          >,
        });
      }
    }

    // Fallback: derive from landing metadata by productId or productName
    if (!repoName) {
      const allPlans = [
        ...(enLanding?.pricing?.plans || []),
        ...(zhLanding?.pricing?.plans || []),
      ] as Array<{
        name: string;
        metadata?: {
          product_id?: string;
          product_name?: string;
          github_repo_name?: string;
        };
      }>;
      const o = order as unknown as {
        productId?: string | null;
        productName?: string | null;
      };
      const matchedPlan = allPlans.find(
        (p) =>
          (p.metadata?.product_id &&
            p.metadata.product_id === (o.productId || "")) ||
          (p.metadata?.product_name &&
            p.metadata.product_name === (o.productName || "")) ||
          p.name === (o.productName || ""),
      );
      repoName = matchedPlan?.metadata?.github_repo_name || null;

      if (repoName) {
        // persist back to order for future calls
        await prisma.order.update({
          where: { orderNo },
          data: { githubRepoName: repoName } as unknown as Record<
            string,
            unknown
          >,
        });
      }
    }

    if (!repoName) {
      return NextResponse.json(
        { error: "No githubRepoName available for this order" },
        { status: 400 },
      );
    }

    const result = await inviteToRepo(username, repoName);

    // Persist githubUsername on the specific order, bind once
    const existingGithubUsername = (
      order as unknown as {
        githubUsername?: string | null;
      }
    ).githubUsername;
    if (!existingGithubUsername) {
      await prisma.order.update({
        where: { orderNo },
        data: { githubUsername: username } as unknown as Record<
          string,
          unknown
        >,
      });
    }

    // Note: user-level githubId not persisted (order-level binding only)

    return NextResponse.json({
      success: true,
      message: "GitHub repository invitation sent successfully",
      data: result,
    });
  } catch (error) {
    console.error("Failed to send GitHub repository invitation:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to send invitation",
      },
      { status: 500 },
    );
  }
}
