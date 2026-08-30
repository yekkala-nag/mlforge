"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  ChevronLeft,
  Lightbulb,
  BookOpen,
  Zap,
} from "lucide-react";

interface TutorialStep {
  title: string;
  content: string;
  insight?: string;
  tryIt?: string;
}

interface AlgorithmTutorial {
  id: string;
  name: string;
  icon: string;
  steps: TutorialStep[];
}

const tutorials: AlgorithmTutorial[] = [
  {
    id: "linear-regression",
    name: "Linear Regression",
    icon: "📈",
    steps: [
      {
        title: "The Goal",
        content:
          "Linear regression finds the best-fitting straight line through your data. It minimizes the sum of squared differences between predicted and actual values.",
        insight:
          "This is the simplest and most interpretable ML algorithm. Every other algorithm builds on concepts introduced here.",
      },
      {
        title: "The Parameters",
        content:
          "The model learns two parameters: w (weight/slope) and b (bias/intercept). Together they define the line: y = w*x + b",
        insight:
          "Try adjusting the learning rate. Too small = slow convergence. Too large = overshooting and oscillation.",
      },
      {
        title: "The Loss Function",
        content:
          "Mean Squared Error (MSE) measures how far predictions are from actual values. The goal is to minimize this loss.",
        tryIt: "Watch the loss curve decrease as training progresses. Notice how it flattens out.",
      },
      {
        title: "Regularization",
        content:
          "L2 regularization adds a penalty for large weights. This prevents the model from fitting noise in the training data.",
        tryIt: "Increase regularization and watch the line flatten. This reduces overfitting.",
      },
      {
        title: "Key Takeaway",
        content:
          "Linear regression is fast, interpretable, and a great baseline. But it can only learn linear relationships.",
        insight:
          "When you see a straight line through scattered data, that's linear regression doing its job.",
      },
    ],
  },
  {
    id: "logistic-regression",
    name: "Logistic Regression",
    icon: "📊",
    steps: [
      {
        title: "The Goal",
        content:
          "Despite the name, logistic regression is for classification. It predicts the probability that an input belongs to a class.",
        insight:
          "The sigmoid function squashes any number into the range [0, 1], making it perfect for probability estimates.",
      },
      {
        title: "The Sigmoid",
        content:
          "σ(z) = 1 / (1 + e^(-z)). When z is large positive, σ ≈ 1. When z is large negative, σ ≈ 0. At z = 0, σ = 0.5.",
        tryIt: "The decision boundary is where the model outputs 0.5. Watch the two classes separate.",
      },
      {
        title: "Cross-Entropy Loss",
        content:
          "Unlike MSE, logistic regression uses cross-entropy loss. This penalizes confident wrong predictions heavily.",
        insight:
          "Cross-entropy loss grows without bound for wrong predictions, forcing the model to be more certain.",
      },
      {
        title: "The Decision Boundary",
        content:
          "The boundary is a line (or hyperplane) where the model is uncertain. Points on one side are class 0, the other side class 1.",
        tryIt: "Move the noise slider to see how the boundary becomes less clean with more overlap.",
      },
      {
        title: "Key Takeaway",
        content:
          "Logistic regression is the go-to for binary classification. It's fast, interpretable, and the boundary is easy to visualize.",
      },
    ],
  },
  {
    id: "knn",
    name: "K-Nearest Neighbors",
    icon: "🔍",
    steps: [
      {
        title: "The Idea",
        content:
          "KNN is simple: to classify a new point, look at its k nearest neighbors and take a majority vote.",
        insight:
          "KNN is a 'lazy learner' — it does no training at all. All the work happens at prediction time.",
      },
      {
        title: "The K Parameter",
        content:
          "K controls how many neighbors to consider. Small k = sensitive to noise. Large k = smoother boundaries.",
        tryIt: "Set k=1 to see perfect training accuracy but noisy boundaries. Set k=20 for smoother but less flexible boundaries.",
      },
      {
        title: "Distance Matters",
        content:
          "KNN uses Euclidean distance by default. Points that are close in feature space are considered similar.",
        insight:
          "Feature scaling is critical for KNN. Without normalization, features with larger ranges dominate the distance calculation.",
      },
      {
        title: "The Bias-Variance Tradeoff",
        content:
          "Small k = low bias, high variance (overfitting). Large k = high bias, low variance (underfitting).",
        tryIt: "Find the sweet spot where k gives good accuracy without overfitting.",
      },
      {
        title: "Key Takeaway",
        content:
          "KNN is intuitive and works well for small datasets. But it's slow for large datasets and high dimensions.",
      },
    ],
  },
  {
    id: "decision-tree",
    name: "Decision Tree",
    icon: "🌳",
    steps: [
      {
        title: "The Idea",
        content:
          "A decision tree splits data into regions using simple if-then rules. Each leaf node makes a prediction.",
        insight:
          "Decision trees are like playing 20 questions — each split asks about one feature to narrow down the answer.",
      },
      {
        title: "Splitting Criteria",
        content:
          "The tree chooses splits that maximize information gain (or minimize Gini impurity). Better splits separate classes more cleanly.",
        tryIt: "Watch how the tree grows deeper with more iterations. Each split is chosen to be as informative as possible.",
      },
      {
        title: "Overfitting",
        content:
          "Deep trees can memorize training data perfectly but fail on new data. max_depth controls tree complexity.",
        tryIt: "Set max_depth=1 for a 'stump' (high bias). Set max_depth=20 for a deep tree (high variance).",
      },
      {
        title: "Interpretability",
        content:
          "Unlike neural networks, you can read a decision tree like a flowchart. Each path from root to leaf is a rule.",
        insight:
          "Decision trees are the most interpretable ML algorithm. You can explain exactly why a prediction was made.",
      },
      {
        title: "Key Takeaway",
        content:
          "Decision trees are great for understanding decisions. But single trees are unstable — small data changes can create very different trees.",
      },
    ],
  },
];

export function GuidedTutorial({ algorithmId }: { algorithmId: string }) {
  const [step, setStep] = useState(0);
  const tutorial = tutorials.find((t) => t.id === algorithmId);

  if (!tutorial) return null;

  const current = tutorial.steps[step];
  const total = tutorial.steps.length;

  return (
    <Card className="bg-zinc-900 border-zinc-800 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-orange-400" />
          <span className="text-sm font-semibold text-zinc-200">
            Guided Tutorial
          </span>
        </div>
        <Badge variant="secondary" className="text-xs">
          {step + 1} / {total}
        </Badge>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-orange-400">
          {current.title}
        </h4>
        <p className="text-xs text-zinc-400 leading-relaxed">
          {current.content}
        </p>

        {current.insight && (
          <div className="bg-amber-900/20 border border-amber-800/30 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-3 h-3 text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-300">{current.insight}</p>
            </div>
          </div>
        )}

        {current.tryIt && (
          <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Zap className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-300">{current.tryIt}</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="text-xs"
        >
          <ChevronLeft className="w-3 h-3 mr-1" />
          Previous
        </Button>
        <div className="flex gap-1">
          {tutorial.steps.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full ${
                i === step ? "bg-orange-400" : "bg-zinc-700"
              }`}
            />
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setStep(Math.min(total - 1, step + 1))}
          disabled={step === total - 1}
          className="text-xs"
        >
          Next
          <ChevronRight className="w-3 h-3 ml-1" />
        </Button>
      </div>
    </Card>
  );
}
