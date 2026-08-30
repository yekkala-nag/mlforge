import { describe, it, expect } from "vitest";
import { CurriculumAgent } from "@/lib/agents/curriculum-agent";
import { KnowledgeAgent } from "@/lib/agents/knowledge-agent";
import { SimulationAgent } from "@/lib/agents/simulation-agent";
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

describe("CurriculumAgent", () => {
  const agent = new CurriculumAgent();

  it("has correct state", () => {
    const state = agent.getState();
    expect(state.id).toBe("curriculum");
    expect(state.name).toBe("Curriculum Agent");
    expect(state.capabilities).toContain("path-design");
  });

  it("assesses skill level correctly", async () => {
    const msg = createMessage("curriculum", "assess-skill", {
      worldId: "playground",
      completedModules: ["linear-regression", "logistic-regression"],
      score: 75,
    });

    const response = await agent.process(msg);
    expect(response.type).toBe("response");
    expect(response.payload).toHaveProperty("level");
    expect(response.payload).toHaveProperty("nextWorld");
  });

  it("generates learning path", async () => {
    const msg = createMessage("curriculum", "generate-path", {
      goal: "understand-basics",
      currentLevel: "beginner",
    });

    const response = await agent.process(msg);
    expect(response.type).toBe("response");
    expect(response.payload).toHaveProperty("path");
  });
});

describe("KnowledgeAgent", () => {
  const agent = new KnowledgeAgent();

  it("explains concepts", async () => {
    const msg = createMessage("knowledge", "explain", {
      concept: "linear-regression",
    });

    const response = await agent.process(msg);
    expect(response.type).toBe("response");
    expect(response.payload).toHaveProperty("explanations");
  });

  it("connects concepts", async () => {
    const msg = createMessage("knowledge", "connect", {
      conceptA: "linear-regression",
      conceptB: "gradient-descent",
    });

    const response = await agent.process(msg);
    expect(response.type).toBe("response");
    expect(response.payload).toHaveProperty("connection");
  });
});

describe("SimulationAgent", () => {
  const agent = new SimulationAgent();

  it("runs simulation", async () => {
    const msg = createMessage("simulation", "run", {
      algorithm: "linear-regression",
      params: { learningRate: 0.01, iterations: 100 },
    });

    const response = await agent.process(msg);
    expect(response.type).toBe("response");
    expect(response.payload).toHaveProperty("metrics");
  });

  it("validates results", async () => {
    const msg = createMessage("simulation", "validate", {
      results: { accuracy: 0.85 },
      expected: { accuracy: 0.8 },
    });

    const response = await agent.process(msg);
    expect(response.type).toBe("response");
    expect(response.payload).toHaveProperty("valid");
  });

  it("explains behavior", async () => {
    const msg = createMessage("simulation", "explain-behavior", {
      algorithm: "linear-regression",
      params: {},
      results: {},
    });

    const response = await agent.process(msg);
    expect(response.type).toBe("response");
    expect(response.payload).toHaveProperty("explanation");
  });
});
