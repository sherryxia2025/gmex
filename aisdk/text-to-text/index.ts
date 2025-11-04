import { replicate } from "../models/replicate";

export const textToTextModels = {
  "openai/gpt-5": (input: {
    prompt: string;
    system_prompt?: string;
    max_completion_tokens?: number;
    image_input?: string[];
    verbosity?: "high" | "low" | "medium";
    reasoning_effort?: "minimal" | "low" | "medium" | "high";
    message?: Array<{ role: "user" | "assistant"; content: string }>;
    abortSignal?: AbortSignal;
  }) => {
    return replicate.stream("openai/gpt-5", {
      input,
      signal: input.abortSignal,
    });
  },
  "anthropic/claude-4.5-sonnet": (input: {
    prompt: string;
    system_prompt?: string;
    max_tokens?: number;
    image?: string;
    abortSignal?: AbortSignal;
  }) => {
    return replicate.stream("anthropic/claude-4.5-sonnet", {
      input,
      signal: input.abortSignal,
    });
  },
  "deepseek-ai/deepseek-v3.1": (input: {
    prompt: string;
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    presence_penalty?: number;
    frequency_penalty?: number;
    thinking?: "None" | "medium";
    abortSignal?: AbortSignal;
  }) => {
    return replicate.stream("deepseek-ai/deepseek-v3.1", {
      input,
      signal: input.abortSignal,
    });
  },
  "google/gemini-2.5-flash": (input: {
    prompt: string;
    system_instruction: string;
    max_output_tokens?: number;
    top_p?: number;
    thinking_budget?: number;
    dynamic_thinking?: boolean;
    abortSignal?: AbortSignal;
  }) => {
    return replicate.stream("google/gemini-2.5-flash", {
      input,
      signal: input.abortSignal,
    });
  },
};
