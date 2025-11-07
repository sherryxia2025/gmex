import { nanoid } from "nanoid";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { insertProduct } from "@/models/product";
import { findProductCategoryByName } from "@/models/product-category";

interface ProductImportRow {
  name: string;
  title?: string;
  description?: string;
  categoryName?: string;
  status?: string;
  coverUrl?: string;
  metadata?: string; // JSON string
}

function parseCSV(content: string): ProductImportRow[] {
  const lines = content.trim().split("\n");
  if (lines.length < 2) {
    throw new Error("CSV file must have at least a header and one data row");
  }

  const headers = lines[0].split(",").map((h) => h.trim());
  const rows: ProductImportRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim());
    const row: ProductImportRow = {} as ProductImportRow;

    headers.forEach((header, index) => {
      const value = values[index] || "";
      if (header === "name") {
        row.name = value;
      } else if (header === "title") {
        row.title = value || undefined;
      } else if (header === "description") {
        row.description = value || undefined;
      } else if (header === "categoryName") {
        row.categoryName = value || undefined;
      } else if (header === "status") {
        row.status = value || undefined;
      } else if (header === "coverUrl") {
        row.coverUrl = value || undefined;
      } else if (header === "metadata") {
        row.metadata = value || undefined;
      }
    });

    if (row.name) {
      rows.push(row);
    }
  }

  return rows;
}

function parseJSON(content: string): ProductImportRow[] {
  const data = JSON.parse(content);
  if (!Array.isArray(data)) {
    throw new Error("JSON file must contain an array of products");
  }
  return data;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 },
      );
    }

    const content = await file.text();
    const fileName = file.name.toLowerCase();
    let rows: ProductImportRow[];

    // Parse file based on extension
    if (fileName.endsWith(".csv")) {
      rows = parseCSV(content);
    } else if (fileName.endsWith(".json")) {
      rows = parseJSON(content);
    } else {
      return NextResponse.json(
        { success: false, error: "Unsupported file format. Please use CSV or JSON" },
        { status: 400 },
      );
    }

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid data found in file" },
        { status: 400 },
      );
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [] as Array<{ row: number; error: string }>,
    };

    // Import products
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        let categoryUuid: string | undefined;

        // Find category by name if provided
        if (row.categoryName) {
          const category = await findProductCategoryByName(row.categoryName);
          if (category) {
            categoryUuid = category.uuid;
          }
        }

        // Parse metadata if provided
        let metadata: unknown;
        if (row.metadata) {
          try {
            metadata = JSON.parse(row.metadata);
          } catch {
            // If not valid JSON, treat as plain string
            metadata = row.metadata;
          }
        }

        await insertProduct({
          uuid: nanoid(),
          name: row.name,
          title: row.title,
          description: row.description,
          categoryUuid,
          status: row.status || "created",
          coverUrl: row.coverUrl,
          metadata,
        });

        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          row: i + 1,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        total: rows.length,
        imported: results.success,
        failed: results.failed,
        errors: results.errors,
      },
    });
  } catch (error) {
    console.error("Failed to import products:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to import products",
      },
      { status: 500 },
    );
  }
}

