import { replicate } from "../models/replicate";

const textToImageModels = {
  "bytedance/seedream-4": (input: {
    prompt: string;
    size?: "1K" | "2K" | "4K";
    aspect_ratio?:
      | "1:1"
      | "16:9"
      | "9:16"
      | "4:3"
      | "3:4"
      | "2:3"
      | "3:2"
      | "21:9"
      | "match_input_image";
    sequential_image_generation?: "auto" | "disabled";
    // from 1024 to 2048
    width?: number;
    // from 1024 to 2048
    height?: number;
    // from 1 to 15
    max_images?: number;
    enhance_prompt?: boolean;
  }) => {
    if (input.width && input.width < 1024) {
      throw new Error("Width must be at least 1024");
    }
    if (input.width && input.width > 2048) {
      throw new Error("Width must be at most 2048");
    }
    if (input.height && input.height < 1024) {
      throw new Error("Height must be at least 1024");
    }
    if (input.height && input.height > 2048) {
      throw new Error("Height must be at most 2048");
    }
    if (input.max_images && input.max_images < 1) {
      throw new Error("Max images must be at least 1");
    }
    if (input.max_images && input.max_images > 15) {
      throw new Error("Max images must be at most 15");
    }
    return replicate.run("bytedance/seedream-4", { input });
  },
  "black-forest-labs/flux-schnell": (input: {
    prompt: string;
    aspect_ratio?:
      | "1:1"
      | "16:9"
      | "9:16"
      | "4:3"
      | "3:4"
      | "2:3"
      | "3:2"
      | "4:5"
      | "5:4"
      | "21:9"
      | "9:21";
    output_format?: "webp" | "png" | "jpg";
    // from 0 to 100
    output_quality?: number;
    seed?: number;
    megapixels?: 1 | 0.25;
    num_inference_steps?: 1 | 2 | 3 | 4;
    disable_safety_checker?: boolean;
    go_fast?: boolean;
  }) => {
    if (input.output_quality && input.output_quality < 0) {
      throw new Error("Output quality must be at least 0");
    }
    if (input.output_quality && input.output_quality > 100) {
      throw new Error("Output quality must be at most 100");
    }
    if (input.megapixels && input.megapixels < 1) {
      throw new Error("Megapixels must be at least 1");
    }
    if (input.megapixels && input.megapixels > 0.25) {
      throw new Error("Megapixels must be at most 0.25");
    }
    return replicate.run("black-forest-labs/flux-schnell", { input });
  },
  "qwen/qwen-image": (input: {
    prompt: string;
    image_size?: "optimize_for_quality" | "optimize_for_speed";
    aspect_ratio?: "1:1" | "16:9" | "9:16" | "2:3" | "3:2" | "3:4" | "4:3";
    output_format?: "webp" | "png" | "jpg";
    guidance?: 2 | 2.5 | 3 | 3.5;
    seed?: number;
    strength?: 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1;
    lora_scale?: number;
    // url only
    lora_weights?: string;
    extra_lora_scale?: string;
    // url only
    extra_lora_weights?: string;
    go_fast?: boolean;
    enhance_prompt?: boolean;
    output_quality?: number;
    negative_prompt?: string;
    num_inference_steps?:
      | 28
      | 29
      | 30
      | 31
      | 32
      | 33
      | 34
      | 35
      | 36
      | 37
      | 38
      | 39
      | 40
      | 41
      | 42
      | 43
      | 44
      | 45
      | 46
      | 47
      | 48
      | 49
      | 50;
    disable_safety_checker?: boolean;
  }) => {
    if (input.output_quality && input.output_quality < 0) {
      throw new Error("Output quality must be at least 0");
    }
    if (input.output_quality && input.output_quality > 100) {
      throw new Error("Output quality must be at most 100");
    }
    if (input.num_inference_steps && input.num_inference_steps < 28) {
      throw new Error("Num inference steps must be at least 28");
    }
    if (input.num_inference_steps && input.num_inference_steps > 50) {
      throw new Error("Num inference steps must be at most 50");
    }
    return replicate.run("qwen/qwen-image", { input });
  },
  "google/nano-banana": (input: {
    prompt: string;
    aspect_ratio?:
      | "match_input_image"
      | "1:1"
      | "16:9"
      | "9:16"
      | "2:3"
      | "3:2"
      | "3:4"
      | "4:3"
      | "4:5"
      | "5:4"
      | "21:9";
    output_format?: "png" | "jpg";
  }) => {
    return replicate.run("google/nano-banana", { input });
  },
};

export function textToImage<T extends keyof typeof textToImageModels>(
  model: T,
  input: Parameters<(typeof textToImageModels)[T]>[0],
) {
  return textToImageModels[model](input as any);
}
