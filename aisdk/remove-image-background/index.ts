import { replicate } from "../models/replicate";

const removeImageBackgroundModels = {
  "851-labs/background-remover": (input: {
    image: string;
    format: "png" | "jpg";
    reverse?: boolean;
    threshold?:
      | 0
      | 0.05
      | 0.1
      | 0.15
      | 0.2
      | 0.25
      | 0.3
      | 0.35
      | 0.4
      | 0.45
      | 0.5
      | 0.55
      | 0.6
      | 0.65
      | 0.7
      | 0.75
      | 0.8
      | 0.85
      | 0.9
      | 0.95
      | 1;
    // Background type: 'rgba', 'map', 'green', 'white', [R,G,B] array, 'blur', 'overlay', or path to an image.
    background_type?:
      | "rgba"
      | "map"
      | "green"
      | "white"
      | [number, number, number]
      | "blur"
      | "overlay"
      | string;
  }) => {
    return replicate.run(
      "851-labs/background-remover:a029dff38972b5fda4ec5d75d7d1cd25aeff621d2cf4946a41055d7db66b80bc",
      {
        input,
      },
    );
  },
  "lucataco/remove-bg": (input: { image: string }) => {
    return replicate.run(
      "lucataco/remove-bg:95fcc2a26d3899cd6c2691c900465aaeff466285a65c14638cc5f36f34befaf1",
      {
        input,
      },
    );
  },
  "bria/remove-background": (input: {
    image: string;
    image_url?: string;
    content_moderation?: boolean;
    preserve_partial_alpha?: boolean;
  }) => {
    return replicate.run("bria/remove-background", {
      input,
    });
  },
};

export function removeImageBackground<
  T extends keyof typeof removeImageBackgroundModels,
>(model: T, input: Parameters<(typeof removeImageBackgroundModels)[T]>[0]) {
  return removeImageBackgroundModels[model](input as any);
}
