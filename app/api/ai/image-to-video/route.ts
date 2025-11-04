import { nanoid } from "nanoid";
import type { NextRequest } from "next/server";
import { imageToVideo } from "@/aisdk";
import { newStorage } from "@/lib/s3-storage";

export async function POST(request: NextRequest) {
  try {
    const { prompt, image, model, ...options } = await request.json();
    const modelId: string = model || "kwaivgi/kling-v2.1";

    if (!prompt) {
      return Response.json({ error: "Prompt is required" }, { status: 400 });
    }

    if (!image) {
      return Response.json({ error: "Image is required" }, { status: 400 });
    }

    let result: any;
    if (modelId === "kwaivgi/kling-v2.1") {
      result = await imageToVideo(modelId, {
        prompt,
        start_image: image,
        mode: options.mode || "standard",
        duration: options.duration || 5,
        negative_prompt: options.negative_prompt,
        end_image: options.end_image,
      });
    } else if (modelId === "google/veo-3") {
      result = await imageToVideo(modelId, {
        prompt,
        image,
        aspect_ratio: options.aspect_ratio || "16:9",
        duration: options.duration || 4,
        negative_prompt: options.negative_prompt,
        resolution: options.resolution || "720p",
        generate_audio: options.generate_audio || false,
        seed: options.seed,
      });
    } else if (modelId === "bytedance/seedance-1-pro") {
      result = await imageToVideo(model, {
        prompt,
        image,
        resolution: options.resolution || "720p",
        aspect_ratio: options.aspect_ratio || "16:9",
        fps: 24,
        duration: options.duration || 5,
        negative_prompt: options.negative_prompt,
        seed: options.seed,
        camera_fixed: options.camera_fixed,
        last_frame_image: options.last_frame_image,
      });
    } else if (modelId === "minimax/hailuo-02") {
      result = await imageToVideo(modelId, {
        prompt,
        first_frame_image: image,
        duration: options.duration || 6,
        resolution: options.resolution,
        last_frame_image: options.last_frame_image,
        prompt_optimizer: options.prompt_optimizer || false,
      });
    } else if (modelId === "openai/sora-2") {
      result = await imageToVideo(modelId, {
        prompt,
        input_reference: image,
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
    console.error("Image to video error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
