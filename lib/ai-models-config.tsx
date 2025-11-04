import {
  Film,
  Image,
  type LucideIcon,
  MessageSquare,
  Palette,
  Scissors,
  Video,
} from "lucide-react";

export interface ModelConfig {
  icon: LucideIcon;
  models: Record<string, string>;
  requiresImage?: boolean;
  category: "text" | "image" | "video";
}

export const AI_MODEL_CONFIGS = {
  "text-to-text": {
    icon: MessageSquare,
    category: "text" as const,
    models: {
      "openai/gpt-5": "OpenAI GPT-5",
      "anthropic/claude-4.5-sonnet": "Anthropic Claude 4.5 Sonnet",
      "deepseek-ai/deepseek-v3.1": "DeepSeek V3.1",
      "google/gemini-2.5-flash": "Google Gemini 2.5 Flash",
    },
  },
  "text-to-image": {
    icon: Image,
    category: "image" as const,
    models: {
      "black-forest-labs/flux-schnell": "Flux Schnell",
      "bytedance/seedream-4": "ByteDance SeeDream 4",
      "qwen/qwen-image": "Qwen Image",
      "google/nano-banana": "Google Nano Banana",
    },
  },
  "text-to-video": {
    icon: Film,
    category: "video" as const,
    models: {
      "kwaivgi/kling-v2.5-turbo-pro": "Kling V2.5 Turbo Pro",
      "google/veo-3": "Google Veo 3",
      "bytedance/seedance-1-pro": "ByteDance SeeDance 1 Pro",
      "minimax/hailuo-02": "Minimax Hailuo 02",
      "openai/sora-2": "OpenAI Sora2",
    },
  },
  "image-to-video": {
    icon: Video,
    category: "video" as const,
    models: {
      "kwaivgi/kling-v2.1": "Kling V2.1",
      "google/veo-3": "Google Veo 3",
      "bytedance/seedance-1-pro": "ByteDance SeeDance 1 Pro",
      "minimax/hailuo-02": "Minimax Hailuo 02",
      "openai/sora-2": "OpenAI Sora2",
    },
    requiresImage: true,
  },
  "image-to-image": {
    icon: Palette,
    category: "image" as const,
    models: {
      "qwen/qwen-image-edit": "Qwen Image Edit",
      "bytedance/seedream-4": "ByteDance SeeDream 4",
      "google/nano-banana": "Google Nano Banana",
      "black-forest-labs/flux-kontext-max": "Flux Kontext Max",
    },
    requiresImage: true,
  },
  "remove-bg": {
    icon: Scissors,
    category: "image" as const,
    models: {
      "lucataco/remove-bg": "Lucataco Remove BG",
      "851-labs/background-remover": "851 Labs Background Remover",
      "bria/remove-background": "Bria Remove Background",
    },
    requiresImage: true,
  },
} as const satisfies Record<string, ModelConfig>;

export type ModelType = keyof typeof AI_MODEL_CONFIGS;

export function getAllModels(): Array<{
  type: ModelType;
  modelId: string;
  modelName: string;
}> {
  const allModels: Array<{
    type: ModelType;
    modelId: string;
    modelName: string;
  }> = [];

  for (const [type, config] of Object.entries(AI_MODEL_CONFIGS)) {
    for (const [modelId, modelName] of Object.entries(config.models)) {
      allModels.push({
        type: type as ModelType,
        modelId,
        modelName,
      });
    }
  }

  return allModels;
}

export function getModelsByCategory(
  category: "text" | "image" | "video",
): Array<{
  type: ModelType;
  modelId: string;
  modelName: string;
}> {
  const models: Array<{
    type: ModelType;
    modelId: string;
    modelName: string;
  }> = [];

  for (const [type, config] of Object.entries(AI_MODEL_CONFIGS)) {
    if (config.category === category) {
      for (const [modelId, modelName] of Object.entries(config.models)) {
        models.push({
          type: type as ModelType,
          modelId,
          modelName,
        });
      }
    }
  }

  return models;
}
