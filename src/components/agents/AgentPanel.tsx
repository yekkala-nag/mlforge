"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { orchestrator } from "@/lib/agents/orchestrator";
import { AgentState, AgentMessage } from "@/lib/agents/base-agent";
import {
  Users,
  MessageSquare,
  Brain,
  Code2,
  Cpu,
  FlaskConical,
  Trophy,
  FolderOpen,
  Server,
  Send,
  Activity,
} from "lucide-react";

const agentIcons: Record<string, React.ReactNode> = {
  curriculum: <Brain className="w-4 h-4" />,
  knowledge: <Users className="w-4 h-4" />,
  "code-mentor": <Code2 className="w-4 h-4" />,
  simulation: <Cpu className="w-4 h-4" />,
  experiment: <FlaskConical className="w-4 h-4" />,
  challenge: <Trophy className="w-4 h-4" />,
  project: <FolderOpen className="w-4 h-4" />,
  mlops: <Server className="w-4 h-4" />,
};

const agentColors: Record<string, string> = {
  curriculum: "border-violet-700 bg-violet-900/30",
  knowledge: "border-blue-700 bg-blue-900/30",
  "code-mentor": "border-emerald-700 bg-emerald-900/30",
  simulation: "border-orange-700 bg-orange-900/30",
  experiment: "border-amber-700 bg-amber-900/30",
  challenge: "border-red-700 bg-red-900/30",
  project: "border-cyan-700 bg-cyan-900/30",
  mlops: "border-pink-700 bg-pink-900/30",
};

export function AgentPanel() {
  const [agents, setAgents] = useState<AgentState[]>(() => orchestrator.getAllAgents());
  const [messages, setMessages] = useState<AgentMessage[]>(() => orchestrator.getRecentMessages());
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [testTopic, setTestTopic] = useState("explain");
  const [testPayload, setTestPayload] = useState('{"concept": "linear-regression"}');
  const [isSending, setIsSending] = useState(false);

  const sendTestMessage = async () => {
    if (!selectedAgent || !testPayload) return;
    setIsSending(true);

    try {
      const payload = JSON.parse(testPayload);
      const message: AgentMessage = {
        id: `msg-${Date.now()}`,
        from: "user",
        to: selectedAgent,
        type: "request",
        topic: testTopic,
        payload,
        timestamp: Date.now(),
      };

      await orchestrator.send(message);
      setMessages(orchestrator.getRecentMessages());
      setAgents(orchestrator.getAllAgents());
    } catch (err) {
      console.error("Failed to send message:", err);
    }

    setIsSending(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="w-6 h-6 text-orange-400" />
          Agent Architecture
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          8 specialized agents collaborate to provide personalized learning,
          code review, simulation, and more.
        </p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="bg-zinc-800">
          <TabsTrigger value="overview" className="text-xs">
            <Activity className="w-3 h-3 mr-1" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="chat" className="text-xs">
            <MessageSquare className="w-3 h-3 mr-1" />
            Test Chat
          </TabsTrigger>
          <TabsTrigger value="logs" className="text-xs">
            <Cpu className="w-3 h-3 mr-1" />
            Message Log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {agents.map((agent) => (
              <Card
                key={agent.id}
                className={`border p-4 cursor-pointer transition-colors hover:opacity-80 ${
                  agentColors[agent.id] || "border-zinc-700 bg-zinc-900"
                } ${selectedAgent === agent.id ? "ring-2 ring-orange-500" : ""}`}
                onClick={() => setSelectedAgent(agent.id)}
              >
                <div className="flex items-center gap-2 mb-2">
                  {agentIcons[agent.id]}
                  <span className="text-sm font-semibold">{agent.name}</span>
                </div>
                <p className="text-xs text-zinc-400 mb-2">{agent.role}</p>
                <div className="flex items-center justify-between">
                  <Badge
                    variant="secondary"
                    className={`text-xs ${
                      agent.status === "idle"
                        ? "bg-zinc-800 text-zinc-400"
                        : agent.status === "busy"
                        ? "bg-blue-900 text-blue-400"
                        : "bg-zinc-800 text-zinc-600"
                    }`}
                  >
                    {agent.status}
                  </Badge>
                  <span className="text-xs text-zinc-600">
                    {agent.messageCount} msgs
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {agent.capabilities.slice(0, 2).map((cap) => (
                    <Badge
                      key={cap}
                      variant="secondary"
                      className="text-[10px] bg-zinc-800 text-zinc-500"
                    >
                      {cap}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="chat" className="space-y-4">
          <Card className="bg-zinc-900 border-zinc-800 p-4">
            <h3 className="text-sm font-semibold text-zinc-200 mb-4">
              Test Agent Communication
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">
                  Target Agent
                </label>
                <select
                  value={selectedAgent || ""}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-sm text-zinc-300"
                >
                  <option value="">Select agent...</option>
                  {agents.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">
                  Topic
                </label>
                <input
                  value={testTopic}
                  onChange={(e) => setTestTopic(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-sm text-zinc-300"
                  placeholder="e.g., explain, review, score"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="text-xs text-zinc-500 mb-1 block">
                Payload (JSON)
              </label>
              <textarea
                value={testPayload}
                onChange={(e) => setTestPayload(e.target.value)}
                className="w-full h-24 bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-xs font-mono text-zinc-300 resize-none"
              />
            </div>
            <Button
              onClick={sendTestMessage}
              disabled={!selectedAgent || isSending}
              className="bg-orange-600 hover:bg-orange-700"
              size="sm"
            >
              <Send className="w-3 h-3 mr-1" />
              {isSending ? "Sending..." : "Send Message"}
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card className="bg-zinc-900 border-zinc-800 p-4">
            <h3 className="text-sm font-semibold text-zinc-200 mb-4">
              Recent Messages
            </h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {messages.length === 0 && (
                <p className="text-sm text-zinc-600 text-center py-8">
                  No messages yet. Send a test message to see logs.
                </p>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className="flex items-start gap-2 p-2 rounded-lg bg-zinc-800/50"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {msg.type === "request" ? (
                      <ArrowIcon className="w-3 h-3 text-blue-400" />
                    ) : msg.type === "response" ? (
                      <ArrowIcon className="w-3 h-3 text-emerald-400 rotate-180" />
                    ) : (
                      <ArrowIcon className="w-3 h-3 text-red-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="text-[10px] bg-zinc-700"
                      >
                        {msg.from}
                      </Badge>
                      <span className="text-[10px] text-zinc-600">→</span>
                      <Badge
                        variant="secondary"
                        className="text-[10px] bg-zinc-700"
                      >
                        {msg.to}
                      </Badge>
                      <span className="text-[10px] text-zinc-600">
                        {msg.topic}
                      </span>
                    </div>
                    <pre className="text-[10px] text-zinc-500 mt-1 overflow-x-auto">
                      {JSON.stringify(msg.payload, null, 2).slice(0, 200)}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
