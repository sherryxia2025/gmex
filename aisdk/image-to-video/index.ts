import { replicate } from "../models/replicate";

const imageToVideoModels = {
  "kwaivgi/kling-v2.1": (input: {
    prompt: string;
    negative_prompt?: string;
    start_image: string;
    mode?: "standard" | "pro";
    duration?: 5 | 10;
    end_image?: string;
  }) => {
    return replicate.run("kwaivgi/kling-v2.1", { input });
  },
  "google/veo-3": (input: {
    prompt: string;
    aspect_ratio?: "16:9" | "9:16";
    duration?: 4 | 6 | 8;
    image: string;
    negative_prompt?: string;
    resolution?: "720p" | "1080p";
    generate_audio?: boolean;
    seed?: number;
  }) => {
    return replicate.run("google/veo-3", { input });
  },
  "bytedance/seedance-1-pro": (input: {
    resolution: "480p" | "720p" | "1080p";
    aspect_ratio?: "16:9" | "9:16" | "1:1" | "4:3" | "3:4" | "21:9" | "9:21";
    image: string;
    fps: 24;
    negative_prompt?: string;
    seed?: number;
    prompt: string;
    duration?: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    camera_fixed?: boolean;
    last_frame_image?: string;
  }) => {
    return replicate.run("bytedance/seedance-1-pro", { input });
  },
  "minimax/hailuo-02": (input: {
    prompt: string;
    first_frame_image: string;
    last_frame_image?: string;
    duration?: 6 | 10;
    resolution?: "512p" | "768p" | "1080p";
    prompt_optimizer?: boolean;
  }) => {
    return replicate.run("minimax/hailuo-02", { input });
  },
  "openai/sora-2": (input: {
    seconds?: 4 | 8 | 12;
    aspect_ratio?: "portrait" | "portrait";
    prompt: string;
    input_reference?: string;
  }) => {
    return replicate.run("openai/sora-2", {
      input,
    });
  },
};

export function imageToVideo<T extends keyof typeof imageToVideoModels>(
  model: T,
  input: Parameters<(typeof imageToVideoModels)[T]>[0],
) {
  return imageToVideoModels[model](input as any);
}
