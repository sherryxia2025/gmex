import { deleteProductCategory } from "@/models/product-category";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ uuid: string }> },
) {
  const { uuid } = await params;

  try {
    await deleteProductCategory(uuid);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Delete product category error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}

