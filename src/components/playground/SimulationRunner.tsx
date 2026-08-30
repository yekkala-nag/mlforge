"use client";

import { usePlaygroundStore } from "@/stores/playground-store";
import { useSimulationRunner } from "@/hooks/useSimulationRunner";
import { usePyodide } from "@/hooks/usePyodide";
import { ScatterPlot } from "./ScatterPlot";
import { LossChart } from "./LossChart";
import { MetricsDisplay } from "./MetricsDisplay";
import { ParameterControls } from "./ParameterControls";
import { TrainingAnimator } from "./TrainingAnimator";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Play, RotateCcw, Zap, AlertTriangle } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const breakTypes = [
  { id: "noise", label: "Add Noise", description: "Inject random label noise" },
  { id: "missing", label: "Missing Values", description: "Remove 30% of data" },
  { id: "imbalance", label: "Class Imbalance", description: "Make classes 95/5 split" },
  { id: "outliers", label: "Add Outliers", description: "Insert extreme values" },
  { id: "shift", label: "Distribution Shift", description: "Move test distribution" },
];

export function SimulationRunner() {
  const {
    activeSimulation,
    params,
    setParam,
    result,
    setResult,
    isRunning,
    resetParams,
  } = usePlaygroundStore();
  const { runSimulation, isReady } = useSimulationRunner();
  const { run } = usePyodide();
  const [isAnimating, setIsAnimating] = useState(false);
  const [breakMode, setBreakMode] = useState(false);
  const [breakType, setBreakType] = useState<string | null>(null);
  const [breakSeed, setBreakSeed] = useState(242);
  const [showAnimator, setShowAnimator] = useState(false);

  const animateTraining = useCallback(async () => {
    if (!activeSimulation || !isReady) return;

    // Run simulation with max iterations to get snapshots
    const animParams = { ...params };
    const itersParam = activeSimulation.parameters.find(
      (p) => p.id === "iterations" || p.id === "max_iter"
    );
    if (itersParam) {
      animParams[itersParam.id] = itersParam.max ?? 100;
    }

    setIsAnimating(true);
    setShowAnimator(true);

    try {
      const data = await run<any>(activeSimulation.pythonCode, {
        params_json: animParams,
      });
      setResult(data);
    } catch (err) {
      console.error("Animation error:", err);
    } finally {
      setIsAnimating(false);
    }
  }, [activeSimulation, isReady, params, run, setResult]);

  useEffect(() => {
    if (isReady && activeSimulation && Object.keys(params).length > 0) {
      runSimulation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, isReady, activeSimulation]);

  const injectBreak = (type: string) => {
    setBreakType(type);
    setBreakMode(true);
    const breakParams = { ...params };
    switch (type) {
      case "noise":
        breakParams.noise = Math.min(3, (Number(params.noise) || 0.5) + 2);
        break;
      case "imbalance":
        breakParams.n_samples = 200;
        break;
      case "outliers":
        breakParams.noise = Math.min(3, (Number(params.noise) || 0.5) + 1.5);
        break;
      case "shift":
        setBreakSeed((s) => s + 1);
        breakParams.seed = breakSeed + 1;
        break;
    }
    Object.entries(breakParams).forEach(([k, v]) => setParam(k, v));
  };

  const resetBreak = () => {
    setBreakMode(false);
    setBreakType(null);
    resetParams();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Left: Controls */}
      <div className="w-full lg:w-72 shrink-0 space-y-4">
        <Card className="bg-zinc-900 border-zinc-800 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-zinc-200">Parameters</h3>
            <Button variant="ghost" size="sm" onClick={resetBreak} className="h-7 text-xs">
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset
            </Button>
          </div>
          <ParameterControls
            parameters={activeSimulation?.parameters ?? []}
            values={params}
            onChange={setParam}
            disabled={!isReady}
          />
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 p-4 space-y-3">
          <Button
            onClick={() => runSimulation()}
            disabled={!isReady || isRunning}
            className="w-full"
            size="sm"
          >
            {isRunning ? (
              <Zap className="w-4 h-4 mr-2 animate-pulse" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            {isRunning ? "Running..." : "Run Simulation"}
          </Button>

          <Button
            onClick={animateTraining}
            disabled={!isReady || isAnimating}
            variant="outline"
            className="w-full"
            size="sm"
          >
            <Play className="w-4 h-4 mr-2" />
            {isAnimating ? "Animating..." : "Watch Training"}
          </Button>

          {showAnimator && (
            <Button
              onClick={() => setShowAnimator(false)}
              variant="ghost"
              className="w-full"
              size="sm"
            >
              Back to Normal View
            </Button>
          )}

          {!isReady && (
            <p className="text-xs text-zinc-500 text-center">
              Loading Pyodide runtime...
            </p>
          )}
        </Card>

        {/* Break the Model */}
        <Card className={`border ${breakMode ? "border-red-500/50 bg-red-950/20" : "border-zinc-800 bg-zinc-900"} p-4`}>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className={`w-4 h-4 ${breakMode ? "text-red-400" : "text-zinc-400"}`} />
            <h3 className="text-sm font-semibold text-zinc-200">Break the Model</h3>
          </div>
          {breakMode ? (
            <div className="space-y-2">
              <Badge variant="destructive" className="text-xs">
                Active: {breakTypes.find((b) => b.id === breakType)?.label}
              </Badge>
              <p className="text-xs text-zinc-400">
                Your model is under stress. Diagnose the issue by examining the metrics and visualization.
              </p>
              <Button onClick={resetBreak} variant="outline" size="sm" className="w-full">
                Fix & Reset
              </Button>
            </div>
          ) : (
            <div className="space-y-1">
              {breakTypes.map((bt) => (
                <button
                  key={bt.id}
                  onClick={() => injectBreak(bt.id)}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
                >
                  <span className="font-medium">{bt.label}</span>
                  <span className="block text-zinc-600">{bt.description}</span>
                </button>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Center: Visualization */}
      <div className="flex-1 space-y-4 min-w-0">
        {showAnimator && (result as any)?.snapshots ? (
          <TrainingAnimator
            points={(result as any).points ?? []}
            snapshots={(result as any).snapshots}
            lossHistory={(result as any).lossHistory ?? []}
            metrics={(result as any).metrics ?? {}}
            isRegression={activeSimulation?.id === "linear-regression"}
          />
        ) : (
          <>
            <Card className="bg-zinc-900 border-zinc-800 p-4">
              {result ? (
                <ScatterPlot
                  points={(result as any).points ?? []}
                  line={(result as any).line}
                  centroids={(result as any).centroids}
                  supportVectors={(result as any).supportVectors}
                  decisionBoundary={(result as any).decisionBoundary}
                  showRegressionLine={activeSimulation?.id === "linear-regression"}
                  showDecisionBoundary={
                    activeSimulation?.id !== "linear-regression" &&
                    activeSimulation?.id !== "kmeans"
                  }
                />
              ) : (
                <div className="flex items-center justify-center h-[400px] text-zinc-600">
                  {isReady ? "Adjust parameters and run" : "Initializing Pyodide..."}
                </div>
              )}
            </Card>

            {result && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(result as any).lossHistory?.length > 0 && (
                  <Card className="bg-zinc-900 border-zinc-800 p-4">
                    <LossChart
                      data={(result as any).lossHistory}
                      width={350}
                      height={150}
                      label={
                        activeSimulation?.id === "kmeans" ? "Inertia" :
                        activeSimulation?.id === "svm" ? "SVM Loss" : "Loss"
                      }
                    />
                  </Card>
                )}
                <Card className="bg-zinc-900 border-zinc-800 p-4">
                  <MetricsDisplay metrics={(result as any).metrics ?? {}} />
                </Card>
              </div>
            )}
          </>
        )}
      </div>

      {/* Right: Intermediate */}
      {result && (result as any).intermediate && (
        <div className="w-full lg:w-64 shrink-0">
          <Card className="bg-zinc-900 border-zinc-800 p-4 space-y-3">
            <h3 className="text-sm font-semibold text-zinc-200">
              {activeSimulation?.id === "kmeans" ? "Centroids" : "Learned Parameters"}
            </h3>
            <Separator className="bg-zinc-800" />
            <div className="space-y-2 text-sm">
              {activeSimulation?.id === "linear-regression" && (
                <>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Weight (w)</span>
                    <span className="font-mono text-zinc-300">
                      {(result as any).intermediate?.weight?.toFixed(4)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Bias (b)</span>
                    <span className="font-mono text-zinc-300">
                      {(result as any).intermediate?.bias?.toFixed(4)}
                    </span>
                  </div>
                  <Separator className="bg-zinc-800" />
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Equation</span>
                    <span className="font-mono text-amber-400 text-xs">
                      y = {(result as any).intermediate?.weight?.toFixed(2)}x +{" "}
                      {(result as any).intermediate?.bias?.toFixed(2)}
                    </span>
                  </div>
                </>
              )}
              {activeSimulation?.id === "knn" && (
                <div className="flex justify-between">
                  <span className="text-zinc-500">K</span>
                  <span className="font-mono text-zinc-300">
                    {(result as any).intermediate?.k}
                  </span>
                </div>
              )}
              {activeSimulation?.id === "kmeans" &&
                (result as any).centroids?.map((c: any, i: number) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-zinc-500">Centroid {i + 1}</span>
                    <span className="font-mono text-zinc-300 text-xs">
                      ({c.x.toFixed(2)}, {c.y.toFixed(2)})
                    </span>
                  </div>
                ))}
              {activeSimulation?.id === "svm" && (
                <>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">C</span>
                    <span className="font-mono text-zinc-300">
                      {(result as any).intermediate?.C}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Kernel</span>
                    <span className="font-mono text-zinc-300">
                      {(result as any).intermediate?.kernel}
                    </span>
                  </div>
                </>
              )}
              {activeSimulation?.id === "logistic-regression" && (
                <>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Weights</span>
                    <span className="font-mono text-zinc-300 text-xs">
                      [{(result as any).intermediate?.weights?.map((w: number) => w.toFixed(2)).join(", ")}]
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Bias</span>
                    <span className="font-mono text-zinc-300">
                      {(result as any).intermediate?.bias?.toFixed(4)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
