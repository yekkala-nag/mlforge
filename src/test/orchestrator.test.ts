import { describe, it, expect } from "vitest";
import { AgentOrchestrator } from "@/lib/agents/orchestrator";
import { AgentMessage } from "@/lib/agents/base-agent";

function createMessage(
  to: string,
  topic: string,
  payload: unknown
): AgentMessage {
  return {
    id: `test-${Date.now()}`,
    from: "test",
    to,
    type: "request",
    topic,
    payload,
    timestamp: Date.now(),
  };
}

describe("AgentOrchestrator", () => {
  const orchestrator = new AgentOrchestrator();

  it("has all agents registered", () => {
    const agents = orchestrator.getAllAgents();
    expect(agents.length).toBe(8);
    expect(agents.map((a) => a.id)).toContain("curriculum");
    expect(agents.map((a) => a.id)).toContain("knowledge");
    expect(agents.map((a) => a.id)).toContain("simulation");
    expect(agents.map((a) => a.id)).toContain("mlops");
  });

  it("routes messages to correct agents", async () => {
    const msg = createMessage("curriculum", "assess-skill", {
      worldId: "playground",
      completedModules: [],
      score: 50,
    });

    const response = await orchestrator.send(msg);
    expect(response.from).toBe("curriculum");
    expect(response.to).toBe("test");
    expect(response.type).toBe("response");
  });

  it("returns error for unknown agent", async () => {
    const msg = createMessage("nonexistent", "test", {});
    const response = await orchestrator.send(msg);
    expect(response.type).toBe("error");
  });

  it("broadcasts to all agents", async () => {
    const responses = await orchestrator.broadcast("status-check", {});
    expect(responses.length).toBe(8);
  });

  it("tracks message log", async () => {
    const initialCount = orchestrator.getRecentMessages().length;
    await orchestrator.send(
      createMessage("knowledge", "explain", { concept: "test" })
    );
    const newCount = orchestrator.getRecentMessages().length;
    expect(newCount).toBeGreaterThan(initialCount);
  });
});
