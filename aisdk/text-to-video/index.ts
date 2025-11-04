import { replicate } from "../models/replicate";

const videoModels = {
  "google/veo-3": (input: {
    prompt: string;
    duration?: 4 | 6 | 8;
    resolution?: "720p" | "1080p";
    aspect_ratio?: "16:9" | "9:16";
    generate_audio?: boolean;
  }) => {
    return replicate.run("google/veo-3", {
      input,
    });
  },
  "bytedance/seedance-1-pro": (input: {
    fps: 24;
    prompt: string;
    duration?: 5;
    resolution?: "1080p" | "720p" | "480p";
    aspect_ratio?: "16:9" | "9:16" | "1:1" | "21:9" | "4:3" | "3:4" | "9:21";
    camera_fixed?: boolean;
  }) => {
    return replicate.run("bytedance/seedance-1-pro", {
      input,
    });
  },
  "minimax/hailuo-02": (input: {
    prompt: string;
    duration?: 6 | 10;
    resolution?: "1080p" | "521p" | "768p";
    prompt_optimizer?: boolean;
  }) => {
    return replicate.run("minimax/hailuo-02", {
      input,
    });
  },
  "kwaivgi/kling-v2.5-turbo-pro": (input: {
    prompt: string;
    duration?: 5 | 10;
    aspect_ratio?: "16:9" | "9:16" | "1:1";
    negative_prompt?: string;
  }) => {
    return replicate.run("kwaivgi/kling-v2.5-turbo-pro", {
      input,
    });
  },
  "openai/sora-2": (input: {
    seconds?: 4 | 8 | 12;
    aspect_ratio?: "portrait" | "landscape";
    prompt: string;
  }) => {
    return replicate.run("openai/sora-2", {
      input,
    });
  },
} as const;

export function generateVideo<T extends keyof typeof videoModels>(
  model: T,
  input: Parameters<(typeof videoModels)[T]>[0],
) {
  return videoModels[model](input as any);
}
