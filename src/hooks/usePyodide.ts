"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  initPyodide,
  runPython,
  loadPackages,
  onPyodideStatus,
  type PyodideManagerState,
} from "@/lib/pyodide/manager";

export interface UsePyodideReturn {
  status: PyodideManagerState["status"];
  progress: number;
  error: string | null;
  message?: string;
  run: <T = unknown>(
    code: string,
    data?: Record<string, unknown>
  ) => Promise<T>;
  loadPkgs: (packages: string[]) => Promise<void>;
  isReady: boolean;
}

export function usePyodide(requiredPackages: string[] = []): UsePyodideReturn {
  const [state, setState] = useState<PyodideManagerState>({
    status: "idle",
    progress: 0,
    error: null,
    message: undefined,
  });
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    initPyodide().catch((err) => {
      setState((s) => ({
        ...s,
        status: "error",
        error: err.message,
      }));
    });

    const unsub = onPyodideStatus(setState);
    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    if (state.status === "ready" && requiredPackages.length > 0) {
      loadPackages(requiredPackages);
    }
    // Only run when status becomes ready
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status]);

  const run = useCallback(
    async <T = unknown>(
      code: string,
      data?: Record<string, unknown>
    ): Promise<T> => {
      return runPython<T>(code, data);
    },
    []
  );

  const loadPkgs = useCallback(async (packages: string[]) => {
    await loadPackages(packages);
  }, []);

  return {
    status: state.status,
    progress: state.progress,
    error: state.error,
    message: state.message,
    run,
    loadPkgs,
    isReady: state.status === "ready",
  };
}
