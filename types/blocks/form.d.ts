import type { Button } from "@/types/blocks/base";

type ValidationRule = {
  required?: boolean;
  min?: number;
  max?: number;
  message?: string;
  email?: boolean;
};

export interface FormField {
  name?: string;
  title?: string;
  type?:
    | "text"
    | "textarea"
    | "number"
    | "email"
    | "password"
    | "select"
    | "url"
    | "image-url"
    | "editor"
    | "code_editor"
    | "richtext_editor"
    | "markdown_editor"
    | "key-value";
  placeholder?: string;
  options?: {
    title: string;
    value: string;
  }[];
  value?: string;
  tip?: string;
  attributes?: Record<string, unknown>;
  validation?: ValidationRule;
}

export interface AIButton {
  title: string;
  icon?: string;
  variant?: "default" | "secondary" | "outline" | "ghost";
  type: "optimize-text" | "generate-text" | "generate-image" | "optimize-image";
  targetField: string;
  prompt?: string;
}

export interface FormSubmit {
  button?: Button;
  aiButtons?: AIButton[];
  handler?: (
    data: FormData,
    passby?: unknown,
  ) => Promise<
    | {
        status: "success" | "error";
        message: string;
        redirect_url?: string;
      }
    | undefined
  >;
}

export interface Form {
  fields: FormField[];
  data?: Record<string, unknown>;
  submit?: FormSubmit;
}
