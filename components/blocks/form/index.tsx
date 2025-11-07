"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Highlight } from "@tiptap/extension-highlight";
import { HorizontalRule } from "@tiptap/extension-horizontal-rule";
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Selection } from "@tiptap/extensions";
import { generateJSON } from "@tiptap/html";
import { StarterKit } from "@tiptap/starter-kit";
import { Loader, Sparkles, Wand2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ImageUrlField } from "@/components/blocks/form/image-url-field";
import { KeyValueField } from "@/components/blocks/form/key-value-field";
import TiptapEditor from "@/components/blocks/tiptapeditor";
import Icon from "@/components/icon";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "@/i18n/navigation";
import type {
  AIButton,
  FormField as FormFieldType,
  FormSubmit,
} from "@/types/blocks/form";

function buildFieldSchema(field: FormFieldType) {
  let schema = z.string();

  if (field.validation?.required) {
    schema = schema.min(1, {
      message: field.validation.message || `${field.title} is required`,
    });
  }

  if (field.validation?.min) {
    schema = schema.min(field.validation.min, {
      message:
        field.validation.message ||
        `${field.title} must be at least ${field.validation.min} characters`,
    });
  }

  if (field.validation?.max) {
    schema = schema.max(field.validation.max, {
      message:
        field.validation.message ||
        `${field.title} must be at most ${field.validation.max} characters`,
    });
  }

  if (field.validation?.email) {
    schema = schema.email({
      message:
        field.validation.message || `${field.title} must be a valid email`,
    });
  }

  return schema;
}

const generateFormSchema = (fields: FormFieldType[]) => {
  const schemaFields: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    if (field.name) {
      schemaFields[field.name] = buildFieldSchema(field);
    }
  });

  return z.object(schemaFields);
};

export default function ({
  fields,
  data,
  passby,
  submit,
  loading,
}: {
  fields?: FormFieldType[];
  data?: Record<string, unknown>;
  passby?: unknown;
  submit?: FormSubmit;
  loading?: boolean;
}) {
  if (!fields) {
    fields = [];
  }

  const t = useTranslations("common");
  const router = useRouter();
  const FormSchema = generateFormSchema(fields);
  const defaultValues: Record<string, string> = {};

  fields.forEach((field) => {
    if (field.name) {
      const dataValue = data?.[field.name];
      const fieldValue = field.value;
      defaultValues[field.name] =
        (typeof dataValue === "string" ? dataValue : "") ||
        (typeof fieldValue === "string" ? fieldValue : "") ||
        "";
    }
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  const [aiLoading, setAiLoading] = useState<Record<string, boolean>>({});

  // Extract plain text from Tiptap JSON
  function extractTextFromTiptapJSON(json: unknown): string {
    if (!json || typeof json !== "object") return "";

    if (
      json &&
      typeof json === "object" &&
      "type" in json &&
      json.type === "text"
    ) {
      return (json as { text?: string }).text || "";
    }

    if (
      json &&
      typeof json === "object" &&
      "content" in json &&
      Array.isArray((json as { content: unknown[] }).content)
    ) {
      return (json as { content: unknown[] }).content
        .map((item: unknown) => extractTextFromTiptapJSON(item))
        .join("");
    }

    return "";
  }

  // Convert HTML to Tiptap JSON format
  function convertHTMLToTiptapJSON(html: string): string {
    if (!html.trim()) {
      return JSON.stringify({
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [],
          },
        ],
      });
    }

    // Use @tiptap/html generateJSON function
    const extensions = [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
    ];

    try {
      const json = generateJSON(html, extensions);
      return JSON.stringify(json);
    } catch (error) {
      console.warn("HTML to Tiptap conversion failed:", error);
      // If conversion fails, return an empty paragraph
      return JSON.stringify({
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [],
          },
        ],
      });
    }
  }

  async function handleAIButton(aiButton: AIButton) {
    const buttonKey = `${aiButton.type}-${aiButton.targetField}`;
    setAiLoading((prev) => ({ ...prev, [buttonKey]: true }));

    try {
      const formData = form.getValues();

      let prompt = aiButton.prompt || "";

      const isForText = aiButton.type.includes("text");
      const isForImage = aiButton.type.includes("image");

      if (isForText) {
        if (aiButton.type === "optimize-text") {
          // AI optimize: based on existing content
          const currentContent = String(formData[aiButton.targetField] || "");
          if (!currentContent.trim()) {
            toast.error("Please enter some content first to optimize");
            return;
          }

          // If it's Tiptap editor content, we need to extract plain text
          let textContent = currentContent;
          try {
            const jsonContent = JSON.parse(currentContent);
            if (jsonContent && typeof jsonContent === "object") {
              // Extract plain text content from JSON
              textContent = extractTextFromTiptapJSON(jsonContent);
            }
          } catch {
            // If it's not JSON format, use the original content
            textContent = currentContent;
          }

          // Check if the target field is a Tiptap editor
          const targetField = fields?.find(
            (field) => field.name === aiButton.targetField,
          );
          const isTiptapEditor = targetField?.type === "editor";

          if (isTiptapEditor) {
            prompt = `Please optimize the following content and return ONLY the optimized HTML format: ${textContent}

            IMPORTANT: You must return ONLY valid HTML format without any markdown code blocks or wrapper text. Do NOT use \`\`\`html or \`\`\` tags. Return ONLY the raw HTML content. Use these HTML tags:
            - <h1>, <h2>, <h3>, <h4>, <h5>, <h6> for headings
            - <p> for paragraphs
            - <ul>, <ol>, <li> for lists
            - <blockquote> for quotes
            - <pre><code> for code blocks
            - <strong>, <em> for emphasis
            - <hr> for horizontal rules
            - <a href=""> for links

            Requirements:
            - Language: Always use the same language as the original content.

            Generate clean, semantic HTML without any wrapper divs, markdown formatting, or code block markers.`;
          } else if (aiButton.targetField === "title") {
            const languageInstruction =
              "Please optimize the following blog post title";

            prompt = `${languageInstruction}: ${textContent}

            Requirements:
            - Language: Always use the same language as the original content.
            - Length: Maximum 30 characters
            - Style: Engaging, descriptive, click-worthy
            - Format: Title case, no ending punctuation
            - SEO: Include relevant keywords naturally
            - Keep it concise and impactful

            IMPORTANT: Return ONLY the optimized title text. No explanations, no additional text, no formatting. Just the title itself.`;
          } else {
            prompt = `Please optimize the following content: ${textContent}

            Requirements:
            - Language: Always use the same language as the original content.

            IMPORTANT: Return ONLY the optimized text. No explanations, no additional text, no formatting. Just the optimized content itself.`;
          }
        } else if (aiButton.type === "generate-text") {
          // AI generate: based on other fields
          const contextFields = Object.entries(formData)
            .filter(
              ([key, value]) =>
                key !== aiButton.targetField &&
                value &&
                String(value).trim() &&
                (key === "title" || key === "description"),
            )
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ");

          if (!contextFields) {
            toast.error(
              "Please fill in some other fields first to generate content",
            );
            return;
          }

          if (aiButton.targetField === "description") {
            const languageInstruction =
              "Based on the following information, generate a compelling meta description for a blog post";

            prompt = `${languageInstruction}: ${contextFields}.

            Requirements:
            - Language: Always follow the language of the title content.
            - Length: 150-160 characters
            - Style: Engaging, informative, action-oriented
            - Format: Complete sentence with proper punctuation
            - SEO: Include relevant keywords and call-to-action

            IMPORTANT: Return ONLY the description text. No explanations, no additional text, no formatting. Just the description itself.`;
          } else if (aiButton.targetField === "content") {
            const languageInstruction =
              "Based on the following information, generate a comprehensive blog post content in HTML format";

            prompt = `${languageInstruction}: ${contextFields}.

            Requirements:
            - Language: Always follow the language of the title content.
            - Length: 800-1500 words
            - Structure: Use proper headings (H1, H2, H3), paragraphs, and formatting
            - Style: Informative, engaging, well-researched
            - Format: Include introduction, main content with subheadings, and conclusion
            - SEO: Include relevant keywords naturally

            IMPORTANT: You must return ONLY valid HTML format without any markdown code blocks or wrapper text. Do NOT use \`\`\`html or \`\`\` tags. Return ONLY the raw HTML content. Use these HTML tags:
            - <h1>, <h2>, <h3>, <h4>, <h5>, <h6> for headings
            - <p> for paragraphs
            - <ul>, <ol>, <li> for lists
            - <blockquote> for quotes
            - <pre><code> for code blocks
            - <strong>, <em> for emphasis
            - <hr> for horizontal rules
            - <a href=""> for links

            Requirements:
            - Language: Always follow the language of the title content.

            Generate clean, semantic HTML without any wrapper divs, markdown formatting, or code block markers.`;
          } else if (aiButton.targetField === "slug") {
            prompt = `Based on the following information, generate a URL-friendly slug: ${contextFields}.

            Requirements:
            - Language: Always use english
            - Length: 2-8 words maximum
            - Format: lowercase, hyphens between words, no special characters
            - Style: Descriptive, SEO-friendly, easy to read
            - Example format: "get-started"

            IMPORTANT: Return ONLY the slug text. No explanations, no additional text, no formatting. Just the slug itself.`;
          } else {
            prompt = `Based on the following information, generate ${aiButton.targetField}: ${contextFields}.

            Requirements:
            - Language: Always use the same language as the original content.

            IMPORTANT: Return ONLY the generated text. No explanations, no additional text, no formatting. Just the content itself.`;
          }
        }

        // Call AI API
        const response = await fetch("/api/ai/text-to-text", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt,
            model:
              process.env.NEXT_PUBLIC_POSTS_TEXT_AI_MODEL ||
              "deepseek-ai/deepseek-v3.1",
          }),
        });

        if (!response.ok) {
          throw new Error("AI request failed");
        }

        // Read stream response
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("No response body");
        }

        let result = "";
        const decoder = new TextDecoder();

        // Check if the target field is a Tiptap editor
        const targetField = fields?.find(
          (field) => field.name === aiButton.targetField,
        );
        const isTiptapEditor = targetField?.type === "editor";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          result += chunk;

          // Real-time update form field
          if (isTiptapEditor) {
            // For Tiptap editor, convert HTML to Tiptap JSON format
            try {
              const tiptapJSON = convertHTMLToTiptapJSON(result);
              form.setValue(aiButton.targetField, tiptapJSON);
            } catch (error) {
              // If conversion fails, continue waiting for more content
              console.warn(
                "HTML to Tiptap conversion failed, waiting for more content:",
                error,
              );
            }
          } else {
            // For normal fields, use text directly
            form.setValue(aiButton.targetField, result);
          }
        }
      } else if (isForImage) {
        if (aiButton.targetField === "coverUrl") {
          // build context information, using title, name, description fields
          const contextFields = ["title", "name", "description"];

          const context = contextFields
            .filter((key) => formData[key] && String(formData[key]).trim())
            .map((key) => `${key}: ${formData[key]}`)
            .join(", ");

          if (!context) {
            toast.error(
              "please fill in the title, name or description first to generate a cover image",
            );
            return;
          }

          prompt = `Based on the following information, generate a professional cover image: ${context}.

          Requirements:
          - High quality, professional design
          - Visually appealing and relevant to the content
          - Modern and clean style
          - Suitable for use as a cover image

          IMPORTANT: Don't use any text in the image.`;

          const response = await fetch("/api/ai/text-to-image", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              prompt,
              model:
                process.env.NEXT_PUBLIC_POSTS_IMAGE_AI_MODEL ||
                "bytedance/seedream-4",
            }),
          });

          const data = await response.json();

          if (!data.url) {
            throw new Error("No response received from server");
          }

          form.setValue(aiButton.targetField, data.url);
        }
      }

      toast.success(`AI ${aiButton.type} completed successfully`);
    } catch (error) {
      console.error("AI button error:", error);
      toast.error(
        `AI ${aiButton.type} failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setAiLoading((prev) => ({ ...prev, [buttonKey]: false }));
    }
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!submit?.handler) return;

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      const res = await submit.handler(formData, passby);

      if (!res) {
        throw new Error("No response received from server");
      }

      if (res.message) {
        if (res.status === "success") {
          toast.success(res.message);
        } else {
          toast.error(res.message);
        }
      }

      if (res.redirect_url) {
        router.push(res.redirect_url as string);
      }
    } catch (err: unknown) {
      console.log("submit form error", err);
      const errorMessage =
        err instanceof Error ? err.message : "submit form failed";
      toast.error(errorMessage);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full md:max-w-4xl space-y-6 px-2 pb-8"
      >
        {fields.map((item, index) => {
          return (
            <FormField
              key={item.name || `field-${index}`}
              control={form.control}
              name={item.name || ""}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>
                      {item.title}
                      {item.validation?.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </FormLabel>
                    {submit?.aiButtons && submit.aiButtons.length > 0 && (
                      <div className="flex gap-1">
                        {submit.aiButtons
                          .filter(
                            (aiButton) => aiButton.targetField === item.name,
                          )
                          .map((aiButton) => {
                            const buttonKey = `${aiButton.type}-${aiButton.targetField}`;
                            const isLoading = aiLoading[buttonKey];

                            return (
                              <Button
                                key={buttonKey}
                                type="button"
                                variant={aiButton.variant || "outline"}
                                size="sm"
                                onClick={() => handleAIButton(aiButton)}
                                disabled={loading || isLoading}
                                className="flex items-center justify-center gap-1"
                              >
                                {isLoading ? (
                                  <Loader className="h-3 w-3 animate-spin" />
                                ) : aiButton.type === "optimize-text" ? (
                                  <Wand2 className="h-3 w-3" />
                                ) : (
                                  <Sparkles className="h-3 w-3" />
                                )}
                                <span className="text-xs">
                                  {aiButton.type.startsWith("optimize")
                                    ? t("optimize")
                                    : t("generate")}
                                </span>
                              </Button>
                            );
                          })}
                      </div>
                    )}
                  </div>
                  <FormControl>
                    {item.type === "textarea" ? (
                      <Textarea
                        {...field}
                        value={String(field.value || "")}
                        placeholder={item.placeholder}
                        {...item.attributes}
                      />
                    ) : item.type === "select" ? (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={String(field.value || "")}
                        {...item.attributes}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={item.placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                          {item.options?.map(
                            (option: { value: string; title: string }) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.title}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    ) : item.type === "editor" ? (
                      <TiptapEditor
                        value={String(field.value || "")}
                        onChange={(value) => field.onChange(value)}
                      />
                    ) : item.type === "image-url" ? (
                      <ImageUrlField
                        value={String(field.value || "")}
                        onChange={field.onChange}
                        placeholder={item.placeholder}
                        disabled={loading}
                        {...item.attributes}
                      />
                    ) : item.type === "key-value" ? (
                      <KeyValueField
                        value={String(field.value || "")}
                        onChange={field.onChange}
                        placeholder={item.placeholder}
                        disabled={loading}
                        {...item.attributes}
                      />
                    ) : (
                      <Input
                        {...field}
                        value={String(field.value || "")}
                        type={item.type || "text"}
                        placeholder={item.placeholder}
                        {...item.attributes}
                      />
                    )}
                  </FormControl>
                  {item.tip && <FormDescription>{item.tip}</FormDescription>}
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })}
        {submit?.button && (
          <Button
            type="submit"
            variant={submit.button.variant}
            className="flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              submit.button.icon && (
                <Icon name={submit.button.icon} className="size-4" />
              )
            )}
            {submit.button.title}
          </Button>
        )}
      </form>
    </Form>
  );
}
