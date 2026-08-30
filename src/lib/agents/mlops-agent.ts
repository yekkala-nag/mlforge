import { BaseAgent } from "./base-agent";

export class MLOpsAgent extends BaseAgent {
  constructor() {
    super(
      "mlops",
      "MLOps Agent",
      "Monitors model health, detects drift, and manages deployments",
      ["check-health", "detect-drift", "manage-deployment"]
    );

    this.on("health-check", async (msg) => {
      const { modelId, metrics } = msg.payload as {
        modelId: string;
        metrics: Record<string, number>;
      };

      const health = this.assessHealth(metrics);
      return this.createResponse(msg, "response", {
        modelId,
        health,
        alerts: this.generateAlerts(metrics),
      });
    });

    this.on("detect-drift", async (msg) => {
      const { baseline, current } = msg.payload as {
        baseline: Record<string, number>;
        current: Record<string, number>;
      };

      const drift = this.calculateDrift(baseline, current);
      return this.createResponse(msg, "response", {
        drift,
        severity: drift > 0.3 ? "high" : drift > 0.1 ? "medium" : "low",
        recommendation:
          drift > 0.3
            ? "Model retraining recommended"
            : "Continue monitoring",
      });
    });

    this.on("recommend-action", async (msg) => {
      const { scenario } = msg.payload as { scenario: string };
      const recommendation = this.getRecommendation(scenario);
      return this.createResponse(msg, "response", { recommendation });
    });

    this.on("*", async (msg) => {
      return this.createResponse(msg, "response", {
        message: `MLOps agent received: ${msg.topic}`,
      });
    });
  }

  private assessHealth(metrics: Record<string, number>): string {
    if ((metrics.accuracy || 0) < 0.7) return "critical";
    if ((metrics.accuracy || 0) < 0.85) return "warning";
    return "healthy";
  }

  private generateAlerts(metrics: Record<string, number>): string[] {
    const alerts = [];
    if ((metrics.accuracy || 0) < 0.8) alerts.push("Low accuracy detected");
    if ((metrics.latency || 0) > 100) alerts.push("High latency detected");
    if ((metrics.errorRate || 0) > 0.05) alerts.push("High error rate");
    return alerts;
  }

  private calculateDrift(
    baseline: Record<string, number>,
    current: Record<string, number>
  ): number {
    const keys = Object.keys(baseline);
    let totalDrift = 0;
    for (const key of keys) {
      const diff = Math.abs((baseline[key] || 0) - (current[key] || 0));
      totalDrift += diff;
    }
    return totalDrift / keys.length;
  }

  private getRecommendation(scenario: string): string {
    const recommendations: Record<string, string> = {
      "accuracy-drop":
        "Retrain the model with recent data. Check for data quality issues.",
      "latency-spike":
        "Profile the model serving pipeline. Consider model optimization.",
      "data-drift":
        "Collect more recent training data. Retrain the model.",
      "feature-drift":
        "Investigate upstream data pipelines. Update feature engineering.",
    };
    return (
      recommendations[scenario] ||
      "Investigate the issue and consider retraining the model."
    );
  }
}
