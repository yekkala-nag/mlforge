import { describe, it, expect } from "vitest";
import { from_scratch_algorithms } from "@/lib/from-scratch";

describe("From Scratch Algorithms Registry", () => {
  it("contains all core algorithmic implementations", () => {
    const keys = Object.keys(from_scratch_algorithms);
    expect(keys).toContain("linear-regression");
    expect(keys).toContain("logistic-regression");
    expect(keys).toContain("knn");
    expect(keys).toContain("decision-tree");
    expect(keys).toContain("naive-bayes");
    expect(keys).toContain("gradient-boosting");
  });

  it("each algorithm has valid metadata, concepts, and Python code", () => {
    for (const [, algo] of Object.entries(from_scratch_algorithms)) {
      expect(algo.name).toBeDefined();
      expect(algo.concepts.length).toBeGreaterThan(0);
      expect(algo.scratch_code.length).toBeGreaterThan(50);
      expect(algo.scratch_code).toContain("import numpy");
    }
  });
});
