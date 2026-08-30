"use client";

import { useState, useCallback } from "react";
import Editor from "@monaco-editor/react";
import { usePlaygroundStore } from "@/stores/playground-store";
import { useSimulationRunner } from "@/hooks/useSimulationRunner";
import { ScatterPlot } from "./ScatterPlot";
import { MetricsDisplay } from "./MetricsDisplay";
import { ParameterControls } from "./ParameterControls";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, RotateCcw, Code2, Eye } from "lucide-react";

export function CodeStudio() {
  const {
    activeSimulation,
    params,
    setParam,
    result,
    isRunning,
  } = usePlaygroundStore();
  const { runSimulation, isReady } = useSimulationRunner();
  const [editedCode, setEditedCode] = useState<string | null>(null);
  const [splitRatio, setSplitRatio] = useState(50);
  const [activeTab, setActiveTab] = useState("visual");

  const code = editedCode ?? activeSimulation?.pythonCode ?? "";

  const syncVisualToCode = useCallback(
    (paramKey: string, value: number | string | boolean) => {
      setParam(paramKey, value);
    },
    [setParam]
  );

  const resetCode = useCallback(() => {
    setEditedCode(null);
  }, []);

  const runCode = useCallback(() => {
    if (!isReady || !activeSimulation) return;
    const sim = { ...activeSimulation, pythonCode: code };
    runSimulation(sim);
  }, [isReady, activeSimulation, code, runSimulation]);

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800 rounded-t-lg">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-orange-400" />
          <span className="text-sm font-medium text-zinc-200">Code Studio</span>
          <Badge variant="secondary" className="bg-zinc-800 text-zinc-500 text-xs">
            Python + Pyodide
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetCode}
            className="h-7 text-xs"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset
          </Button>
          <Button
            size="sm"
            onClick={runCode}
            disabled={!isReady || isRunning}
            className="h-7 text-xs bg-orange-600 hover:bg-orange-700"
          >
            <Play className="w-3 h-3 mr-1" />
            Execute
          </Button>
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        {/* Left: Visualization + Controls */}
        <div
          className="border-r border-zinc-800 overflow-y-auto bg-zinc-950"
          style={{ width: `${splitRatio}%` }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <div className="px-4 pt-2 bg-zinc-900 border-b border-zinc-800">
              <TabsList className="bg-zinc-800">
                <TabsTrigger value="visual" className="text-xs">
                  <Eye className="w-3 h-3 mr-1" />
                  Visual
                </TabsTrigger>
                <TabsTrigger value="params" className="text-xs">
                  Parameters
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="visual" className="p-4 m-0 h-[calc(100%-48px)] overflow-y-auto">
              {result ? (
                <div className="space-y-4">
                  <ScatterPlot
                    points={result.points ?? []}
                    line={result.line as { x: number; y: number }[] | undefined}
                    centroids={result.centroids}
                    decisionBoundary={result.decisionBoundary}
                    showRegressionLine={activeSimulation?.id === "linear-regression"}
                    showDecisionBoundary={
                      activeSimulation?.id !== "linear-regression" &&
                      activeSimulation?.id !== "kmeans"
                    }
                  />
                  <MetricsDisplay metrics={result.metrics ?? {}} />
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-zinc-600 text-sm">
                  Click Execute to run the code
                </div>
              )}
            </TabsContent>

            <TabsContent value="params" className="p-4 m-0 h-[calc(100%-48px)] overflow-y-auto">
              <ParameterControls
                parameters={activeSimulation?.parameters ?? []}
                values={params}
                onChange={(k, v) => syncVisualToCode(k, v)}
                disabled={!isReady}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Split handle */}
        <div
          className="w-1 bg-zinc-800 hover:bg-orange-500 cursor-col-resize transition-colors"
          onMouseDown={() => {
            const onMove = (e: MouseEvent) => {
              const pct = (e.clientX / window.innerWidth) * 100;
              setSplitRatio(Math.max(25, Math.min(75, pct)));
            };
            const onUp = () => {
              window.removeEventListener("mousemove", onMove);
              window.removeEventListener("mouseup", onUp);
            };
            window.addEventListener("mousemove", onMove);
            window.addEventListener("mouseup", onUp);
          }}
        />

        {/* Right: Code Editor */}
        <div className="flex-1 min-w-0 bg-zinc-950">
          <Editor
            height="100%"
            defaultLanguage="python"
            value={code}
            onChange={(v) => setEditedCode(v ?? "")}
            theme="vs-dark"
            options={{
              fontSize: 13,
              fontFamily: "var(--font-geist-mono), monospace",
              minimap: { enabled: false },
              padding: { top: 12 },
              scrollBeyondLastLine: false,
              wordWrap: "on",
              automaticLayout: true,
              tabSize: 2,
              renderLineHighlight: "gutter",
            }}
          />
        </div>
      </div>
    </div>
  );
}
