import { nanoid } from "nanoid";
import type { NextRequest } from "next/server";
import { newStorage } from "@/lib/s3-storage";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return Response.json(
        {
          error: `File type not allowed. Allowed types: ${ALLOWED_TYPES.join(", ")}`,
        },
        { status: 400 },
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return Response.json(
        {
          error: `File size exceeds maximum allowed (${MAX_FILE_SIZE / 1024 / 1024}MB)`,
        },
        { status: 400 },
      );
    }

    const storage = newStorage();

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Get file extension
    const extension = file.name.split(".").pop() || "jpg";
    const contentType = file.type || `image/${extension}`;

    // Upload to storage
    const result = await storage.uploadFile({
      body: buffer,
      key: `images/${nanoid()}.${extension}`,
      contentType,
    });

    return Response.json({
      success: true,
      url: result.url,
      message: "Image uploaded successfully",
    });
  } catch (error) {
    console.error("Image upload error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
