import { BaseAgent, AgentMessage } from "./base-agent";
import { CurriculumAgent } from "./curriculum-agent";
import { KnowledgeAgent } from "./knowledge-agent";
import { CodeMentorAgent } from "./code-mentor-agent";
import { SimulationAgent } from "./simulation-agent";
import { ExperimentAgent } from "./experiment-agent";
import { ChallengeAgent } from "./challenge-agent";
import { ProjectAgent } from "./project-agent";
import { MLOpsAgent } from "./mlops-agent";

export type AgentType =
  | "curriculum"
  | "knowledge"
  | "code-mentor"
  | "simulation"
  | "experiment"
  | "challenge"
  | "project"
  | "mlops";

export interface AgentEvent {
  type: "message" | "agent-status" | "orchestrator-status";
  data: unknown;
  timestamp: number;
}

export class AgentOrchestrator {
  private agents: Map<AgentType, BaseAgent> = new Map();
  private messageLog: AgentMessage[] = [];
  private eventListeners: ((event: AgentEvent) => void)[] = [];

  constructor() {
    this.agents.set("curriculum", new CurriculumAgent());
    this.agents.set("knowledge", new KnowledgeAgent());
    this.agents.set("code-mentor", new CodeMentorAgent());
    this.agents.set("simulation", new SimulationAgent());
    this.agents.set("experiment", new ExperimentAgent());
    this.agents.set("challenge", new ChallengeAgent());
    this.agents.set("project", new ProjectAgent());
    this.agents.set("mlops", new MLOpsAgent());
  }

  getAgent(type: AgentType): BaseAgent | undefined {
    return this.agents.get(type);
  }

  getAllAgents() {
    return Array.from(this.agents.values()).map((a) => a.getState());
  }

  async send(message: AgentMessage): Promise<AgentMessage> {
    const agent = this.agents.get(message.to as AgentType);
    if (!agent) {
      return {
        id: `msg-${Date.now()}`,
        from: "orchestrator",
        to: message.from,
        type: "error",
        topic: message.topic,
        payload: { error: `Agent not found: ${message.to}` },
        timestamp: Date.now(),
      };
    }

    this.messageLog.push(message);
    this.emit({ type: "message", data: message, timestamp: Date.now() });

    const response = await agent.process(message);
    this.messageLog.push(response);
    this.emit({ type: "message", data: response, timestamp: Date.now() });

    return response;
  }

  async broadcast(
    topic: string,
    payload: unknown,
    exclude?: AgentType[]
  ): Promise<AgentMessage[]> {
    const responses: AgentMessage[] = [];
    for (const [type, agent] of this.agents) {
      if (exclude?.includes(type)) continue;
      const message: AgentMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        from: "orchestrator",
        to: type,
        type: "request",
        topic,
        payload,
        timestamp: Date.now(),
      };
      const response = await agent.process(message);
      responses.push(response);
    }
    return responses;
  }

  onEvent(listener: (event: AgentEvent) => void) {
    this.eventListeners.push(listener);
    return () => {
      this.eventListeners = this.eventListeners.filter((l) => l !== listener);
    };
  }

  private emit(event: AgentEvent) {
    this.eventListeners.forEach((l) => l(event));
  }

  getRecentMessages(count = 20): AgentMessage[] {
    return this.messageLog.slice(-count);
  }
}

export const orchestrator = new AgentOrchestrator();
