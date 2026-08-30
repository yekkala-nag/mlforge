import { BaseAgent, AgentMessage } from "./base-agent";

export class KnowledgeAgent extends BaseAgent {
  private knowledgeBase: Map<string, string[]> = new Map();

  constructor() {
    super(
      "knowledge",
      "Knowledge Agent",
      "Provides contextual explanations and connects concepts across domains",
      ["explain", "connect-concepts", "faq"]
    );

    this.knowledgeBase.set("linear-regression", [
      "Linear regression finds the best-fitting line through data points",
      "The cost function (MSE) measures average squared prediction error",
      "Gradient descent iteratively updates weights to minimize cost",
      "R² score indicates how much variance the model explains",
    ]);

    this.knowledgeBase.set("gradient-descent", [
      "Gradient descent follows the steepest downhill direction",
      "Learning rate controls step size — too large overshoots, too small is slow",
      "The gradient points in the direction of steepest increase",
      "Batch, stochastic, and mini-batch are variants of gradient descent",
    ]);

    this.knowledgeBase.set("overfitting", [
      "Overfitting: model memorizes training data but fails on new data",
      "Regularization adds penalties to prevent complex models",
      "Cross-validation estimates generalization performance",
      "More data and simpler models reduce overfitting risk",
    ]);

    this.on("explain", async (msg) => {
      const { concept } = msg.payload as { concept: string };
      const explanations = this.knowledgeBase.get(concept) || [
        `The concept of ${concept} is fundamental to machine learning.`,
        `Understanding ${concept} helps build better models.`,
      ];
      return this.createResponse(msg, "response", {
        concept,
        explanations,
        relatedConcepts: this.findRelated(concept),
      });
    });

    this.on("connect", async (msg) => {
      const { conceptA, conceptB } = msg.payload as {
        conceptA: string;
        conceptB: string;
      };
      return this.createResponse(msg, "response", {
        connection: this.explainConnection(conceptA, conceptB),
        strength: this.connectionStrength(conceptA, conceptB),
      });
    });

    this.on("*", async (msg) => {
      return this.createResponse(msg, "response", {
        message: `Knowledge agent received: ${msg.topic}`,
      });
    });
  }

  private findRelated(concept: string): string[] {
    const relations: Record<string, string[]> = {
      "linear-regression": ["gradient-descent", "mse", "overfitting"],
      "gradient-descent": ["learning-rate", "convex-optimization"],
      overfitting: ["regularization", "cross-validation", "bias-variance"],
    };
    return relations[concept] || [];
  }

  private explainConnection(a: string, b: string): string {
    return `${a} and ${b} are connected concepts in machine learning. Understanding one helps deepen knowledge of the other.`;
  }

  private connectionStrength(a: string, b: string): number {
    const strong: Record<string, string[]> = {
      "linear-regression": ["gradient-descent", "mse"],
      overfitting: ["regularization"],
    };
    if (strong[a]?.includes(b) || strong[b]?.includes(a)) return 0.9;
    return 0.5;
  }
}
