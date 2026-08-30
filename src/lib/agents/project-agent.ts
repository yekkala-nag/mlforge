import { BaseAgent, AgentMessage } from "./base-agent";

export class ProjectAgent extends BaseAgent {
  constructor() {
    super(
      "project",
      "Project Agent",
      "Guides capstone projects from idea to deployment",
      ["validate-project", "suggest-approach", "review-deliverable"]
    );

    this.on("validate", async (msg) => {
      const { projectId, deliverables } = msg.payload as {
        projectId: string;
        deliverables: string[];
      };

      const requiredDeliverables = [
        "data-exploration",
        "model-training",
        "evaluation",
        "deployment",
      ];

      const completed = requiredDeliverables.filter((d) =>
        deliverables.includes(d)
      );
      const missing = requiredDeliverables.filter(
        (d) => !deliverables.includes(d)
      );

      return this.createResponse(msg, "response", {
        progress: completed.length / requiredDeliverables.length,
        completed,
        missing,
        ready: missing.length === 0,
      });
    });

    this.on("suggest-approach", async (msg) => {
      const { projectType, constraints } = msg.payload as {
        projectType: string;
        constraints: string[];
      };

      const approaches = this.recommendApproach(projectType, constraints);
      return this.createResponse(msg, "response", { approaches });
    });

    this.on("review", async (msg) => {
      const { deliverable, content } = msg.payload as {
        deliverable: string;
        content: string;
      };

      return this.createResponse(msg, "response", {
        quality: this.assessQuality(deliverable, content),
        suggestions: this.getProjectSuggestions(deliverable),
      });
    });

    this.on("*", async (msg) => {
      return this.createResponse(msg, "response", {
        message: `Project agent received: ${msg.topic}`,
      });
    });
  }

  private recommendApproach(projectType: string, constraints: string[]) {
    const approaches: Record<string, string[]> = {
      "house-price": [
        "Start with data exploration to understand feature distributions",
        "Try linear regression as a baseline",
        "Feature engineer from existing columns",
        "Compare with random forest",
      ],
      "spam-detector": [
        "Text preprocessing is crucial",
        "TF-IDF vectorization for feature extraction",
        "Start with logistic regression or naive Bayes",
        "Optimize for precision and recall",
      ],
    };

    return (
      approaches[projectType] || [
        "Understand the problem first",
        "Explore the data thoroughly",
        "Start simple, then iterate",
      ]
    );
  }

  private assessQuality(deliverable: string, content: string): number {
    let quality = 50;
    if (content.length > 100) quality += 20;
    if (content.includes("def ") || content.includes("class ")) quality += 15;
    if (content.includes("#") || content.includes('"""')) quality += 15;
    return Math.min(100, quality);
  }

  private getProjectSuggestions(deliverable: string): string[] {
    const suggestions: Record<string, string[]> = {
      "data-exploration": [
        "Check for missing values",
        "Visualize feature distributions",
        "Look for correlations",
      ],
      "model-training": [
        "Start with a simple baseline",
        "Try multiple algorithms",
        "Tune hyperparameters",
      ],
      evaluation: [
        "Use cross-validation",
        "Check multiple metrics",
        "Analyze confusion matrix",
      ],
      deployment: [
        "Create a simple API endpoint",
        "Add input validation",
        "Monitor prediction distribution",
      ],
    };

    return suggestions[deliverable] || ["Review the requirements carefully"];
  }
}
