"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Rocket,
  CheckCircle,
  Lock,
  BarChart3,
  Code2,
} from "lucide-react";

interface CapstoneProject {
  id: string;
  level: number;
  title: string;
  description: string;
  constraints: string[];
  skills: string[];
  difficulty: "beginner" | "intermediate" | "advanced" | "expert" | "master";
  status: "locked" | "available" | "in-progress" | "completed";
}

const projects: CapstoneProject[] = [
  {
    id: "house-prices",
    level: 1,
    title: "House Price Prediction",
    description:
      "Build a complete ML pipeline: clean data, engineer features, train models, evaluate, select the best one, and expose a prediction API.",
    constraints: ["MAE < $20K", "Inference < 100ms", "Explainable predictions"],
    skills: ["Feature engineering", "Model selection", "API design"],
    difficulty: "beginner",
    status: "available",
  },
  {
    id: "customer-churn",
    level: 2,
    title: "Customer Churn System",
    description:
      "Handle class imbalance, engineer behavioral features, compare models, optimize thresholds, and provide explainability.",
    constraints: ["Recall > 85%", "Precision > 80%", "Latency < 50ms"],
    skills: ["Imbalanced data", "Threshold tuning", "SHAP values"],
    difficulty: "intermediate",
    status: "locked",
  },
  {
    id: "recommendations",
    level: 3,
    title: "Recommendation Engine",
    description:
      "Build Users → Events → Features → Candidate Generation → Ranking → Recommendations pipeline.",
    constraints: [
      "NDCG@10 > 0.7",
      "P95 latency < 200ms",
      "Handle cold start",
    ],
    skills: ["Embeddings", "Two-stage retrieval", "A/B testing"],
    difficulty: "advanced",
    status: "locked",
  },
  {
    id: "fraud-detection",
    level: 4,
    title: "Fraud Detection Platform",
    description:
      "Build a real-time fraud detection system with streaming data, extreme class imbalance, and strict latency requirements.",
    constraints: [
      "Recall > 95%",
      "P99 latency < 100ms",
      "False positive rate < 1%",
    ],
    skills: [
      "Streaming ML",
      "Extreme imbalance",
      "Production monitoring",
    ],
    difficulty: "expert",
    status: "locked",
  },
  {
    id: "ml-platform",
    level: 5,
    title: "Production ML Platform",
    description:
      "Design a complete ML platform from scratch: data pipeline, feature store, training pipeline, experiment tracking, model registry, deployment, monitoring, and retraining.",
    constraints: [
      "99.9% availability",
      "Auto-retraining triggers",
      "Cost budget $500/mo",
    ],
    skills: [
      "MLOps",
      "System design",
      "Architecture decisions",
    ],
    difficulty: "master",
    status: "locked",
  },
];

const difficultyColors: Record<string, string> = {
  beginner: "bg-emerald-900/50 text-emerald-400",
  intermediate: "bg-blue-900/50 text-blue-400",
  advanced: "bg-amber-900/50 text-amber-400",
  expert: "bg-orange-900/50 text-orange-400",
  master: "bg-red-900/50 text-red-400",
};

export function CapstoneProjects() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Rocket className="w-6 h-6 text-orange-400" />
          Capstone Projects
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Real ML engineering missions. No tutorials. Just a business problem,
          constraints, and a blank workspace.
        </p>
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <Card
            key={project.id}
            className={`p-6 transition-all ${
              project.status === "locked"
                ? "bg-zinc-900/50 border-zinc-800/50 opacity-60"
                : "bg-zinc-900 border-zinc-800 hover:border-orange-500/30"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${
                    project.status === "locked"
                      ? "bg-zinc-800 text-zinc-600"
                      : "bg-orange-600/20 text-orange-400"
                  }`}
                >
                  {project.level}
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-200">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      className={`text-xs ${difficultyColors[project.difficulty]}`}
                    >
                      {project.difficulty}
                    </Badge>
                    {project.status === "completed" && (
                      <Badge className="bg-emerald-600 text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Completed
                      </Badge>
                    )}
                    {project.status === "locked" && (
                      <Badge variant="secondary" className="bg-zinc-800 text-xs">
                        <Lock className="w-3 h-3 mr-1" />
                        Complete Level {project.level - 1} first
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              {project.status !== "locked" && (
                <Button
                  className="bg-orange-600 hover:bg-orange-700"
                  size="sm"
                >
                  Start Mission
                </Button>
              )}
            </div>

            <p className="text-sm text-zinc-400 mb-4">{project.description}</p>

            <Separator className="bg-zinc-800 mb-4" />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-semibold text-zinc-500 mb-2 flex items-center gap-1">
                  <BarChart3 className="w-3 h-3" />
                  Constraints
                </h4>
                <div className="space-y-1">
                  {project.constraints.map((c) => (
                    <div
                      key={c}
                      className="text-xs text-zinc-400 bg-zinc-800/50 rounded px-2 py-1"
                    >
                      {c}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-zinc-500 mb-2 flex items-center gap-1">
                  <Code2 className="w-3 h-3" />
                  Skills Practiced
                </h4>
                <div className="space-y-1">
                  {project.skills.map((s) => (
                    <div
                      key={s}
                      className="text-xs text-zinc-400 bg-zinc-800/50 rounded px-2 py-1"
                    >
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
