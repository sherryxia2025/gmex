import { PostStatus, updatePost } from "@/models/post";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ uuid: string }> },
) {
  const { uuid } = await params;

  try {
    console.log("Attempting to soft delete post with UUID:", uuid);
    await updatePost(uuid, {
      status: PostStatus.Deleted,
      updatedAt: new Date(),
    });
    console.log("Post marked as deleted successfully");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Delete post error:", error);
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
