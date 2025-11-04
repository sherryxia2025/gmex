import { nanoid } from "nanoid";
import type { NextRequest } from "next/server";
import { removeImageBackground } from "@/aisdk";
import { newStorage } from "@/lib/s3-storage";

export async function POST(request: NextRequest) {
  try {
    const { image, model, ...options } = await request.json();

    const modelId: string = model || "lucataco/remove-bg";

    if (!image) {
      return Response.json({ error: "Image is required" }, { status: 400 });
    }

    let result: any;
    let outputFormat = "png";

    if (modelId === "851-labs/background-remover") {
      outputFormat = options.format || "png";
      result = await removeImageBackground(modelId, {
        image,
        format: outputFormat as "png" | "jpg",
        reverse: options.reverse,
        threshold: options.threshold,
        background_type: options.background_type,
      });
    } else if (modelId === "lucataco/remove-bg") {
      result = await removeImageBackground(modelId, {
        image,
      });
    } else if (modelId === "bria/remove-background") {
      result = await removeImageBackground(modelId, {
        image,
        content_moderation: options.content_moderation,
        preserve_partial_alpha: options.preserve_partial_alpha,
      });
    }

    const storage = newStorage();

    // Save the generated image to local storage
    let imageUrl: string;
    if (Array.isArray(result)) {
      result = result[0];
    }

    if (result instanceof ReadableStream) {
      const reader = result.getReader();
      const chunks: Uint8Array[] = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }
      const imageBuffer = Buffer.concat(chunks);
      imageUrl = (
        await storage.uploadFile({
          body: imageBuffer,
          key: `images/${nanoid()}.${outputFormat}`,
          contentType: `image/${outputFormat}`,
        })
      ).url;
    } else if (typeof result === "string") {
      // If result is a string (URL or base64)
      imageUrl = (
        await storage.uploadFile({
          body: Buffer.from(result),
          key: `images/${nanoid()}.${outputFormat}`,
          contentType: `image/${outputFormat}`,
        })
      ).url;
    } else {
      throw new Error("Unexpected result format");
    }

    return Response.json({
      success: true,
      url: imageUrl,
      message: "Background removed and image saved successfully",
    });
  } catch (error) {
    console.error("Remove background error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
