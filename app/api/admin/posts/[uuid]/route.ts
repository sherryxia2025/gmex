import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { findPostByUuid, updatePost } from "@/models/post";

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

    const exists = await findPostByUuid(uuid);
    if (!exists) {
      return NextResponse.json(
        { success: false, error: "post not found" },
        { status: 404 },
      );
    }

    const updated = await updatePost(uuid, { status, updatedAt: new Date() });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Failed to update post status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update post status" },
      { status: 500 },
    );
  }
}
