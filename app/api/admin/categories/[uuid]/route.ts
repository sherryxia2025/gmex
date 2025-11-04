import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { findCategoryByUuid, updateCategory } from "@/models/category";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> },
) {
  try {
    const { uuid } = await params;
    const body = await request.json();
    const { status } = body as { status?: string };

    if (!uuid || !status) {
      return NextResponse.json(
        { success: false, error: "uuid and status are required" },
        { status: 400 },
      );
    }

    const exists = await findCategoryByUuid(uuid);
    if (!exists) {
      return NextResponse.json(
        { success: false, error: "category not found" },
        { status: 404 },
      );
    }

    const updated = await updateCategory(uuid, {
      status,
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Failed to update category status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update category status" },
      { status: 500 },
    );
  }
}
