let pyodide = null;
let loadedPackages = new Set();

self.onmessage = async (e) => {
  const { type, id, code, data, packages } = e.data;

  try {
    if (type === "init") {
      self.postMessage({ type: "status", progress: 0.1, message: "Loading Pyodide..." });

      let loadPyodide;
      try {
        const module = await import(
          "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.mjs"
        );
        loadPyodide = module.loadPyodide;
      } catch (importErr) {
        // Fallback: try older version
        self.postMessage({ type: "status", progress: 0.15, message: "Trying fallback CDN..." });
        try {
          const module = await import(
            "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.mjs"
          );
          loadPyodide = module.loadPyodide;
        } catch (fallbackErr) {
          throw new Error("Failed to load Pyodide from CDN. Check your internet connection.");
        }
      }

      self.postMessage({ type: "status", progress: 0.2, message: "Initializing Pyodide..." });

      try {
        pyodide = await loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",
        });
      } catch (loadErr) {
        // Try fallback version
        self.postMessage({ type: "status", progress: 0.25, message: "Trying fallback version..." });
        pyodide = await loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/",
        });
      }

      self.postMessage({ type: "status", progress: 0.5, message: "Loading NumPy..." });

      await pyodide.loadPackage(["numpy"]);
      loadedPackages.add("numpy");

      self.postMessage({ type: "status", progress: 1, message: "Ready!" });
      self.postMessage({ type: "ready" });
      return;
    }

    if (type === "loadPackages") {
      const newPkgs = packages.filter((p) => !loadedPackages.has(p));
      if (newPkgs.length > 0) {
        self.postMessage({ type: "status", progress: 0.5, message: `Loading ${newPkgs.join(", ")}...` });
        await pyodide.loadPackage(newPkgs);
        newPkgs.forEach((p) => loadedPackages.add(p));
        self.postMessage({ type: "status", progress: 1, message: "Ready!" });
      }
      self.postMessage({ type: "result", id, result: true });
      return;
    }

    if (type === "run") {
      if (data) {
        for (const [key, value] of Object.entries(data)) {
          pyodide.globals.set(key, JSON.stringify(value));
        }

        const dataSetup = Object.keys(data)
          .map((key) => `import json; ${key} = json.loads(${key})`)
          .join("\n");
        await pyodide.runPythonAsync(dataSetup);
      }

      const result = await pyodide.runPythonAsync(code);
      const serialized =
        result !== undefined && result !== null
          ? pyodide.runPython(`import json; json.dumps(${result === true ? "True" : result === false ? "False" : result})`)
          : null;
      self.postMessage({
        type: "result",
        id,
        result: serialized ? JSON.parse(serialized) : null,
      });
    }
  } catch (err) {
    self.postMessage({
      type: "error",
      id,
      error: err.message || String(err),
    });
  }
};
