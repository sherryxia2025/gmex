import type { NextRequest } from "next/server";
import { AI_MODEL_CONFIGS, type ModelType } from "@/lib/ai-models-config";

export async function POST(request: NextRequest) {
  try {
    const { testType, models, prompt, imageUrl } = await request.json();

    if (!testType || !models || !Array.isArray(models)) {
      return Response.json(
        { error: "testType and models array are required" },
        { status: 400 },
      );
    }

    if (!(testType in AI_MODEL_CONFIGS)) {
      return Response.json(
        { error: `Invalid test type: ${testType}` },
        { status: 400 },
      );
    }

    const config = AI_MODEL_CONFIGS[testType as ModelType];

    if ("requiresImage" in config && config.requiresImage && !imageUrl) {
      return Response.json(
        { error: "imageUrl is required for this test type" },
        { status: 400 },
      );
    }

    if (
      !("requiresImage" in config && config.requiresImage) &&
      testType !== "remove-bg" &&
      !prompt
    ) {
      return Response.json(
        { error: "prompt is required for this test type" },
        { status: 400 },
      );
    }

    const results: Record<
      string,
      {
        status: "pending" | "success" | "error";
        result?: string | string[] | { text: string };
        error?: string;
      }
    > = {};

    for (const model of models) {
      results[model] = { status: "pending" };
    }

    const testPromises = models.map(async (model: string) => {
      try {
        let endpoint = "";
        let body: Record<string, unknown> = {};

        switch (testType) {
          case "text-to-text":
            endpoint = "/api/ai/text-to-text";
            body = { prompt, model };
            break;
          case "text-to-image":
            endpoint = "/api/ai/text-to-image";
            body = { prompt, model };
            break;
          case "text-to-video":
            endpoint = "/api/ai/text-to-video";
            body = { prompt, model };
            break;
          case "image-to-video":
            endpoint = "/api/ai/image-to-video";
            body = { prompt, image: imageUrl, model };
            break;
          case "image-to-image":
            endpoint = "/api/ai/image-to-image";
            body = { prompt, image: imageUrl, model };
            break;
          case "remove-bg":
            endpoint = "/api/ai/remove-bg";
            body = { image: imageUrl, model };
            break;
        }

        const response = await fetch(`${request.nextUrl.origin}${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          const errorData = await response.json();
          results[model] = {
            status: "error",
            error: errorData.error || "Request failed",
          };
          return;
        }

        if (testType === "text-to-text") {
          const reader = response.body?.getReader();
          const decoder = new TextDecoder();
          let text = "";

          if (reader) {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              text += decoder.decode(value);
            }
          }

          results[model] = {
            status: "success",
            result: { text },
          };
        } else {
          const data = (await response.json()) as { url: string | string[] };
          results[model] = {
            status: "success",
            result: data.url,
          };
        }
      } catch (error) {
        results[model] = {
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    });

    await Promise.all(testPromises);

    return Response.json({ results });
  } catch (error) {
    console.error("Batch test error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
