import { replicate } from "../models/replicate";

const imageToImageModels = {
  "bytedance/seedream-4": (input: {
    size?: "1K" | "2K" | "4K";
    aspect_ratio?:
      | "1:1"
      | "16:9"
      | "9:16"
      | "2:3"
      | "3:2"
      | "3:4"
      | "4:3"
      | "match_input_image";
    sequential_image_generation?: "disabled" | "auto";
    // from 1024 to 2048
    width?: number;
    // from 1024 to 2048
    height?: number;
    prompt: string;
    max_images?:
      | 1
      | 2
      | 3
      | 4
      | 5
      | 6
      | 7
      | 8
      | 9
      | 10
      | 11
      | 12
      | 13
      | 14
      | 15;
    // max input number is 10
    image_input: string[];
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
    if (input.image_input.length === 0) {
      throw new Error("Image input must be at least 1");
    }
    if (input.image_input.length > 10) {
      throw new Error("Image input must be at most 10");
    }

    return replicate.run("bytedance/seedream-4", { input });
  },
  "google/nano-banana": (input: {
    prompt: string;
    image_input: string[];
    aspect_ratio?:
      | "1:1"
      | "16:9"
      | "9:16"
      | "2:3"
      | "3:2"
      | "3:4"
      | "4:3"
      | "4:5"
      | "5:4"
      | "21:9"
      | "9:21"
      | "match_input_image";
    output_format?: "jpg" | "png";
  }) => {
    return replicate.run("google/nano-banana", { input });
  },
  "qwen/qwen-image-edit": (input: {
    prompt: string;
    image: string;
    aspect_ratio?:
      | "1:1"
      | "16:9"
      | "9:16"
      | "3:4"
      | "4:3"
      | "match_input_image";
    output_format?: "jpg" | "png" | "webp";
    // from 0 to 100
    output_quality?: number;
    seed?: number;
    go_fast?: boolean;
    disable_safety_checker?: boolean;
  }) => {
    if (input.output_quality && input.output_quality < 0) {
      throw new Error("Output quality must be at least 0");
    }
    if (input.output_quality && input.output_quality > 100) {
      throw new Error("Output quality must be at most 100");
    }
    return replicate.run("qwen/qwen-image-edit", { input });
  },
  "black-forest-labs/flux-kontext-max": (input: {
    prompt: string;
    input_image: string;
    aspect_ratio?:
      | "1:1"
      | "1:2"
      | "2:1"
      | "16:9"
      | "9:16"
      | "2:3"
      | "3:2"
      | "3:4"
      | "4:3"
      | "4:5"
      | "5:4"
      | "21:9"
      | "9:21"
      | "match_input_image";
    output_format?: "jpg" | "png";
    safety_tolerance?: 1 | 2 | 3 | 4 | 5 | 6;
    seed?: number;
    prompt_upsampling?: boolean;
  }) => {
    return replicate.run("black-forest-labs/flux-kontext-max", { input });
  },
};

export function imageToImage<T extends keyof typeof imageToImageModels>(
  model: T,
  input: Parameters<(typeof imageToImageModels)[T]>[0],
) {
  return imageToImageModels[model](input as any);
}
