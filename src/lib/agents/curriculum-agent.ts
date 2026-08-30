import { BaseAgent } from "./base-agent";

export class CurriculumAgent extends BaseAgent {
  constructor() {
    super(
      "curriculum",
      "Curriculum Agent",
      "Designs personalized learning paths based on student progress and goals",
      ["path-design", "skill-assessment", "recommendation"]
    );

    this.on("assess-skill", async (msg) => {
      const { worldId, completedModules, score } = msg.payload as {
        worldId: string;
        completedModules: string[];
        score: number;
      };

      const level =
        score > 80 ? "advanced" : score > 50 ? "intermediate" : "beginner";
      const nextWorld = this.recommendNext(worldId);

      return this.createResponse(msg, "response", {
        level,
        nextWorld,
        reason: this.getReasoning(level, completedModules),
        estimatedTime: level === "beginner" ? "2-3 hours" : "1-2 hours",
      });
    });

    this.on("generate-path", async (msg) => {
      const { goal } = msg.payload as {
        goal: string;
        currentLevel: string;
      };

      const path = this.generateLearningPath(goal);
      return this.createResponse(msg, "response", { path });
    });

    this.on("*", async (msg) => {
      return this.createResponse(msg, "error", {
        error: `Curriculum agent does not handle topic: ${msg.topic}`,
      });
    });
  }

  private recommendNext(
    currentWorld: string
  ): string {
    const worldOrder = [
      "playground",
      "math",
      "from-scratch",
      "datasets",
      "challenges",
      "arena",
      "ops",
      "capstone",
    ];
    const currentIdx = worldOrder.indexOf(currentWorld);
    if (currentIdx < worldOrder.length - 1) {
      return worldOrder[currentIdx + 1];
    }
    return "capstone";
  }

  private getReasoning(
    level: string,
    completed: string[]
  ): string {
    if (level === "beginner") {
      return `You're still building foundational skills. Focus on understanding core concepts before moving to more advanced topics.`;
    }
    if (completed.length > 3) {
      return `Great progress! You've completed several modules. You're ready for more challenging material.`;
    }
    return `You're developing well. Consider exploring the next world to broaden your understanding.`;
  }

  private generateLearningPath(goal: string) {
    const paths: Record<string, string[]> = {
      "understand-basics": ["playground", "math", "from-scratch"],
      "build-models": ["playground", "datasets", "challenges", "arena"],
      "production-ml": ["playground", "ops", "capstone", "system-builder"],
      "interview-prep": [
        "playground",
        "math",
        "from-scratch",
        "challenges",
        "arena",
      ],
    };

    return (
      paths[goal] || [
        "playground",
        "math",
        "from-scratch",
        "datasets",
        "challenges",
      ]
    );
  }
}
