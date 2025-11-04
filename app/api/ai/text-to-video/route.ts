import { nanoid } from "nanoid";
import type { NextRequest } from "next/server";
import { generateVideo } from "@/aisdk";
import { newStorage } from "@/lib/s3-storage";

export async function POST(request: NextRequest) {
  try {
    const { prompt, model, ...options } = await request.json();

    const modelId: string = model || "kwaivgi/kling-v2.5-turbo-pro";

    if (!prompt) {
      return Response.json({ error: "Prompt is required" }, { status: 400 });
    }

    let result: any;
    if (modelId === "google/veo-3") {
      result = await generateVideo(modelId, {
        prompt,
        duration: options.duration || 4,
        resolution: options.resolution || "720p",
        aspect_ratio: options.aspect_ratio || "16:9",
        generate_audio: options.generate_audio || false,
      });
    } else if (modelId === "bytedance/seedance-1-pro") {
      result = await generateVideo(modelId, {
        prompt,
        fps: 24,
        duration: 5,
        resolution: options.resolution || "720p",
        aspect_ratio: options.aspect_ratio || "16:9",
        camera_fixed: options.camera_fixed,
      });
    } else if (modelId === "minimax/hailuo-02") {
      result = await generateVideo(modelId, {
        prompt,
        duration: options.duration || 6,
        prompt_optimizer: options.prompt_optimizer || false,
      });
    } else if (modelId === "kwaivgi/kling-v2.5-turbo-pro") {
      result = await generateVideo(modelId, {
        prompt,
        duration: options.duration || 5,
        aspect_ratio: options.aspect_ratio || "16:9",
        negative_prompt: options.negative_prompt,
      });
    } else if (modelId === "openai/sora-2") {
      result = await generateVideo(model, {
        prompt,
        seconds: options.seconds || 4,
        aspect_ratio: options.aspect_ratio || "portrait",
      });
    }

    const storage = newStorage();

    // Save the generated image to local storage
    let videoUrl: string;
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
      videoUrl = (
        await storage.uploadFile({
          body: imageBuffer,
          key: `videos/${nanoid()}.mp4`,
          contentType: `video/mp4`,
        })
      ).url;
    } else if (typeof result === "string") {
      // If result is a string (URL or base64)
      videoUrl = (
        await storage.uploadFile({
          body: Buffer.from(result),
          key: `videos/${nanoid()}.mp4`,
          contentType: `video/mp4`,
        })
      ).url;
    } else {
      throw new Error("Unexpected result format");
    }

    return Response.json({
      success: true,
      url: videoUrl,
      message: "Video generated and saved successfully",
    });
  } catch (error) {
    console.error("Text to video error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
