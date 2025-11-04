import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { PrismaClient } from "@/prisma/generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";
    const status = searchParams.get("status") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status) {
      if (status === "Active") {
        where.emailVerified = true;
      } else if (status === "Pending") {
        where.emailVerified = false;
      }
    }

    // Get users with pagination
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          sessions: {
            select: {
              createdAt: true,
              ipAddress: true,
              userAgent: true,
            },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
          accounts: {
            select: {
              providerId: true,
              createdAt: true,
            },
            ...(role && { where: { providerId: role } }),
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    // Filter users by providerId if specified
    let filteredUsers = users;
    if (role) {
      filteredUsers = users.filter((user) =>
        user.accounts.some((account) => account.providerId === role),
      );
    }

    // Get statistics
    const stats = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: { emailVerified: true },
      }),
      prisma.user.count({
        where: { emailVerified: false },
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
      }),
    ]);

    const [totalUsers, verifiedUsers, unverifiedUsers, newUsers] = stats;

    // Transform users data
    const transformedUsers = filteredUsers.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLogin: user.sessions[0]?.createdAt || null,
      provider: user.accounts[0]?.providerId || "email",
      providerId: user.accounts[0]?.providerId || "email",
      status: user.emailVerified ? "Active" : "Pending",
      githubId: (user as { githubId?: string | null }).githubId || null,
    }));

    return NextResponse.json({
      success: true,
      data: {
        users: transformedUsers,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        stats: {
          totalUsers,
          verifiedUsers,
          unverifiedUsers,
          newUsers,
        },
      },
    });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}
