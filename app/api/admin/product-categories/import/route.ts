import { nanoid } from "nanoid";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { insertProductCategory } from "@/models/product-category";

interface CategoryImportRow {
  name: string;
  title: string;
  description?: string;
  features?: string; // JSON string array
  coverUrl?: string;
}

function parseCSV(content: string): CategoryImportRow[] {
  const lines = content.trim().split("\n");
  if (lines.length < 2) {
    throw new Error("CSV file must have at least a header and one data row");
  }

  const headers = lines[0].split(",").map((h) => h.trim());
  const rows: CategoryImportRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim());
    const row: CategoryImportRow = {} as CategoryImportRow;

    headers.forEach((header, index) => {
      const value = values[index] || "";
      if (header === "name") {
        row.name = value;
      } else if (header === "title") {
        row.title = value;
      } else if (header === "description") {
        row.description = value || undefined;
      } else if (header === "features") {
        row.features = value || undefined;
      } else if (header === "coverUrl") {
        row.coverUrl = value || undefined;
      }
    });

    if (row.name && row.title) {
      rows.push(row);
    }
  }

  return rows;
}

function parseJSON(content: string): CategoryImportRow[] {
  const data = JSON.parse(content);
  if (!Array.isArray(data)) {
    throw new Error("JSON file must contain an array of categories");
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
    let rows: CategoryImportRow[];

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

    // Import categories
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        // Parse features if provided
        let features: unknown;
        if (row.features) {
          try {
            features = JSON.parse(row.features);
          } catch {
            // If not valid JSON, treat as comma-separated string
            features = row.features.split(",").map((f) => f.trim()).filter(Boolean);
          }
        }

        await insertProductCategory({
          uuid: nanoid(),
          name: row.name,
          title: row.title,
          description: row.description,
          features,
          coverUrl: row.coverUrl,
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
    console.error("Failed to import product categories:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to import product categories",
      },
      { status: 500 },
    );
  }
}

