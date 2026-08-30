"use client";

import { useState, useCallback, useEffect } from "react";
import { usePyodide } from "@/hooks/usePyodide";
import Editor from "@monaco-editor/react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { from_scratch_algorithms } from "@/lib/from-scratch";
import { Play, CheckCircle, XCircle, Code2, BookOpen } from "lucide-react";
import { PyodideStatus } from "@/components/pyodide/PyodideStatus";

interface ComparisonResult {
  scratch: Record<string, unknown>;
  sklearn: Record<string, unknown>;
  comparison: {
    accuracy_diff?: number;
    weight_diff?: number;
    bias_diff?: number;
    match: boolean;
  };
}

export function FromScratchMode() {
  const { isReady, run, loadPkgs } = usePyodide();
  const [selectedAlgo, setSelectedAlgo] = useState("linear-regression");
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState("compare");
  const [sklearnLoaded, setSklearnLoaded] = useState(false);

  const algo = from_scratch_algorithms[selectedAlgo];

  const ensureSklearn = useCallback(async () => {
    if (!sklearnLoaded) {
      await loadPkgs(["scikit-learn"]);
      setSklearnLoaded(true);
    }
  }, [sklearnLoaded, loadPkgs]);

  const runComparison = useCallback(async () => {
    if (!isReady || !algo) return;
    setIsRunning(true);
    try {
      await ensureSklearn();
      const data = await run<ComparisonResult>(algo.scratch_code);
      setResult(data);
    } catch (err) {
      console.error("From-scratch error:", err);
    } finally {
      setIsRunning(false);
    }
  }, [isReady, algo, run, ensureSklearn]);

  useEffect(() => {
    let active = true;
    if (isReady && algo) {
      const timer = setTimeout(() => {
        if (active) {
          void runComparison();
        }
      }, 0);
      return () => {
        active = false;
        clearTimeout(timer);
      };
    }
  }, [isReady, selectedAlgo, algo, runComparison]);

  return (
    <div className="space-y-6">
      <PyodideStatus />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Code2 className="w-6 h-6 text-orange-400" />
            From Scratch Mode
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Build algorithms with NumPy, then compare with sklearn. Understand
            the math, not just the API.
          </p>
        </div>
      </div>

      {/* Algorithm selector */}
      <div className="flex gap-2">
        {Object.entries(from_scratch_algorithms).map(([id, a]) => (
          <Button
            key={id}
            variant={selectedAlgo === id ? "default" : "ghost"}
            size="sm"
            onClick={() => {
              setSelectedAlgo(id);
              setResult(null);
            }}
            className={
              selectedAlgo === id
                ? "bg-orange-600 text-white"
                : "text-zinc-400"
            }
          >
            {a.name}
          </Button>
        ))}
      </div>

      {/* Concepts panel */}
      <Card className="bg-zinc-900 border-zinc-800 p-5">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-zinc-200">
            Key Concepts — {algo?.name}
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {algo?.concepts.map((concept, i) => (
            <div
              key={i}
              className="bg-zinc-800 rounded-lg p-3 text-xs text-zinc-400 leading-relaxed"
            >
              <span className="text-amber-400 font-mono mr-1">{i + 1}.</span>
              {concept}
            </div>
          ))}
        </div>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-zinc-800">
          <TabsTrigger value="compare" className="text-xs">
            Side-by-Side
          </TabsTrigger>
          <TabsTrigger value="code" className="text-xs">
            Full Code
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compare" className="mt-4">
          {result && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* From Scratch */}
              <Card className="bg-zinc-900 border-zinc-800 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-zinc-200">
                    From Scratch (NumPy)
                  </h3>
                  <Badge className="bg-amber-600/20 text-amber-400 text-xs">
                    Manual Implementation
                  </Badge>
                </div>
                <div className="space-y-3">
                  {Object.entries(result.scratch).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-zinc-500 capitalize">
                        {key.replace(/_/g, " ")}
                      </span>
                      <span className="font-mono text-zinc-300 text-xs">
                        {typeof value === "number"
                          ? value.toFixed(4)
                          : typeof value === "object"
                            ? JSON.stringify(value)
                            : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Sklearn */}
              <Card className="bg-zinc-900 border-zinc-800 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-zinc-200">
                    Production (sklearn)
                  </h3>
                  <Badge className="bg-blue-600/20 text-blue-400 text-xs">
                    Mature Library
                  </Badge>
                </div>
                <div className="space-y-3">
                  {Object.entries(result.sklearn).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-zinc-500 capitalize">
                        {key.replace(/_/g, " ")}
                      </span>
                      <span className="font-mono text-zinc-300 text-xs">
                        {typeof value === "number"
                          ? value.toFixed(4)
                          : typeof value === "object"
                            ? JSON.stringify(value)
                            : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Comparison verdict */}
              <Card
                className={`md:col-span-2 p-5 border ${
                  result.comparison.match
                    ? "border-emerald-500/50 bg-emerald-950/20"
                    : "border-amber-500/50 bg-amber-950/20"
                }`}
              >
                <div className="flex items-center gap-3">
                  {result.comparison.match ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-amber-400" />
                  )}
                  <div>
                    <h3 className="font-semibold text-zinc-200">
                      {result.comparison.match
                        ? "Results Match!"
                        : "Results Differ"}
                    </h3>
                    <p className="text-sm text-zinc-400">
                      {result.comparison.match
                        ? "Your from-scratch implementation produces the same results as sklearn. You understand the algorithm."
                        : `Accuracy difference: ${(result.comparison.accuracy_diff ?? result.comparison.weight_diff ?? 0).toFixed(4)}. This is expected — sklearn uses optimized solvers and numerical tricks.`}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="code" className="mt-4">
          <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
            <div className="h-[500px]">
              <Editor
                height="500px"
                defaultLanguage="python"
                value={algo?.scratch_code ?? ""}
                theme="vs-dark"
                options={{
                  fontSize: 13,
                  fontFamily: "var(--font-geist-mono), monospace",
                  minimap: { enabled: false },
                  readOnly: true,
                  padding: { top: 12 },
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <Button
        onClick={runComparison}
        disabled={!isReady || isRunning}
        className="bg-orange-600 hover:bg-orange-700"
      >
        <Play className="w-4 h-4 mr-2" />
        {isRunning
          ? sklearnLoaded
            ? "Running..."
            : "Loading sklearn..."
          : "Run Comparison"}
      </Button>
    </div>
  );
}
