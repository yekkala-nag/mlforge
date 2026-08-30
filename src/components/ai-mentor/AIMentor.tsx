"use client";

import { useState, useRef, useEffect } from "react";
import { useSettingsStore, providerPresets } from "@/stores/settings-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Send, Bot, User, AlertCircle } from "lucide-react";

interface Message {
  role: "user" | "mentor";
  content: string;
}

interface AIMentorProps {
  context?: {
    simulationId?: string;
    params?: Record<string, unknown>;
    metrics?: Record<string, number>;
    code?: string;
  };
}

export function AIMentor({ context }: AIMentorProps) {
  const { apiKey, providerId, apiBaseUrl, model, apiFormat } = useSettingsStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "mentor",
      content:
        "I'm your ML engineering mentor. Ask me about the simulation, or tell me what you're trying to understand. I'll guide you — not give you the answer.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    if (!apiKey) {
      setMessages((prev) => [
        ...prev,
        {
          role: "mentor",
          content:
            "Please set your API key in Settings to use the AI Mentor. Go to Settings → pick your provider → enter your key.",
        },
      ]);
      setIsLoading(false);
      return;
    }

    try {
      const systemPrompt = `You are a senior ML engineer mentoring a junior engineer in an interactive ML playground.

Current simulation: ${context?.simulationId ?? "unknown"}
Current parameters: ${JSON.stringify(context?.params ?? {})}
Current metrics: ${JSON.stringify(context?.metrics ?? {})}

Rules:
- Never give the answer directly on the first response
- Ask guiding questions to build intuition
- Reference specific parameter values when relevant
- If the learner is stuck, progress through hint levels:
  1. Ask a question
  2. Point toward the relevant concept
  3. Show a visualization hint
  4. Show partial code
  5. Show the full solution
- Be concise. 2-3 sentences max unless explaining a concept.
- Use plain language, not textbook definitions.`;

      const preset = providerPresets.find((p) => p.id === providerId);
      const format = apiFormat || preset?.format || "openai";

      let response: string;

      if (format === "openai") {
        // OpenAI-compatible format (works with OpenAI, Groq, Together, Ollama, OpenRouter, etc.)
        const baseUrl = apiBaseUrl || preset?.baseUrl || "https://api.openai.com/v1";
        const res = await fetch(`${baseUrl}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: systemPrompt },
              ...messages.map((m) => ({ role: m.role, content: m.content })),
              { role: "user", content: userMessage },
            ],
            max_tokens: 500,
            temperature: 0.7,
          }),
        });
        const data = await res.json();

        if (data.error) {
          throw new Error(data.error.message || data.error || "API request failed");
        }

        response = data.choices?.[0]?.message?.content ?? "No response received.";
      } else {
        // Anthropic format
        const baseUrl = apiBaseUrl || preset?.baseUrl || "https://api.anthropic.com";
        const res = await fetch(`${baseUrl}/v1/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model,
            max_tokens: 500,
            system: systemPrompt,
            messages: [
              ...messages.map((m) => ({ role: m.role, content: m.content })),
              { role: "user", content: userMessage },
            ],
          }),
        });
        const data = await res.json();

        if (data.error) {
          throw new Error(data.error.message || data.error || "API request failed");
        }

        response = data.content?.[0]?.text ?? "No response received.";
      }

      setMessages((prev) => [...prev, { role: "mentor", content: response }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "mentor",
          content: `Error: ${err instanceof Error ? err.message : "Unknown error"}. Check your API key, base URL, and model in Settings.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800 flex flex-col h-full">
      <div className="px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
        <Bot className="w-4 h-4 text-orange-400" />
        <span className="text-sm font-semibold text-zinc-200">AI Mentor</span>
        {!apiKey && (
          <span className="text-xs text-amber-500 ml-auto flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            No API key
          </span>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}
          >
            {msg.role === "mentor" && (
              <div className="w-6 h-6 rounded-full bg-orange-600/20 flex items-center justify-center shrink-0">
                <Bot className="w-3 h-3 text-orange-400" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                msg.role === "user"
                  ? "bg-orange-600/20 text-orange-200"
                  : "bg-zinc-800 text-zinc-300"
              }`}
            >
              {msg.content}
            </div>
            {msg.role === "user" && (
              <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center shrink-0">
                <User className="w-3 h-3 text-zinc-400" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-zinc-800">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder={
              apiKey
                ? "Ask about the simulation..."
                : "Set API key in Settings first"
            }
            className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            disabled={isLoading}
          />
          <Button
            size="sm"
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
