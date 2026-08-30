import { BaseAgent } from "./base-agent";

export class ChallengeAgent extends BaseAgent {
  private activeChallenges: Map<string, Record<string, unknown>> = new Map();

  constructor() {
    super(
      "challenge",
      "Challenge Agent",
      "Manages challenges, scores submissions, and adapts difficulty",
      ["score-submission", "get-hint", "adapt-difficulty"]
    );

    this.on("score", async (msg) => {
      const { challengeId, metrics } = msg.payload as {
        challengeId: string;
        code?: string;
        metrics: Record<string, number>;
      };

      const score = this.calculateScore(metrics);
      const feedback = this.generateFeedback(score);

      this.activeChallenges.set(challengeId, {
        lastScore: score,
        attempts: ((this.activeChallenges.get(challengeId)?.attempts as number) || 0) + 1,
      });

      return this.createResponse(msg, "response", {
        score,
        feedback,
        passed: score >= 70,
        nextHint: score < 50 ? this.getNextHint(challengeId) : null,
      });
    });

    this.on("hint", async (msg) => {
      const { challengeId, level } = msg.payload as {
        challengeId: string;
        level: number;
      };
      const hint = this.getHint(challengeId, level);
      return this.createResponse(msg, "response", { hint, level });
    });

    this.on("adapt", async (msg) => {
      const { recentScores } = msg.payload as { recentScores: number[] };
      const avgScore =
        recentScores.reduce((a, b) => a + b, 0) / recentScores.length;

      let difficulty = "normal";
      if (avgScore > 85) difficulty = "harder";
      if (avgScore < 50) difficulty = "easier";

      return this.createResponse(msg, "response", {
        difficulty,
        averageScore: avgScore,
      });
    });

    this.on("*", async (msg) => {
      return this.createResponse(msg, "response", {
        message: `Challenge agent received: ${msg.topic}`,
      });
    });
  }

  private calculateScore(metrics: Record<string, number>): number {
    let score = 0;
    if (metrics.accuracy) score += metrics.accuracy * 40;
    if (metrics.latency) score += Math.max(0, 30 - metrics.latency) * 2;
    if (metrics.precision) score += metrics.precision * 15;
    if (metrics.recall) score += metrics.recall * 15;
    return Math.min(100, Math.round(score));
  }

  private generateFeedback(
    score: number
  ): string {
    if (score >= 90) return "Excellent! Outstanding performance.";
    if (score >= 70) return "Good work! Meeting the requirements.";
    if (score >= 50) return "Getting there. Try tuning hyperparameters.";
    return "Keep trying. Review the algorithm fundamentals.";
  }

  private getHint(challengeId: string, level: number): string {
    const hints: Record<number, string> = {
      1: "Think about what the algorithm is optimizing.",
      2: "Try adjusting the learning rate or regularization.",
      3: "Look at the data preprocessing steps.",
      4: "The solution involves feature engineering.",
    };
    return hints[level] || "Keep experimenting!";
  }

  private getNextHint(challengeId: string): string {
    const state = this.activeChallenges.get(challengeId);
    const attempts = (state?.attempts as number) || 0;
    return this.getHint(challengeId, Math.min(attempts + 1, 4));
  }
}
