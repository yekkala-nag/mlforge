import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ProviderPreset {
  id: string;
  name: string;
  baseUrl: string;
  models: string[];
  format: "openai" | "anthropic";
}

export const providerPresets: ProviderPreset[] = [
  {
    id: "openai",
    name: "OpenAI",
    baseUrl: "https://api.openai.com/v1",
    models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "o1-mini", "o1-preview"],
    format: "openai",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    baseUrl: "https://api.anthropic.com",
    models: [
      "claude-sonnet-4-20250514",
      "claude-3-5-haiku-20241022",
      "claude-3-opus-20240229",
    ],
    format: "anthropic",
  },
  {
    id: "google",
    name: "Google Gemini",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
    models: ["gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.5-flash"],
    format: "openai",
  },
  {
    id: "groq",
    name: "Groq",
    baseUrl: "https://api.groq.com/openai/v1",
    models: [
      "llama-3.3-70b-versatile",
      "llama-3.1-8b-instant",
      "mixtral-8x7b-32768",
      "gemma2-9b-it",
    ],
    format: "openai",
  },
  {
    id: "together",
    name: "Together AI",
    baseUrl: "https://api.together.xyz/v1",
    models: [
      "meta-llama/Llama-3.3-70B-Instruct-Turbo",
      "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo",
      "mistralai/Mixtral-8x22B-Instruct-v0.1",
    ],
    format: "openai",
  },
  {
    id: "mistral",
    name: "Mistral",
    baseUrl: "https://api.mistral.ai/v1",
    models: ["mistral-large-latest", "mistral-small-latest", "codestral-latest"],
    format: "openai",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    baseUrl: "https://api.deepseek.com/v1",
    models: ["deepseek-chat", "deepseek-coder"],
    format: "openai",
  },
  {
    id: "ollama",
    name: "Ollama (Local)",
    baseUrl: "http://localhost:11434/v1",
    models: ["llama3.2", "llama3.1", "mistral", "codellama", "gemma2"],
    format: "openai",
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    baseUrl: "https://openrouter.ai/api/v1",
    models: [
      "anthropic/claude-sonnet-4",
      "openai/gpt-4o",
      "meta-llama/llama-3.3-70b-instruct",
      "google/gemini-2.0-flash-001",
    ],
    format: "openai",
  },
  {
    id: "custom",
    name: "Custom Provider",
    baseUrl: "",
    models: [],
    format: "openai",
  },
];

interface SettingsState {
  apiKey: string;
  providerId: string;
  apiBaseUrl: string;
  model: string;
  customModel: string;
  apiFormat: "openai" | "anthropic";
  theme: "dark" | "light";

  setApiKey: (key: string) => void;
  setProviderId: (id: string) => void;
  setApiBaseUrl: (url: string) => void;
  setModel: (model: string) => void;
  setCustomModel: (model: string) => void;
  setApiFormat: (format: "openai" | "anthropic") => void;
  setTheme: (theme: "dark" | "light") => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      apiKey: "",
      providerId: "openai",
      apiBaseUrl: "",
      model: "gpt-4o",
      customModel: "",
      apiFormat: "openai",
      theme: "dark",

      setApiKey: (key) => set({ apiKey: key }),
      setProviderId: (id) => {
        const preset = providerPresets.find((p) => p.id === id);
        set({
          providerId: id,
          apiBaseUrl: preset?.baseUrl ?? "",
          apiFormat: preset?.format ?? "openai",
          model: preset?.models[0] ?? "",
          customModel: "",
        });
      },
      setApiBaseUrl: (url) => set({ apiBaseUrl: url }),
      setModel: (model) => set({ model }),
      setCustomModel: (model) => set({ customModel: model, model }),
      setApiFormat: (format) => set({ apiFormat: format }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "ml-forge-settings",
    }
  )
);
