import { nanoid } from "nanoid";
import type { NextRequest } from "next/server";
import { textToImage } from "@/aisdk";
import { newStorage } from "@/lib/s3-storage";

export async function POST(request: NextRequest) {
  try {
    const { prompt, model, ...options } = await request.json();

    const modelId: string = model || "black-forest-labs/flux-schnell";

    if (!prompt) {
      return Response.json({ error: "Prompt is required" }, { status: 400 });
    }

    let result: any;
    let outputFormat = "png";

    if (modelId === "black-forest-labs/flux-schnell") {
      outputFormat = options.output_format || "png";
      result = await textToImage(modelId, {
        prompt,
        aspect_ratio: options.aspect_ratio || "1:1",
        output_format: outputFormat,
        ...options,
      });
    } else if (modelId === "bytedance/seedream-4") {
      result = await textToImage(modelId, {
        prompt,
        size: options.size || "1K",
        aspect_ratio: options.aspect_ratio || "1:1",
        ...options,
      });
    } else if (modelId === "qwen/qwen-image") {
      result = await textToImage(modelId, {
        prompt,
        image_size: options.image_size || "optimize_for_quality",
        aspect_ratio: options.aspect_ratio || "1:1",
        ...options,
      });
    } else if (modelId === "google/nano-banana") {
      outputFormat = options.output_format || "png";
      result = await textToImage(modelId, {
        prompt,
        aspect_ratio: options.aspect_ratio || "1:1",
        output_format: outputFormat,
        ...options,
      });
    } else {
      throw new Error(`Model ${modelId} not supported`);
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
      message: "Image generated and saved successfully",
    });
  } catch (error) {
    console.error("Text to image error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
