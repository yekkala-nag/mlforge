import { BaseAgent, AgentMessage } from "./base-agent";

export class ExperimentAgent extends BaseAgent {
  private experiments: Map<string, Record<string, unknown>> = new Map();

  constructor() {
    super(
      "experiment",
      "Experiment Agent",
      "Tracks experiments, compares results, and recommends next experiments",
      ["log-experiment", "compare-results", "suggest-experiment"]
    );

    this.on("log", async (msg) => {
      const { experimentId, params, results } = msg.payload as {
        experimentId: string;
        params: Record<string, unknown>;
        results: Record<string, number>;
      };

      this.experiments.set(experimentId, {
        params,
        results,
        timestamp: Date.now(),
      });

      return this.createResponse(msg, "response", {
        logged: true,
        experimentCount: this.experiments.size,
      });
    });

    this.on("compare", async (msg) => {
      const { ids } = msg.payload as { ids: string[] };
      const comparison = ids
        .map((id) => ({
          id,
          ...(this.experiments.get(id) || {}),
        }))
        .filter((e: Record<string, unknown>) => e.results);

      return this.createResponse(msg, "response", {
        comparison,
        bestAccuracy: Math.max(
          ...comparison.map((c: Record<string, unknown>) => {
            const results = c.results as Record<string, number>;
            return results?.accuracy || 0;
          })
        ),
      });
    });

    this.on("suggest", async (msg) => {
      const { currentResults } = msg.payload as {
        currentResults: Record<string, number>;
      };

      const suggestions = this.suggestNextExperiments(currentResults);
      return this.createResponse(msg, "response", { suggestions });
    });

    this.on("*", async (msg) => {
      return this.createResponse(msg, "response", {
        message: `Experiment agent received: ${msg.topic}`,
      });
    });
  }

  private suggestNextExperiments(results: Record<string, number>) {
    const suggestions = [];

    if ((results.accuracy || 0) < 0.8) {
      suggestions.push({
        type: "feature-engineering",
        reason: "Accuracy is below 80%. Try creating new features.",
      });
    }

    if ((results.accuracy || 0) > 0.95) {
      suggestions.push({
        type: "regularization",
        reason: "Accuracy is very high. Check for overfitting with cross-validation.",
      });
    }

    suggestions.push({
      type: "hyperparameter-tuning",
      reason: "Always worth exploring the hyperparameter space.",
    });

    return suggestions;
  }
}
