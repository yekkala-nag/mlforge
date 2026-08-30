export type PyodideStatus = "idle" | "loading" | "ready" | "error";

export interface PyodideManagerState {
  status: PyodideStatus;
  progress: number;
  error: string | null;
  message?: string;
}

type StatusCallback = (state: PyodideManagerState) => void;

let pyodideWorker: Worker | null = null;
let requestId = 0;
const pendingRequests = new Map<
  number,
  { resolve: (value: unknown) => void; reject: (reason: unknown) => void }
>();
const statusListeners = new Set<StatusCallback>();

function notifyStatus(state: PyodideManagerState) {
  statusListeners.forEach((cb) => cb(state));
}

export function onPyodideStatus(callback: StatusCallback) {
  statusListeners.add(callback);
  return () => statusListeners.delete(callback);
}

export async function initPyodide(): Promise<void> {
  if (pyodideWorker) return;

  notifyStatus({ status: "loading", progress: 0, error: null });

  pyodideWorker = new Worker(
    new URL("./pyodide-worker.js", import.meta.url),
    { type: "module" }
  );

  pyodideWorker.onmessage = (e: MessageEvent) => {
    const { type, id, result, error, progress, message } = e.data;

    if (type === "status") {
      notifyStatus({
        status: progress >= 1 ? "ready" : "loading",
        progress,
        error: null,
        message,
      });
      return;
    }

    if (type === "ready") {
      notifyStatus({ status: "ready", progress: 1, error: null });
      return;
    }

    if (type === "error") {
      notifyStatus({ status: "error", progress: 0, error });
      // Also reject any pending request with this id
      const pending = pendingRequests.get(id);
      if (pending) {
        pending.reject(new Error(error));
        pendingRequests.delete(id);
      }
      return;
    }

    const pending = pendingRequests.get(id);
    if (pending) {
      pending.resolve(result);
      pendingRequests.delete(id);
    }
  };

  pyodideWorker.onerror = (err) => {
    notifyStatus({ status: "error", progress: 0, error: err.message });
  };

  return new Promise((resolve, reject) => {
    let settled = false;

    const onMessage = (e: MessageEvent) => {
      if (settled) return;
      if (e.data.type === "ready") {
        settled = true;
        pyodideWorker?.removeEventListener("message", onMessage);
        resolve();
      }
      if (e.data.type === "error") {
        settled = true;
        pyodideWorker?.removeEventListener("message", onMessage);
        reject(new Error(e.data.error || "Pyodide failed to initialize"));
      }
    };

    pyodideWorker!.addEventListener("message", onMessage);
    pyodideWorker!.postMessage({ type: "init" });

    setTimeout(() => {
      if (!settled) {
        settled = true;
        pyodideWorker?.removeEventListener("message", onMessage);
        reject(new Error("Pyodide initialization timeout (60s). Check your internet connection."));
      }
    }, 60000);
  });
}

export async function runPython<T = unknown>(
  code: string,
  data?: Record<string, unknown>
): Promise<T> {
  if (!pyodideWorker) {
    throw new Error("Pyodide not initialized. Call initPyodide() first.");
  }

  const id = ++requestId;

  return new Promise<T>((resolve, reject) => {
    pendingRequests.set(id, {
      resolve: resolve as (value: unknown) => void,
      reject,
    });

    pyodideWorker!.postMessage({ type: "run", id, code, data });
  });
}

export async function loadPackages(packages: string[]): Promise<void> {
  if (!pyodideWorker) {
    throw new Error("Pyodide not initialized");
  }

  const id = ++requestId;

  return new Promise((resolve, reject) => {
    pendingRequests.set(id, {
      resolve: () => resolve(),
      reject,
    });

    pyodideWorker!.postMessage({ type: "loadPackages", id, packages });
  });
}

export function terminatePyodide(): void {
  if (pyodideWorker) {
    pyodideWorker.terminate();
    pyodideWorker = null;
  }
  pendingRequests.clear();
}
