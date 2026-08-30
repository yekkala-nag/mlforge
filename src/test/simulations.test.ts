import { describe, it, expect } from "vitest";
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

describe("JS ML Simulation Algorithms", () => {
  it("runs Linear Regression and returns valid line, points, metrics", () => {
    const res = runLinearRegression({
      learning_rate: 0.05,
      iterations: 50,
      noise: 0.2,
      n_samples: 50,
    });

    expect(res.points.length).toBe(50);
    expect(res.line).toBeDefined();
    expect(res.line?.length).toBeGreaterThan(0);
    expect(res.lossHistory.length).toBe(50);
    expect(res.metrics.mse).toBeDefined();
    expect(res.metrics.r_squared).toBeDefined();
    expect(res.metrics.weight).toBeDefined();
    expect(res.metrics.bias).toBeDefined();
  });

  it("runs Logistic Regression and returns classification decision boundary", () => {
    const res = runLogisticRegression({
      learning_rate: 0.1,
      iterations: 50,
      noise: 0.3,
      n_samples: 60,
    });

    expect(res.points.length).toBe(60);
    expect(res.decisionBoundary).toBeDefined();
    expect(res.metrics.accuracy).toBeDefined();
    expect(res.metrics.accuracy).toBeGreaterThanOrEqual(0);
    expect(res.metrics.accuracy).toBeLessThanOrEqual(1);
    expect(res.lossHistory.length).toBe(50);
  });

  it("runs KNN and calculates accuracy", () => {
    const res = runKNN({
      k: 3,
      n_samples: 40,
    });

    expect(res.points.length).toBe(40);
    expect(res.metrics.accuracy).toBeDefined();
    expect(res.metrics.k).toBe(3);
  });

  it("runs Decision Tree and builds valid partitions", () => {
    const res = runDecisionTree({
      max_depth: 3,
      n_samples: 50,
    });

    expect(res.points.length).toBe(50);
    expect(res.metrics.accuracy).toBeDefined();
    expect(res.metrics.depth).toBe(3);
  });

  it("runs Random Forest ensemble", () => {
    const res = runRandomForest({
      n_trees: 5,
      max_depth: 3,
      n_samples: 40,
    });

    expect(res.points.length).toBe(40);
    expect(res.metrics.accuracy).toBeDefined();
  });

  it("runs K-Means clustering and returns centroids", () => {
    const res = runKMeans({
      k: 3,
      iterations: 20,
      n_samples: 60,
    });

    expect(res.points.length).toBe(60);
    expect(res.centroids).toBeDefined();
    expect(res.centroids?.length).toBe(3);
    expect(res.metrics.inertia).toBeDefined();
    expect(res.metrics.inertia).toBeGreaterThan(0);
  });

  it("runs SVM algorithm", () => {
    const res = runSVM({
      C: 1.0,
      kernel: 0,
      n_samples: 40,
    });

    expect(res.points.length).toBe(40);
    expect(res.metrics.accuracy).toBeDefined();
  });

  it("runs Naive Bayes classifier", () => {
    const res = runNaiveBayes({
      n_samples: 40,
    });

    expect(res.points.length).toBe(40);
    expect(res.metrics.accuracy).toBeDefined();
  });

  it("runs Gradient Boosting", () => {
    const res = runGradientBoosting({
      n_estimators: 5,
      learning_rate: 0.1,
      n_samples: 40,
    });

    expect(res.points.length).toBe(40);
    expect(res.metrics.accuracy).toBeDefined();
  });

  it("runs Neural Network simulation", () => {
    const res = runNeuralNetwork({
      hidden_units: 8,
      learning_rate: 0.05,
      iterations: 30,
      n_samples: 40,
    });

    expect(res.points.length).toBe(40);
    expect(res.metrics.accuracy).toBeDefined();
  });
});
