import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WorldProgress {
  worldId: string;
  status: "not_started" | "in_progress" | "completed";
  score: number;
  timeSpent: number;
  completedModules: string[];
  startedAt?: number;
  completedAt?: number;
}

export interface ChallengeProgress {
  challengeId: string;
  completed: boolean;
  score: number;
  bestCode?: string;
  completedAt?: number;
  attempts: number;
}

export interface UserProgress {
  id: string;
  createdAt: number;
  totalScore: number;
  totalTimeSpent: number;
  worlds: Record<string, WorldProgress>;
  challenges: Record<string, ChallengeProgress>;
  settings: {
    apiProvider?: "openai" | "anthropic";
    apiKey?: string;
    model?: string;
    baseUrl?: string;
  };
}

const defaultProgress: UserProgress = {
  id: "",
  createdAt: Date.now(),
  totalScore: 0,
  totalTimeSpent: 0,
  worlds: {},
  challenges: {},
  settings: {},
};

interface ProgressStore {
  progress: UserProgress;
  isLoaded: boolean;

  // Core
  init: () => void;

  // World progress
  startWorld: (worldId: string) => void;
  completeModule: (worldId: string, moduleId: string, score: number) => void;
  completeWorld: (worldId: string) => void;

  // Challenge progress
  completeChallenge: (
    challengeId: string,
    score: number,
    code?: string
  ) => void;

  // Settings
  updateSettings: (settings: Partial<UserProgress["settings"]>) => void;

  // Data management
  exportData: () => string;
  importData: (json: string) => boolean;
  resetProgress: () => void;

  // Stats
  getWorldProgress: (worldId: string) => WorldProgress | undefined;
  getCompletedWorlds: () => string[];
  getTotalScore: () => number;
}

function generateId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      progress: { ...defaultProgress },
      isLoaded: false,

      init: () => {
        const state = get();
        if (!state.progress.id) {
          set({
            progress: { ...defaultProgress, id: generateId(), createdAt: Date.now() },
            isLoaded: true,
          });
        } else {
          set({ isLoaded: true });
        }
      },

      startWorld: (worldId) => {
        set((state) => ({
          progress: {
            ...state.progress,
            worlds: {
              ...state.progress.worlds,
              [worldId]: {
                worldId,
                status: "in_progress",
                score: 0,
                timeSpent: 0,
                completedModules: [],
                startedAt: Date.now(),
              },
            },
          },
        }));
      },

      completeModule: (worldId, moduleId, score) => {
        set((state) => {
          const world = state.progress.worlds[worldId] || {
            worldId,
            status: "in_progress" as const,
            score: 0,
            timeSpent: 0,
            completedModules: [],
          };

          if (world.completedModules.includes(moduleId)) return state;

          return {
            progress: {
              ...state.progress,
              totalScore: state.progress.totalScore + score,
              worlds: {
                ...state.progress.worlds,
                [worldId]: {
                  ...world,
                  score: world.score + score,
                  completedModules: [...world.completedModules, moduleId],
                },
              },
            },
          };
        });
      },

      completeWorld: (worldId) => {
        set((state) => ({
          progress: {
            ...state.progress,
            worlds: {
              ...state.progress.worlds,
              [worldId]: {
                ...state.progress.worlds[worldId],
                status: "completed",
                completedAt: Date.now(),
              },
            },
          },
        }));
      },

      completeChallenge: (challengeId, score, code) => {
        set((state) => {
          const existing = state.progress.challenges[challengeId];
          return {
            progress: {
              ...state.progress,
              totalScore: state.progress.totalScore + score,
              challenges: {
                ...state.progress.challenges,
                [challengeId]: {
                  challengeId,
                  completed: true,
                  score: Math.max(existing?.score || 0, score),
                  bestCode: code || existing?.bestCode,
                  completedAt: Date.now(),
                  attempts: (existing?.attempts || 0) + 1,
                },
              },
            },
          };
        });
      },

      updateSettings: (settings) => {
        set((state) => ({
          progress: {
            ...state.progress,
            settings: { ...state.progress.settings, ...settings },
          },
        }));
      },

      exportData: () => {
        return JSON.stringify(get().progress, null, 2);
      },

      importData: (json) => {
        try {
          const data = JSON.parse(json) as UserProgress;
          if (!data.id || !data.worlds) return false;
          set({ progress: data });
          return true;
        } catch {
          return false;
        }
      },

      resetProgress: () => {
        set({
          progress: { ...defaultProgress, id: generateId(), createdAt: Date.now() },
        });
      },

      getWorldProgress: (worldId) => get().progress.worlds[worldId],

      getCompletedWorlds: () =>
        Object.entries(get().progress.worlds)
          .filter(([, w]) => w.status === "completed")
          .map(([id]) => id),

      getTotalScore: () => get().progress.totalScore,
    }),
    {
      name: "ml-forge-progress",
    }
  )
);
