/**
 * Unified storage service abstraction layer
 *
 * Supports multiple storage services, configured via STORAGE_PROVIDER environment variable:
 * - "vercel-blob" (default): Use Vercel Blob storage
 * - "s3": Use S3-compatible storage
 *
 * Environment variable configuration:
 *
 * Vercel Blob (default):
 * - STORAGE_PROVIDER=vercel-blob (optional, default value)
 * - BLOB_READ_WRITE_TOKEN (automatically available on Vercel, or set in .env.local)
 *
 * S3-compatible storage:
 * - STORAGE_PROVIDER=s3
 * - STORAGE_ENDPOINT_WITH_BUCKET=https://your-s3-endpoint.com/bucket-name
 * - STORAGE_ACCESS_KEY=your-access-key
 * - STORAGE_SECRET_KEY=your-secret-key
 * - STORAGE_DOMAIN=your-cdn-domain.com (optional, for CDN URL generation)
 */

import { type PutBlobResult, put } from "@vercel/blob";
import { AwsClient } from "aws4fetch";
import { nanoid } from "nanoid";

/**
 * Upload result interface
 */
export interface UploadResult {
  url: string;
  pathname?: string;
  downloadUrl?: string;
  contentType?: string;
  contentDisposition?: string;
}

/**
 * Upload options
 */
export interface UploadOptions {
  /**
   * File content (Buffer, Blob, File, ArrayBuffer or Uint8Array)
   */
  body: Buffer | Blob | File | ArrayBuffer | Uint8Array;
  /**
   * File pathname (optional, auto-generated if not provided)
   */
  pathname?: string;
  /**
   * Content type (optional)
   */
  contentType?: string;
}

/**
 * Storage provider interface
 */
export interface StorageProvider {
  /**
   * Upload file
   */
  upload(options: UploadOptions): Promise<UploadResult>;
}

/**
 * Generate pathname with extension based on content type
 */
function generatePathname(contentType?: string): string {
  const { ext, dir } = getExtensionAndDirFromContentType(contentType);
  return `${dir}/${nanoid()}.${ext}`;
}

/**
 * Get file extension from content type
 */
function getExtensionAndDirFromContentType(contentType?: string): {
  dir: string;
  ext: string;
} {
  if (!contentType) return { dir: "blobs", ext: "bin" };

  const [type, ext] = contentType.split("/");
  return {
    dir: type ? `${type}s` : "blobs",
    ext: ext === "jpeg" ? "jpg" : ext || "bin",
  };
}

interface S3StorageConfig {
  endpointWithBucket?: string;
  accessKey?: string;
  secretKey?: string;
}

/**
 * S3-compatible storage provider
 */
export class S3StorageProvider implements StorageProvider {
  private endpoint: string;
  private accessKeyId: string;
  private secretAccessKey: string;

  constructor(config?: S3StorageConfig) {
    this.endpoint =
      config?.endpointWithBucket ||
      process.env.STORAGE_ENDPOINT_WITH_BUCKET ||
      "";
    this.accessKeyId =
      config?.accessKey || process.env.STORAGE_ACCESS_KEY || "";
    this.secretAccessKey =
      config?.secretKey || process.env.STORAGE_SECRET_KEY || "";

    // Validate required configuration
    if (!this.endpoint) {
      throw new Error("STORAGE_ENDPOINT_WITH_BUCKET is required");
    }
    if (!this.accessKeyId) {
      throw new Error("STORAGE_ACCESS_KEY is required");
    }
    if (!this.secretAccessKey) {
      throw new Error("STORAGE_SECRET_KEY is required");
    }
  }

  /**
   * Check if environment variables are ready for S3 storage
   */
  static isEnvReady(): boolean {
    return !!(
      process.env.STORAGE_ENDPOINT_WITH_BUCKET &&
      process.env.STORAGE_ACCESS_KEY &&
      process.env.STORAGE_SECRET_KEY
    );
  }

  async upload(options: UploadOptions): Promise<UploadResult> {
    const { body, pathname, contentType } = options;

    const filePathname = pathname || generatePathname(contentType);

    // Calculate Content-Length
    // Request body can directly accept BodyInit types (Buffer, ArrayBuffer, Blob, File, Uint8Array, etc.)
    let contentLength: number;
    if (body instanceof ArrayBuffer) {
      contentLength = body.byteLength;
    } else if (
      body instanceof Blob ||
      (typeof File !== "undefined" && body instanceof File)
    ) {
      contentLength = body.size;
    } else if (body instanceof Uint8Array) {
      contentLength = body.length;
    } else if (
      typeof Buffer !== "undefined" &&
      (body as unknown) instanceof Buffer
    ) {
      contentLength = (body as Buffer).length;
    } else {
      throw new Error("Unsupported body type");
    }

    const url = `${this.endpoint}/${filePathname}`;

    const client = new AwsClient({
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey,
    });

    // Headers configuration:
    // - Content-Type: File MIME type
    // - Content-Length: File size in bytes (required)
    // - Content-Disposition: Controls browser behavior (inline/attachment)
    // AwsClient will automatically add AWS signature-related headers
    const headers: Record<string, string> = {
      "Content-Type": contentType || "application/octet-stream",
      "Content-Length": contentLength.toString(),
      "Content-Disposition": "inline",
    };

    // Request body can use original types directly, no conversion needed
    const request = new Request(url, {
      method: "PUT",
      headers,
      body: body as BodyInit,
    });

    // AwsClient.fetch() will automatically:
    // 1. Calculate AWS Signature Version 4 signature
    // 2. Add necessary authentication headers
    // 3. Send request to S3-compatible storage service
    const response = await client.fetch(request);

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return {
      url: process.env.STORAGE_DOMAIN
        ? `https://${process.env.STORAGE_DOMAIN}/${filePathname}`
        : url,
      downloadUrl: url,
      pathname: filePathname,
      contentType:
        contentType || response.headers.get("Content-Type") || undefined,
      contentDisposition:
        response.headers.get("Content-Disposition") || undefined,
    };
  }
}

/**
 * Vercel Blob storage provider
 */
export class VercelBlobProvider implements StorageProvider {
  /**
   * Check if environment variables are ready for Vercel Blob
   * Vercel Blob uses BLOB_READ_WRITE_TOKEN which is automatically available on Vercel
   */
  static isEnvReady(): boolean {
    // Vercel Blob token is automatically available on Vercel platform
    // For local development, it should be set in .env.local
    return !!process.env.BLOB_READ_WRITE_TOKEN;
  }

  async upload(options: UploadOptions): Promise<UploadResult> {
    const { body, pathname, contentType } = options;

    const filePathname = pathname || generatePathname(contentType);

    // Convert Uint8Array to ArrayBuffer if needed
    let uploadBody: Buffer | Blob | File | ArrayBuffer;
    if (body instanceof Uint8Array) {
      const buffer = body.buffer.slice(
        body.byteOffset,
        body.byteOffset + body.byteLength,
      );
      uploadBody = buffer instanceof ArrayBuffer ? buffer : new ArrayBuffer(0);
    } else {
      uploadBody = body;
    }

    const result: PutBlobResult = await put(filePathname, uploadBody, {
      access: "public", // Vercel Blob only supports public access
      contentType,
    });

    return {
      url: result.url,
      pathname: result.pathname,
      downloadUrl: result.downloadUrl,
      contentType: result.contentType || undefined,
      contentDisposition: result.contentDisposition || undefined,
    };
  }
}

/**
 * Storage provider type
 */
export type StorageProviderType = "vercel-blob" | "s3";

/**
 * Create storage provider instance
 * First checks STORAGE_PROVIDER environment variable,
 * then auto-detects based on available environment variables
 */
export function createStorageProvider(
  type?: StorageProviderType,
): StorageProvider {
  // First, check explicit STORAGE_PROVIDER setting
  const explicitType =
    type || (process.env.STORAGE_PROVIDER as StorageProviderType);

  if (explicitType === "s3") {
    return new S3StorageProvider();
  }
  if (explicitType === "vercel-blob") {
    return new VercelBlobProvider();
  }

  // Auto-detect based on environment variables
  if (S3StorageProvider.isEnvReady()) {
    return new S3StorageProvider();
  }
  if (VercelBlobProvider.isEnvReady()) {
    return new VercelBlobProvider();
  }

  // Default to Vercel Blob (may fail if token not set, but that's expected)
  return new VercelBlobProvider();
}

/**
 * Get default storage provider instance (singleton pattern)
 */
let defaultStorageProvider: StorageProvider | null = null;

export function getStorageProvider(): StorageProvider {
  if (!defaultStorageProvider) {
    defaultStorageProvider = createStorageProvider();
  }
  return defaultStorageProvider;
}

/**
 * Convenient upload function
 */
export async function upload(options: UploadOptions): Promise<UploadResult> {
  const provider = getStorageProvider();
  return provider.upload(options);
}

export async function uploadFromUrl({
  url,
  pathname,
  contentType,
}: {
  url: string;
  pathname?: string;
  contentType?: string;
}): Promise<UploadResult> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  if (!response.body) {
    throw new Error("No body in response");
  }

  const arrayBuffer = await response.arrayBuffer();
  const detectedContentType =
    contentType || response.headers.get("Content-Type") || undefined;

  return upload({
    body: arrayBuffer,
    pathname,
    contentType: detectedContentType,
  });
}
