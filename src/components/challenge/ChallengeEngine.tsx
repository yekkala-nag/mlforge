"use client";

import { useState, useCallback } from "react";
import { usePyodide } from "@/hooks/usePyodide";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Trophy,
  Target,
  CheckCircle,
} from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard" | "expert";
  constraints: string[];
  dataset: string;
  starterCode: string;
  solutionCode: string;
  hints: string[];
  scoringCriteria: { metric: string; target: number; weight: number }[];
  timeLimit: number; // seconds
}

const challenges: Challenge[] = [
  {
    id: "ch1",
    title: "Classify the Iris",
    description:
      "Build a classifier that achieves >95% accuracy on the Iris dataset. Use any algorithm.",
    difficulty: "easy",
    constraints: ["Accuracy > 95%", "Inference < 10ms"],
    dataset: "iris",
    starterCode: `import numpy as np, json
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

iris = load_iris()
X_train, X_test, y_train, y_test = train_test_split(
    iris.data, iris.target, test_size=0.2, random_state=42
)

# TODO: Build your classifier here
# model = ...

# model.fit(X_train, y_train)
# preds = model.predict(X_test)
# acc = accuracy_score(y_test, preds)

json.dumps({"accuracy": 0.0, "completed": False})`,
    solutionCode: `import numpy as np, json
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

iris = load_iris()
X_train, X_test, y_train, y_test = train_test_split(
    iris.data, iris.target, test_size=0.2, random_state=42
)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)
preds = model.predict(X_test)
acc = accuracy_score(y_test, preds)

json.dumps({"accuracy": float(acc), "completed": bool(acc > 0.95)})`,
    hints: [
      "Try Random Forest — it's robust and requires little tuning.",
      "Make sure to split your data into train/test sets.",
      "accuracy_score from sklearn.metrics gives you the metric.",
    ],
    scoringCriteria: [
      { metric: "accuracy", target: 0.95, weight: 1.0 },
    ],
    timeLimit: 300,
  },
  {
    id: "ch2",
    title: "Imbalanced Fraud Detection",
    description:
      "You have 10,000 transactions with only 120 fraud cases. Build the best classifier. Accuracy is NOT the right metric.",
    difficulty: "hard",
    constraints: [
      "Recall > 80%",
      "Precision > 70%",
      "No accuracy as primary metric",
    ],
    dataset: "synthetic_fraud",
    starterCode: `import numpy as np, json
from sklearn.model_selection import train_test_split
from sklearn.metrics import precision_score, recall_score

np.random.seed(42)
n = 10000
X = np.random.randn(n, 5)
fraud = np.random.choice(n, 120, replace=False)
y = np.zeros(n)
y[fraud] = 1

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# TODO: Handle class imbalance and build a classifier
# Consider: class_weight='balanced', SMOTE, threshold tuning

json.dumps({"precision": 0.0, "recall": 0.0, "completed": False})`,
    solutionCode: `import numpy as np, json
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import precision_score, recall_score

np.random.seed(42)
n = 10000
X = np.random.randn(n, 5)
fraud = np.random.choice(n, 120, replace=False)
y = np.zeros(n)
y[fraud] = 1

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

model = RandomForestClassifier(n_estimators=200, class_weight='balanced', random_state=42)
model.fit(X_train, y_train)

# Tune threshold
probs = model.predict_proba(X_test)[:, 1]
threshold = 0.3
preds = (probs >= threshold).astype(int)

prec = precision_score(y_test, preds)
rec = recall_score(y_test, preds)

json.dumps({"precision": float(prec), "recall": float(rec), "completed": bool(prec > 0.7 and rec > 0.8)})`,
    hints: [
      "Don't use accuracy — it's misleading with 98.8% negatives.",
      "class_weight='balanced' tells the model to care about the minority class.",
      "Lower the decision threshold below 0.5 to catch more fraud.",
      "Try RandomForest with class_weight='balanced' and threshold=0.3.",
    ],
    scoringCriteria: [
      { metric: "recall", target: 0.8, weight: 0.6 },
      { metric: "precision", target: 0.7, weight: 0.4 },
    ],
    timeLimit: 600,
  },
  {
    id: "ch3",
    title: "Latency-Critical Predictor",
    description:
      "Build a model with <5ms inference latency and >90% accuracy. Speed matters as much as accuracy.",
    difficulty: "medium",
    constraints: ["Accuracy > 90%", "Latency < 5ms per prediction"],
    dataset: "wine",
    starterCode: `import numpy as np, json, time
from sklearn.datasets import load_wine
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

wine = load_wine()
X_train, X_test, y_train, y_test = train_test_split(
    wine.data, wine.target, test_size=0.2, random_state=42
)

# TODO: Build a FAST classifier
# Think about: Logistic Regression, Naive Bayes, small Decision Trees
# Avoid: SVM, large Random Forests, Neural Networks

# Time your predictions
# t0 = time.time()
# preds = model.predict(X_test)
# latency_ms = (time.time() - t0) / len(X_test) * 1000

json.dumps({"accuracy": 0.0, "latency_ms": 0.0, "completed": False})`,
    solutionCode: `import numpy as np, json, time
from sklearn.datasets import load_wine
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

wine = load_wine()
X_train, X_test, y_train, y_test = train_test_split(
    wine.data, wine.target, test_size=0.2, random_state=42
)

model = LogisticRegression(max_iter=200, random_state=42)
model.fit(X_train, y_train)

t0 = time.time()
preds = model.predict(X_test)
latency_ms = (time.time() - t0) / len(X_test) * 1000
acc = accuracy_score(y_test, preds)

json.dumps({"accuracy": float(acc), "latency_ms": float(latency_ms), "completed": bool(acc > 0.9 and latency_ms < 5)})`,
    hints: [
      "Logistic Regression is fast at inference time.",
      "Decision Trees with max_depth=3 are also very fast.",
      "Avoid SVM — kernel evaluation is slow.",
      "Measure latency per-prediction, not total batch time.",
    ],
    scoringCriteria: [
      { metric: "accuracy", target: 0.9, weight: 0.5 },
      { metric: "latency_ms", target: 5.0, weight: 0.5 },
    ],
    timeLimit: 300,
  },
  {
    id: "ch4",
    title: "Feature Engineer or Die",
    description:
      "Raw features give you 65% accuracy. Engineer features to push above 85%. The algorithm matters less than the features.",
    difficulty: "expert",
    constraints: [
      "Must use raw features only (no pre-computed)",
      "Accuracy > 85%",
      "Explain your feature engineering decisions",
    ],
    dataset: "synthetic_hard",
    starterCode: `import numpy as np, json
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import accuracy_score

np.random.seed(42)
n = 500
# Raw features with hidden patterns
x1 = np.random.uniform(0, 10, n)
x2 = np.random.uniform(0, 10, n)
x3 = np.random.randn(n) * 2
x4 = np.random.choice([0, 1, 2], n)

# Hidden: target depends on x1*x2 interaction and x3^2
noise = np.random.randn(n) * 0.5
y = ((x1 * x2 > 25) & (x3**2 < 4) & (x4 != 1)).astype(int)
y = (y + (np.random.rand(n) > 0.9).astype(int)) % 2

X = np.column_stack([x1, x2, x3, x4])
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# TODO: Engineer features from x1, x2, x3, x4
# The target has hidden interactions — find them!

json.dumps({"accuracy": 0.0, "completed": False})`,
    solutionCode: `import numpy as np, json
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import accuracy_score

np.random.seed(42)
n = 500
x1 = np.random.uniform(0, 10, n)
x2 = np.random.uniform(0, 10, n)
x3 = np.random.randn(n) * 2
x4 = np.random.choice([0, 1, 2], n)

y = ((x1 * x2 > 25) & (x3**2 < 4) & (x4 != 1)).astype(int)
y = (y + (np.random.rand(n) > 0.9).astype(int)) % 2

X = np.column_stack([x1, x2, x3, x4])
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Feature engineering
def engineer(X):
    x1, x2, x3, x4 = X[:, 0], X[:, 1], X[:, 2], X[:, 3]
    return np.column_stack([
        x1, x2, x3, x4,
        x1 * x2,       # interaction
        x3 ** 2,        # polynomial
        (x1 * x2 > 25).astype(float),  # threshold
        (x3 ** 2 < 4).astype(float),   # threshold
        (x4 != 1).astype(float),       # categorical
    ])

X_train_e = engineer(X_train)
X_test_e = engineer(X_test)

model = GradientBoostingClassifier(n_estimators=100, random_state=42)
model.fit(X_train_e, y_train)
preds = model.predict(X_test_e)
acc = accuracy_score(y_test, preds)

json.dumps({"accuracy": float(acc), "completed": bool(acc > 0.85)})`,
    hints: [
      "Look at pairs of features — are there interactions?",
      "Try multiplying x1 * x2.",
      "x3^2 might be a useful feature.",
      "The target has a hidden rule: x1*x2 > 25 AND x3^2 < 4 AND x4 != 1.",
    ],
    scoringCriteria: [
      { metric: "accuracy", target: 0.85, weight: 1.0 },
    ],
    timeLimit: 900,
  },
];

const difficultyColors: Record<string, string> = {
  easy: "bg-emerald-900/50 text-emerald-400",
  medium: "bg-blue-900/50 text-blue-400",
  hard: "bg-orange-900/50 text-orange-400",
  expert: "bg-red-900/50 text-red-400",
};

interface ChallengeResult {
  completed?: boolean;
  accuracy?: number;
  f1_score?: number;
  latency_ms?: number;
  error?: string;
  [key: string]: unknown;
}

export function ChallengeEngine() {
  const { isReady, run } = usePyodide();
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [code, setCode] = useState("");
  const [result, setResult] = useState<ChallengeResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const selectChallenge = useCallback((ch: Challenge) => {
    setSelectedChallenge(ch);
    setCode(ch.starterCode);
    setResult(null);
    setHintsUsed(0);
    setShowSolution(false);
  }, []);

  const runCode = useCallback(async () => {
    if (!isReady || !selectedChallenge) return;
    setIsRunning(true);
    try {
      const data = await run<ChallengeResult>(code);
      setResult(data);
      if (data?.completed) {
        setCompleted((prev) => new Set([...prev, selectedChallenge.id]));
      }
    } catch (err) {
      setResult({ error: err instanceof Error ? err.message : "Execution failed" });
    } finally {
      setIsRunning(false);
    }
  }, [isReady, selectedChallenge, code, run]);

  const score = selectedChallenge
    ? selectedChallenge.scoringCriteria.reduce((sum, c) => {
        const rawVal = result?.[c.metric];
        const val = typeof rawVal === "number" ? rawVal : 0;
        const normalized = c.metric === "latency_ms"
          ? Math.max(0, 1 - val / c.target)
          : Math.min(1, val / c.target);
        return sum + normalized * c.weight;
      }, 0) / selectedChallenge.scoringCriteria.reduce((s, c) => s + c.weight, 0)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-400" />
          Challenge Engine
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Solve real ML problems under constraints. No tutorials — just a
          problem, constraints, and a code editor.
        </p>
      </div>

      {!selectedChallenge ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {challenges.map((ch) => (
            <Card
              key={ch.id}
              className="p-5 bg-zinc-900 border-zinc-800 hover:border-orange-500/30 cursor-pointer transition-all"
              onClick={() => selectChallenge(ch)}
            >
              <div className="flex items-start justify-between mb-3">
                <Badge className={`text-xs ${difficultyColors[ch.difficulty]}`}>
                  {ch.difficulty}
                </Badge>
                {completed.has(ch.id) && (
                  <Badge className="bg-emerald-600 text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Solved
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold text-zinc-200 mb-1">{ch.title}</h3>
              <p className="text-xs text-zinc-500 mb-3">{ch.description}</p>
              <div className="flex flex-wrap gap-1">
                {ch.constraints.map((c) => (
                  <Badge
                    key={c}
                    variant="secondary"
                    className="bg-zinc-800 text-zinc-500 text-xs"
                  >
                    {c}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <Button
            variant="ghost"
            onClick={() => setSelectedChallenge(null)}
            className="text-zinc-400"
          >
            ← Back to challenges
          </Button>

          <Card className="bg-zinc-900 border-zinc-800 p-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-zinc-200">
                {selectedChallenge.title}
              </h2>
              <Badge
                className={`text-xs ${difficultyColors[selectedChallenge.difficulty]}`}
              >
                {selectedChallenge.difficulty}
              </Badge>
            </div>
            <p className="text-sm text-zinc-400 mb-3">
              {selectedChallenge.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedChallenge.constraints.map((c) => (
                <Badge
                  key={c}
                  variant="secondary"
                  className="bg-zinc-800 text-zinc-400 text-xs"
                >
                  <Target className="w-3 h-3 mr-1" />
                  {c}
                </Badge>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Editor */}
            <div className="lg:col-span-2">
              <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
                <div className="px-4 py-2 border-b border-zinc-800 flex items-center justify-between">
                  <span className="text-xs text-zinc-500">Python Editor</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={runCode}
                      disabled={!isReady || isRunning}
                      className="h-7 text-xs bg-orange-600 hover:bg-orange-700"
                    >
                      {isRunning ? "Running..." : "Run"}
                    </Button>
                  </div>
                </div>
                <div className="h-[400px] bg-zinc-950">
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-full bg-transparent text-zinc-300 font-mono text-sm p-4 resize-none focus:outline-none"
                    spellCheck={false}
                  />
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Score */}
              {result && !result.error && (
                <Card className="bg-zinc-900 border-zinc-800 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-semibold text-zinc-200">
                      Score
                    </h3>
                  </div>
                  <div className="text-3xl font-bold text-center mb-2">
                    <span
                      className={
                        score >= 0.9
                          ? "text-emerald-400"
                          : score >= 0.7
                            ? "text-amber-400"
                            : "text-red-400"
                      }
                    >
                      {(score * 100).toFixed(0)}%
                    </span>
                  </div>
                  {result.completed && (
                    <Badge className="bg-emerald-600 w-full justify-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Challenge Complete!
                    </Badge>
                  )}
                </Card>
              )}

              {/* Hints */}
              <Card className="bg-zinc-900 border-zinc-800 p-4">
                <h3 className="text-sm font-semibold text-zinc-200 mb-3">
                  Hints ({hintsUsed}/{selectedChallenge.hints.length})
                </h3>
                <div className="space-y-2">
                  {selectedChallenge.hints
                    .slice(0, hintsUsed)
                    .map((hint, i) => (
                      <div
                        key={i}
                        className="bg-zinc-800 rounded-lg p-2 text-xs text-zinc-400"
                      >
                        <span className="text-amber-400 font-mono mr-1">
                          {i + 1}.
                        </span>
                        {hint}
                      </div>
                    ))}
                  {hintsUsed < selectedChallenge.hints.length && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setHintsUsed((h) => h + 1)}
                      className="w-full text-xs border-zinc-700"
                    >
                      Show Hint {hintsUsed + 1}
                    </Button>
                  )}
                </div>
              </Card>

              {/* Solution */}
              <Card className="bg-zinc-900 border-zinc-800 p-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSolution(!showSolution)}
                  className="w-full text-xs text-zinc-500"
                >
                  {showSolution ? "Hide" : "Show"} Solution
                </Button>
                {showSolution && (
                  <pre className="mt-2 text-xs text-zinc-400 bg-zinc-800 rounded-lg p-3 overflow-x-auto max-h-48 overflow-y-auto">
                    {selectedChallenge.solutionCode}
                  </pre>
                )}
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
