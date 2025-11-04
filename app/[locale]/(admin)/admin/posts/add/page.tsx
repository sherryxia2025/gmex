import FormSlot from "@/components/dashboard/slots/form";
import { getUuid } from "@/lib/hash";
import { getCategories } from "@/models/category";
import { findPostBySlug, insertPost, PostStatus } from "@/models/post";
import type { Form as FormSlotType } from "@/types/slots/form";

const locales = ["all", "en", "zh"];
const localeNames: Record<string, string> = {
  all: "All",
  en: "English",
  zh: "Chinese",
};

export default async function AddPostPage() {
  const categories = await getCategories({
    page: 1,
    limit: 100,
  });

  const form: FormSlotType = {
    title: "Add Post",
    crumb: {
      items: [
        {
          title: "Posts",
          url: "/admin/posts",
        },
        {
          title: "Add Post",
          is_active: true,
        },
      ],
    },
    fields: [
      {
        name: "title",
        title: "Title",
        type: "text",
        placeholder: "",
        validation: {
          required: true,
        },
      },
      {
        name: "slug",
        title: "Slug",
        type: "text",
        placeholder: "",
        validation: {
          required: true,
        },
      },
      {
        name: "locale",
        title: "Locale",
        type: "select",
        options: locales.map((locale: string) => ({
          title: localeNames[locale],
          value: locale,
        })),
        value: "all",
        validation: {
          required: true,
        },
      },
      {
        name: "categoryUuid",
        title: "Category",
        type: "select",
        options: categories?.map((category) => ({
          title: category.title,
          value: category.uuid,
        })),
        value: "",
      },
      {
        name: "status",
        title: "Status",
        type: "select",
        options: Object.values(PostStatus).map((status: string) => ({
          title: status,
          value: status,
        })),
        value: PostStatus.Created,
      },
      {
        name: "description",
        title: "Description",
        type: "textarea",
        placeholder: "",
      },
      {
        name: "coverUrl",
        title: "Cover URL",
        type: "image-url",
        placeholder: "Enter cover image URL...",
        validation: {
          required: true,
        },
      },
      {
        name: "authorName",
        title: "Author Name",
        type: "text",
        placeholder: "",
      },
      {
        name: "authorAvatarUrl",
        title: "Author Avatar URL",
        type: "url",
        placeholder: "",
      },
      {
        name: "content",
        title: "Content",
        type: "editor",
        placeholder: "",
      },
    ],
    submit: {
      button: {
        title: "Submit",
      },
      aiButtons: [
        {
          title: "AI Optimize Title",
          type: "optimize-text",
          targetField: "title",
          variant: "outline",
        },
        {
          title: "AI Generate Slug",
          type: "generate-text",
          targetField: "slug",
          variant: "outline",
        },
        {
          title: "AI Generate Description",
          type: "generate-text",
          targetField: "description",
          variant: "outline",
        },
        {
          title: "AI Optimize Description",
          type: "optimize-text",
          targetField: "description",
          variant: "outline",
        },
        {
          title: "AI Generate Content",
          type: "generate-text",
          targetField: "content",
          variant: "outline",
        },
        {
          title: "AI Optimize Content",
          type: "optimize-text",
          targetField: "content",
          variant: "outline",
        },
        {
          title: "AI Generate Cover Image",
          type: "generate-image",
          targetField: "coverUrl",
          variant: "outline",
        },
      ],
      handler: async (data: FormData, _passby: unknown) => {
        "use server";

        const title = data.get("title") as string;
        const slug = data.get("slug") as string;
        const locale = data.get("locale") as string;
        const status = data.get("status") as string;
        const description = data.get("description") as string;
        const coverUrl = data.get("coverUrl") as string;
        const authorName = data.get("authorName") as string;
        const authorAvatarUrl = data.get("authorAvatarUrl") as string;
        const content = data.get("content") as string;
        const categoryUuid = data.get("categoryUuid") as string;

        if (
          !title ||
          !title.trim() ||
          !slug ||
          !slug.trim() ||
          !locale ||
          !locale.trim()
        ) {
          throw new Error("invalid form data");
        }

        const existPost = await findPostBySlug(slug, locale);
        if (existPost) {
          throw new Error("post with same slug already exists");
        }

        const post = {
          uuid: getUuid(),
          createdAt: new Date(),
          status: status as PostStatus,
          title,
          slug,
          locale,
          description,
          coverUrl,
          authorName,
          authorAvatarUrl,
          content,
          categoryUuid,
        };

        try {
          await insertPost(post);

          return {
            status: "success",
            message: "Post added",
            redirect_url: "/admin/posts",
          };
        } catch (err: unknown) {
          throw new Error(err instanceof Error ? err.message : "Unknown error");
        }
      },
    },
  };

  return <FormSlot {...form} />;
}
