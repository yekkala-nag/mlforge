export interface AgentMessage {
  id: string;
  from: string;
  to: string;
  type: "request" | "response" | "event" | "error";
  topic: string;
  payload: unknown;
  timestamp: number;
}

export interface AgentState {
  id: string;
  name: string;
  role: string;
  status: "idle" | "busy" | "offline";
  capabilities: string[];
  lastActive: number;
  messageCount: number;
}

export type AgentHandler = (message: AgentMessage) => Promise<AgentMessage>;

export abstract class BaseAgent {
  protected id: string;
  protected name: string;
  protected role: string;
  protected capabilities: string[];
  protected status: AgentState["status"] = "idle";
  protected messageCount = 0;
  protected lastActive = 0;
  private handlers: Map<string, AgentHandler> = new Map();
  private messageLog: AgentMessage[] = [];

  constructor(id: string, name: string, role: string, capabilities: string[]) {
    this.id = id;
    this.name = name;
    this.role = role;
    this.capabilities = capabilities;
  }

  getState(): AgentState {
    return {
      id: this.id,
      name: this.name,
      role: this.role,
      status: this.status,
      capabilities: this.capabilities,
      lastActive: this.lastActive,
      messageCount: this.messageCount,
    };
  }

  on(topic: string, handler: AgentHandler) {
    this.handlers.set(topic, handler);
  }

  async process(message: AgentMessage): Promise<AgentMessage> {
    this.status = "busy";
    this.lastActive = Date.now();
    this.messageCount++;
    this.messageLog.push(message);

    const handler = this.handlers.get(message.topic) || this.handlers.get("*");
    if (!handler) {
      this.status = "idle";
      return this.createResponse(message, "error", {
        error: `No handler for topic: ${message.topic}`,
      });
    }

    try {
      const response = await handler(message);
      this.status = "idle";
      return response;
    } catch (err) {
      this.status = "idle";
      return this.createResponse(message, "error", {
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  protected createResponse(
    original: AgentMessage,
    type: AgentMessage["type"],
    payload: unknown
  ): AgentMessage {
    return {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      from: this.id,
      to: original.from,
      type,
      topic: `${original.topic}.response`,
      payload,
      timestamp: Date.now(),
    };
  }

  getRecentMessages(count = 10): AgentMessage[] {
    return this.messageLog.slice(-count);
  }
}
