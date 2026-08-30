"use client";

import { useCallback, useRef } from "react";
import { usePyodide } from "@/hooks/usePyodide";
import { usePlaygroundStore } from "@/stores/playground-store";
import type { Simulation } from "@/lib/types/simulation";
import type { SimulationResult } from "@/lib/simulations/js-simulations";
import {
  runLinearRegression,
  runLogisticRegression,
  runKNN,
  runDecisionTree,
  runRandomForest,
  runKMeans,
  runSVM,
  runNaiveBayes,
  runGradientBoosting,
  runNeuralNetwork,
} from "@/lib/simulations/js-simulations";

const jsRunners: Record<string, (params: Record<string, number>) => SimulationResult> = {
  "linear-regression": runLinearRegression,
  "logistic-regression": runLogisticRegression,
  knn: runKNN,
  "decision-tree": runDecisionTree,
  "random-forest": runRandomForest,
  kmeans: runKMeans,
  svm: runSVM,
  "naive-bayes": runNaiveBayes,
  "gradient-boosting": runGradientBoosting,
  "neural-network": runNeuralNetwork,
};

export function useSimulationRunner() {
  const { isReady, run } = usePyodide();
  const { params, setResult, setIsRunning, activeSimulation } =
    usePlaygroundStore();
  const abortRef = useRef(false);

  const runSimulation = useCallback(
    async (sim?: Simulation, overrideParams?: Record<string, number | string | boolean>) => {
      const simulation = sim ?? activeSimulation;
      if (!simulation) return;

      setIsRunning(true);
      abortRef.current = false;

      try {
        const currentParams = overrideParams ?? params;

        // Try JS implementation first (instant), fall back to Pyodide
        const jsRunner = jsRunners[simulation.id];
        if (jsRunner) {
          // Convert params to numbers
          const numParams: Record<string, number> = {};
          for (const [k, v] of Object.entries(currentParams)) {
            numParams[k] = typeof v === "number" ? v : parseFloat(String(v)) || 0;
          }
          const data = jsRunner(numParams);
          if (!abortRef.current) {
            setResult(data);
          }
          return;
        }

        // Fall back to Pyodide for Python-only simulations
        if (isReady) {
          const data = await run<Record<string, unknown>>(
            simulation.pythonCode,
            { params_json: currentParams, dataset_json: null }
          );
          if (!abortRef.current && data) {
            setResult(data as unknown as SimulationResult);
          }
        }
      } catch (err) {
        console.error("Simulation error:", err);
      } finally {
        if (!abortRef.current) {
          setIsRunning(false);
        }
      }
    },
    [isReady, activeSimulation, params, run, setResult, setIsRunning]
  );

  return { runSimulation, isReady: true }; // Always "ready" since JS runs instantly
}
