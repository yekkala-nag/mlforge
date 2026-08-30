"use client";

import { useSettingsStore, providerPresets } from "@/stores/settings-store";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function SettingsPanel() {
  const {
    apiKey,
    providerId,
    apiBaseUrl,
    model,
    customModel,
    apiFormat,
    setApiKey,
    setProviderId,
    setApiBaseUrl,
    setModel,
    setCustomModel,
    setApiFormat,
  } = useSettingsStore();

  const currentPreset = providerPresets.find((p) => p.id === providerId);
  const isCustom = providerId === "custom";
  const showModelDropdown = !isCustom && currentPreset && currentPreset.models.length > 0;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-lg font-semibold text-zinc-100">AI Mentor</h2>
        <p className="text-sm text-zinc-500 mt-1">
          Bring your own API key. Works with OpenAI, Anthropic, Google, Groq,
          Ollama, and any OpenAI-compatible provider.
        </p>
      </div>

      <Card className="bg-zinc-900 border-zinc-800 p-5 space-y-5">
        {/* Provider grid */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Provider</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {providerPresets.map((p) => (
              <button
                key={p.id}
                onClick={() => setProviderId(p.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                  providerId === p.id
                    ? "bg-orange-600 text-white"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <Separator className="bg-zinc-800" />

        {/* API Format (only for custom) */}
        {isCustom && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">
                API Format
              </label>
              <div className="flex gap-2">
                {(["openai", "anthropic"] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setApiFormat(fmt)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      apiFormat === fmt
                        ? "bg-orange-600 text-white"
                        : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                    }`}
                  >
                    {fmt === "openai" ? "OpenAI Compatible" : "Anthropic Format"}
                  </button>
                ))}
              </div>
              <p className="text-xs text-zinc-600">
                Most providers (Groq, Together, Mistral, Ollama, OpenRouter, etc.)
                use the OpenAI format.
              </p>
            </div>
            <Separator className="bg-zinc-800" />
          </>
        )}

        {/* API Key */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-zinc-300">API Key</label>
            <Badge
              variant="secondary"
              className={
                apiKey
                  ? "bg-emerald-900/50 text-emerald-400 text-xs"
                  : "bg-zinc-800 text-zinc-500 text-xs"
              }
            >
              {apiKey ? "Set" : "Not set"}
            </Badge>
          </div>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={
              isCustom
                ? "Enter your API key"
                : `Enter your ${currentPreset?.name} API key`
            }
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
          />
          <p className="text-xs text-zinc-600">
            Stored locally in your browser. Never sent to our servers.
          </p>
        </div>

        <Separator className="bg-zinc-800" />

        {/* Base URL */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">
            Base URL
            {!isCustom && (
              <span className="text-zinc-600 ml-1">(auto-filled)</span>
            )}
          </label>
          <input
            type="text"
            value={apiBaseUrl}
            onChange={(e) => setApiBaseUrl(e.target.value)}
            placeholder={
              isCustom
                ? "https://your-api-endpoint.com/v1"
                : currentPreset?.baseUrl
            }
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 font-mono text-xs"
          />
          {isCustom && (
            <p className="text-xs text-zinc-600">
              Must be an OpenAI-compatible endpoint (e.g.
              https://api.example.com/v1)
            </p>
          )}
        </div>

        <Separator className="bg-zinc-800" />

        {/* Model */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Model</label>
          {showModelDropdown ? (
            <div className="space-y-2">
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              >
                {currentPreset.models.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <div className="flex flex-wrap gap-1">
                {currentPreset.models.map((m) => (
                  <button
                    key={m}
                    onClick={() => setModel(m)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                      model === m
                        ? "bg-orange-600/20 text-orange-400 border border-orange-600/30"
                        : "bg-zinc-800 text-zinc-500 border border-zinc-700 hover:text-zinc-300"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <input
              type="text"
              value={customModel}
              onChange={(e) => setCustomModel(e.target.value)}
              placeholder="e.g. llama3.2, mistral-large, gpt-4o"
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            />
          )}
        </div>
      </Card>

      {/* Supported providers info */}
      <Card className="bg-zinc-900 border-zinc-800 p-5">
        <h3 className="text-sm font-semibold text-zinc-200 mb-3">
          Supported Providers
        </h3>
        <div className="grid grid-cols-2 gap-2 text-xs text-zinc-500">
          <div>
            <span className="text-zinc-300">Cloud:</span> OpenAI, Anthropic,
            Google, Groq, Together, Mistral, DeepSeek, OpenRouter
          </div>
          <div>
            <span className="text-zinc-300">Local:</span> Ollama, LM Studio,
            vLLM, AnyOpenAI-compatible server
          </div>
        </div>
        <div className="mt-3 text-xs text-zinc-600">
          <p>
            <span className="text-zinc-400">Tip:</span> For Ollama, start with{" "}
            <code className="bg-zinc-800 px-1 rounded">ollama serve</code> and
            use base URL{" "}
            <code className="bg-zinc-800 px-1 rounded">
              http://localhost:11434/v1
            </code>
          </p>
        </div>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800 p-5">
        <h3 className="text-sm font-semibold text-zinc-200 mb-2">
          How the AI Mentor works
        </h3>
        <div className="text-xs text-zinc-500 space-y-2">
          <p>
            The mentor analyzes your current simulation state, parameters, code,
            and metrics.
          </p>
          <p>
            It asks guiding questions before giving answers, like a senior ML
            engineer would.
          </p>
          <p>
            Hint levels progress from questions → concepts → visuals → code →
            solution.
          </p>
          <p>
            Your API key is used only for mentor interactions and is never
            stored on our servers.
          </p>
        </div>
      </Card>
    </div>
  );
}
