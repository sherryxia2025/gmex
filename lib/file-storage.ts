import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { nanoid } from "nanoid";

const STORAGE_DIR = join(process.cwd(), "public", "generated");

/**
 * Initialize storage directory
 */
export async function initStorageDir() {
  try {
    await mkdir(STORAGE_DIR, { recursive: true });
  } catch (error) {
    console.error("Failed to create storage directory:", error);
  }
}

/**
 * Save file from URL or base64 data
 */
export async function saveGeneratedFile(
  data: string | Buffer,
  extension: string,
): Promise<string> {
  await initStorageDir();

  const filename = `${nanoid()}.${extension}`;
  const filepath = join(STORAGE_DIR, filename);

  let buffer: Buffer;

  if (typeof data === "string") {
    // Check if it's a base64 data URL
    if (data.startsWith("data:")) {
      const base64Data = data.split(",")[1];
      buffer = Buffer.from(base64Data, "base64");
    }
    // Check if it's a URL
    else if (data.startsWith("http://") || data.startsWith("https://")) {
      const response = await fetch(data);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }
      buffer = Buffer.from(await response.arrayBuffer());
    }
    // Otherwise treat as base64
    else {
      buffer = Buffer.from(data, "base64");
    }
  } else {
    buffer = data;
  }

  await writeFile(filepath, buffer);

  // Return the public URL path
  return `/generated/${filename}`;
}

/**
 * Determine file extension from content type or format
 */
export function getFileExtension(
  contentType?: string,
  format?: string,
): string {
  if (format) {
    return format.toLowerCase();
  }

  if (contentType) {
    const typeMap: Record<string, string> = {
      "image/png": "png",
      "image/jpeg": "jpg",
      "image/jpg": "jpg",
      "image/webp": "webp",
      "image/gif": "gif",
      "video/mp4": "mp4",
      "video/webm": "webm",
      "video/quicktime": "mov",
    };
    return typeMap[contentType.toLowerCase()] || "png";
  }

  return "png";
}
