import { type InferPageType, loader } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";
import { icons } from "lucide-react";
import { createElement } from "react";
import { docs } from "@/.source";
import { i18n } from "@/lib/i18n";

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: "/docs",
  i18n: i18n,
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
  icon(icon) {
    if (!icon) {
      // You may set a default icon
      return;
    }
    if (icon in icons) return createElement(icons[icon as keyof typeof icons]);
  },
});

export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, "image.png"];

  return {
    segments,
    url: `/og/docs/${segments.join("/")}`,
  };
}

export async function getLLMText(page: InferPageType<typeof source>) {
  // Get processed text if available, otherwise use title and description
  let processed = "";
  try {
    // Try to get processed text if the method exists
    if (
      typeof (page.data as { getText?: (key: string) => Promise<string> })
        .getText === "function"
    ) {
      processed = await (
        page.data as { getText: (key: string) => Promise<string> }
      ).getText("processed");
    } else {
      // Fallback: use description or empty string
      processed = (page.data.description as string) || "";
    }
  } catch {
    processed = (page.data.description as string) || "";
  }

  return `# ${page.data.title} (${page.url})

${processed}`;
}
