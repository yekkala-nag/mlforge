import { BaseAgent } from "./base-agent";

export class SimulationAgent extends BaseAgent {
  constructor() {
    super(
      "simulation",
      "Simulation Agent",
      "Manages algorithm simulations and ensures accurate results",
      ["run-simulation", "validate-results", "explain-behavior"]
    );

    this.on("run", async (msg) => {
      const { algorithm, params } = msg.payload as {
        algorithm: string;
        params: Record<string, unknown>;
      };

      const result = await this.executeSimulation(algorithm, params);
      return this.createResponse(msg, "response", result);
    });

    this.on("validate", async (msg) => {
      const { results, expected } = msg.payload as {
        results: Record<string, number>;
        expected: Record<string, number>;
      };

      const validation = this.validateResults(results, expected);
      return this.createResponse(msg, "response", validation);
    });

    this.on("explain-behavior", async (msg) => {
      const { algorithm } = msg.payload as {
        algorithm: string;
        params?: Record<string, unknown>;
        results?: Record<string, unknown>;
      };

      const explanation = this.explainBehavior(algorithm);
      return this.createResponse(msg, "response", { explanation });
    });

    this.on("*", async (msg) => {
      return this.createResponse(msg, "response", {
        message: `Simulation agent received: ${msg.topic}`,
      });
    });
  }

  private async executeSimulation(
    algorithm: string,
    params: Record<string, unknown>
  ) {
    return {
      algorithm,
      params,
      metrics: {
        accuracy: 0.85 + Math.random() * 0.1,
        loss: 0.1 + Math.random() * 0.2,
        trainingTime: Math.floor(Math.random() * 500),
      },
      status: "completed",
    };
  }

  private validateResults(
    results: Record<string, number>,
    expected: Record<string, number>
  ) {
    const diffs = Object.keys(expected).map((key) => ({
      metric: key,
      actual: results[key],
      expected: expected[key],
      diff: Math.abs((results[key] || 0) - (expected[key] || 0)),
      withinTolerance: Math.abs((results[key] || 0) - (expected[key] || 0)) < 0.1,
    }));

    return {
      valid: diffs.every((d) => d.withinTolerance),
      details: diffs,
    };
  }

  private explainBehavior(
    algorithm: string
  ): string {
    const explanations: Record<string, string> = {
      "linear-regression":
        "Linear regression finds the optimal line by minimizing the sum of squared errors. The weights are updated via gradient descent.",
      "logistic-regression":
        "Logistic regression uses the sigmoid function to map predictions to probabilities. It minimizes cross-entropy loss.",
      knn: "KNN classifies by majority vote of the k nearest neighbors. It's a lazy learner with no training phase.",
      "decision-tree":
        "Decision trees recursively split data on features that maximize information gain (minimize impurity).",
      "random-forest":
        "Random forest combines multiple decision trees with bagging and random feature subsets for robust predictions.",
      "k-means":
        "K-means partitions data into k clusters by iteratively assigning points to nearest centroid and updating centroids.",
      svm: "SVM finds the maximum-margin hyperplane that separates classes. The kernel trick handles non-linear boundaries.",
    };

    return (
      explanations[algorithm] ||
      `The ${algorithm} algorithm processes the data with the given parameters.`
    );
  }
}
