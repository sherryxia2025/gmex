import type { NextRequest } from "next/server";
import { imageToImage } from "@/aisdk";
import { upload } from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    const { prompt, image, model, ...options } = await request.json();
    const modelId: string = model || "qwen/qwen-image-edit";

    if (!prompt) {
      return Response.json({ error: "Prompt is required" }, { status: 400 });
    }

    if (
      !image &&
      model !== "bytedance/seedream-4" &&
      model !== "google/nano-banana"
    ) {
      return Response.json({ error: "Image is required" }, { status: 400 });
    }

    let result: any;
    let outputFormat = "png";
    if (modelId === "bytedance/seedream-4") {
      let imageInput = options.image_input || image;
      if (!imageInput) {
        return Response.json(
          { error: "image_input is required for this model" },
          { status: 400 },
        );
      }
      if (!Array.isArray(imageInput)) {
        imageInput = [imageInput];
      }
      result = await imageToImage(modelId, {
        prompt,
        image_input: imageInput,
        size: options.size || "1K",
        aspect_ratio: options.aspect_ratio || "1:1",
        ...options,
      });
    } else if (modelId === "google/nano-banana") {
      let imageInput = options.image_input || image;
      if (!imageInput) {
        return Response.json(
          { error: "image_input is required for this model" },
          { status: 400 },
        );
      }
      if (!Array.isArray(imageInput)) {
        imageInput = [imageInput];
      }
      outputFormat = options.output_format || "png";
      result = await imageToImage(modelId, {
        prompt,
        image_input: imageInput,
        aspect_ratio: options.aspect_ratio || "1:1",
      });
    } else if (modelId === "qwen/qwen-image-edit") {
      outputFormat = options.output_format || "png";
      result = await imageToImage(modelId, {
        prompt,
        image,
        aspect_ratio: options.aspect_ratio || "1:1",
        output_format: outputFormat,
        ...options,
      });
    } else if (modelId === "black-forest-labs/flux-kontext-max") {
      outputFormat = options.output_format || "png";
      result = await imageToImage(modelId, {
        prompt,
        input_image: image,
        aspect_ratio: options.aspect_ratio || "1:1",
        output_format: outputFormat,
        ...options,
      });
    }

    console.log("Generated image:", result);

    // Save the generated image to storage
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
      const uploadResult = await upload({
        body: imageBuffer,
        contentType: `image/${outputFormat}`,
      });
      imageUrl = uploadResult.url;
    } else if (typeof result === "string") {
      // If result is a string (URL or base64)
      const imageBuffer = Buffer.from(result);
      const uploadResult = await upload({
        body: imageBuffer,
        contentType: `image/${outputFormat}`,
      });
      imageUrl = uploadResult.url;
    } else {
      throw new Error("Unexpected result format");
    }

    return Response.json({
      success: true,
      url: imageUrl,
      message: "Image generated and saved successfully",
    });
  } catch (error) {
    console.error("Image to image error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
