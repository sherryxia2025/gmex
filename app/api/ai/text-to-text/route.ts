import type { NextRequest } from "next/server";
import { textToTextModels } from "@/aisdk";

export async function POST(request: NextRequest) {
  try {
    const { prompt, model, ...options } = await request.json();
    const modelId: keyof typeof textToTextModels = model || "openai/gpt-5";

    if (!prompt) {
      return Response.json({ error: "Prompt is required" }, { status: 400 });
    }

    const modelFunction = textToTextModels[modelId];
    if (!modelFunction) {
      return Response.json(
        { error: `Model ${modelId} not supported` },
        { status: 400 },
      );
    }

    // Get the stream from the model function
    const stream = await modelFunction({
      prompt,
      ...options,
    });

    // Create a readable stream for the response
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream as AsyncIterable<unknown>) {
            // Replicate streams return text chunks or event objects
            const text = typeof chunk === "string" ? chunk : String(chunk);
            controller.enqueue(encoder.encode(text));
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Text to text error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
