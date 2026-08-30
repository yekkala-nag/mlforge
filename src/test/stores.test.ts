import { describe, it, expect, beforeEach } from "vitest";
import { usePlaygroundStore } from "@/stores/playground-store";
import { useProgressStore } from "@/stores/progress-store";
import { useSettingsStore, providerPresets } from "@/stores/settings-store";

describe("Zustand Stores", () => {
  describe("Playground Store", () => {
    beforeEach(() => {
      usePlaygroundStore.setState({
        activeSimulation: null,
        params: {},
        result: null,
        isRunning: false,
      });
    });

    it("sets active simulation and default parameters", () => {
      const dummySim = {
        id: "linear-regression",
        name: "Linear Regression",
        description: "Test",
        icon: "TrendingUp",
        parameters: [],
        pythonCode: "print(1)",
        defaultParams: { learning_rate: 0.01, iterations: 100 },
      };

      usePlaygroundStore.getState().setActiveSimulation(dummySim);

      const state = usePlaygroundStore.getState();
      expect(state.activeSimulation?.id).toBe("linear-regression");
      expect(state.params.learning_rate).toBe(0.01);
      expect(state.params.iterations).toBe(100);
    });

    it("updates individual parameters and resets", () => {
      const dummySim = {
        id: "knn",
        name: "KNN",
        description: "Test",
        icon: "Target",
        parameters: [],
        pythonCode: "print(1)",
        defaultParams: { k: 3 },
      };

      const store = usePlaygroundStore.getState();
      store.setActiveSimulation(dummySim);
      store.setParam("k", 7);

      expect(usePlaygroundStore.getState().params.k).toBe(7);

      usePlaygroundStore.getState().resetParams();
      expect(usePlaygroundStore.getState().params.k).toBe(3);
    });
  });

  describe("Progress Store", () => {
    beforeEach(() => {
      useProgressStore.getState().resetProgress();
    });

    it("completes modules and tracks score", () => {
      const store = useProgressStore.getState();
      store.completeModule("playground", "linear-regression", 85);

      const progress = useProgressStore.getState().progress;
      expect(progress.worlds.playground.completedModules).toContain("linear-regression");
      expect(progress.totalScore).toBe(85);
    });

    it("exports progress data as JSON string", () => {
      const store = useProgressStore.getState();
      const exported = store.exportData();
      expect(typeof exported).toBe("string");
      const parsed = JSON.parse(exported);
      expect(parsed.totalScore).toBeDefined();
    });
  });

  describe("Settings Store", () => {
    it("selects provider and updates defaults", () => {
      const store = useSettingsStore.getState();
      store.setProviderId("anthropic");

      const state = useSettingsStore.getState();
      expect(state.providerId).toBe("anthropic");
      expect(state.apiFormat).toBe("anthropic");
      expect(state.model).toBe(providerPresets.find((p) => p.id === "anthropic")?.models[0]);
    });

    it("sets custom API key", () => {
      const store = useSettingsStore.getState();
      store.setApiKey("test-key-123");
      expect(useSettingsStore.getState().apiKey).toBe("test-key-123");
    });
  });
});
