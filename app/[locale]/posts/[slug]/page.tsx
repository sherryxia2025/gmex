import moment from "moment";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import PostsHeader from "@/app/[locale]/posts/posts-header";
import { Footer } from "@/components/blocks/footer";
import TiptapRenderer from "@/components/posts/tiptap-renderer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { findPostBySlug } from "@/models/post";

interface PostPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = await findPostBySlug(slug, locale);
  if (!post) {
    return {
      title: "Post Not Found",
    };
  }
  return {
    title: post.title || "Untitled Post",
    description: post.description || "",
    openGraph: {
      title: post.title || "Untitled Post",
      description: post.description || "",
      images: post.coverUrl ? [post.coverUrl] : [],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug, locale } = await params;
  const post = await findPostBySlug(slug, locale);
  if (!post) {
    notFound();
  }

  return (
    <article className="min-h-screen w-full bg-white dark:bg-[#0F0F0F] transition-colors select-none flex flex-col justify-between">
      <PostsHeader />
      <div className="flex-1 flex flex-col">
        <div className="container mx-auto px-4 py-8 pt-10">
          <div className="relative w-full flex flex-col min-h-screen  pb-10 justify-center items-center bg-transparent">
            <div className="max-w-4xl w-full flex flex-col items-center justify-center m-auto">
              <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-14 md:mb-[48px] text-black dark:text-white leading-tight w-full">
                {post.title}
              </h1>
              {post.coverUrl && (
                <div className="w-full max-w-3xl aspect-video relative drop-shadow-md rounded-2xl overflow-hidden bg-[#f8f6fd] flex items-center justify-center mb-12 md:mb-[44px] mx-auto">
                  <Image
                    src={post.coverUrl}
                    alt={post.title || "Post cover"}
                    fill
                    className="object-cover w-full h-full"
                    priority
                  />
                </div>
              )}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-lg md:text-xl text-[#797979] dark:text-gray-400 mb-10 md:mb-[32px] text-center w-full">
                {post.authorName && (
                  <span className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage
                        src={post.authorAvatarUrl ?? undefined}
                        alt={post.authorName ?? undefined}
                      />
                      <AvatarFallback>
                        {post.authorName?.[0] ?? "A"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="align-middle">{post.authorName}</span>
                  </span>
                )}
                <span>{moment(post.createdAt).format("MMM DD, YYYY")}</span>
              </div>
              {post.description && (
                <p className="text-xl md:text-2xl italic text-[#868686] dark:text-gray-300 tracking-wide leading-relaxed text-center mb-0 w-full">
                  {post.description}
                </p>
              )}
            </div>
          </div>
          {/* Content */}
          <div className="max-w-4xl mx-auto w-full">
            <div className="prose prose-gray dark:prose-invert prose-lg max-w-none">
              <div className="leading-relaxed text-[#151417] dark:text-gray-200 transition-colors">
                <TiptapRenderer content={post.content ? post.content : ""} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </article>
  );
}
