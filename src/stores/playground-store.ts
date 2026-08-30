import { create } from "zustand";
import type { Simulation, SimResult } from "@/lib/types/simulation";

interface PlaygroundState {
  activeSimulation: Simulation | null;
  params: Record<string, number | string | boolean>;
  result: SimResult | null;
  isRunning: boolean;
  isTraining: boolean;
  trainingStep: number;
  autoTrain: boolean;
  datasetSeed: number;

  setActiveSimulation: (sim: Simulation) => void;
  setParam: (key: string, value: number | string | boolean) => void;
  setAllParams: (params: Record<string, number | string | boolean>) => void;
  setResult: (result: SimResult | null) => void;
  setIsRunning: (running: boolean) => void;
  setIsTraining: (training: boolean) => void;
  setTrainingStep: (step: number) => void;
  setAutoTrain: (auto: boolean) => void;
  setDatasetSeed: (seed: number) => void;
  resetParams: () => void;
}

export const usePlaygroundStore = create<PlaygroundState>((set, get) => ({
  activeSimulation: null,
  params: {},
  result: null,
  isRunning: false,
  isTraining: false,
  trainingStep: 0,
  autoTrain: true,
  datasetSeed: 42,

  setActiveSimulation: (sim) =>
    set({
      activeSimulation: sim,
      params: { ...sim.defaultParams },
      result: null,
      isTraining: false,
      trainingStep: 0,
    }),

  setParam: (key, value) =>
    set((state) => ({
      params: { ...state.params, [key]: value },
    })),

  setAllParams: (params) => set({ params }),

  setResult: (result) => set({ result }),

  setIsRunning: (running) => set({ isRunning: running }),

  setIsTraining: (training) => set({ isTraining: training }),

  setTrainingStep: (step) => set({ trainingStep: step }),

  setAutoTrain: (auto) => set({ autoTrain: auto }),

  setDatasetSeed: (seed) => set({ datasetSeed: seed }),

  resetParams: () => {
    const sim = get().activeSimulation;
    if (sim) {
      set({ params: { ...sim.defaultParams } });
    }
  },
}));
