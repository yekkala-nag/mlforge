"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useProgressStore } from "@/stores/progress-store";
import {
  Trophy,
  Download,
  Upload,
  RotateCcw,
  CheckCircle,
  Circle,
  Target,
} from "lucide-react";

export function ProgressTracker() {
  const {
    progress,
    isLoaded,
    init,
    exportData,
    importData,
    resetProgress,
    getCompletedWorlds,
    getTotalScore,
  } = useProgressStore();

  const [importJson, setImportJson] = useState("");
  const [showImport, setShowImport] = useState(false);

  useEffect(() => {
    init();
  }, [init]);

  if (!isLoaded) return null;

  const completedWorlds = getCompletedWorlds();
  const totalScore = getTotalScore();

  const worldNames: Record<string, string> = {
    playground: "ML Playground",
    arena: "Model Arena",
    ops: "MLOps Control Room",
    capstone: "Capstone Projects",
    "from-scratch": "From Scratch",
    datasets: "Dataset Explorer",
    challenges: "Challenge Engine",
    math: "Visual Mathematics",
    learn: "Learning Map",
    labs: "Algorithm Lab",
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ml-forge-progress-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (importData(importJson)) {
      setImportJson("");
      setShowImport(false);
    }
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          Your Progress
        </h2>
        <Badge variant="secondary" className="bg-amber-900/30 text-amber-400">
          {totalScore} pts
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-emerald-400">
            {completedWorlds.length}
          </p>
          <p className="text-xs text-zinc-500">Worlds Complete</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-400">
            {Object.keys(progress.challenges).length}
          </p>
          <p className="text-xs text-zinc-500">Challenges Done</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-400">
            {Math.floor(progress.totalTimeSpent / 60)}m
          </p>
          <p className="text-xs text-zinc-500">Time Spent</p>
        </div>
      </div>

      <Separator className="bg-zinc-800" />

      {/* World Progress */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-zinc-300">World Progress</h3>
        {Object.entries(worldNames).map(([id, name]) => {
          const world = progress.worlds[id];
          const status = world?.status || "not_started";
          return (
            <div key={id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {status === "completed" ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                ) : status === "in_progress" ? (
                  <Target className="w-4 h-4 text-blue-400" />
                ) : (
                  <Circle className="w-4 h-4 text-zinc-600" />
                )}
                <span
                  className={`text-sm ${
                    status === "completed"
                      ? "text-emerald-400"
                      : status === "in_progress"
                      ? "text-blue-400"
                      : "text-zinc-500"
                  }`}
                >
                  {name}
                </span>
              </div>
              {world && (
                <Badge variant="secondary" className="text-xs font-mono">
                  {world.score} pts
                </Badge>
              )}
            </div>
          );
        })}
      </div>

      <Separator className="bg-zinc-800" />

      {/* Data Management */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-zinc-300">Data Management</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="flex-1 text-xs"
          >
            <Download className="w-3 h-3 mr-1" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowImport(!showImport)}
            className="flex-1 text-xs"
          >
            <Upload className="w-3 h-3 mr-1" />
            Import
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetProgress}
            className="text-xs text-red-400 hover:text-red-300"
          >
            <RotateCcw className="w-3 h-3" />
          </Button>
        </div>

        {showImport && (
          <div className="space-y-2">
            <textarea
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder="Paste your progress JSON here..."
              className="w-full h-32 bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-xs font-mono text-zinc-300 resize-none"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleImport}
                className="bg-orange-600 hover:bg-orange-700 text-xs"
              >
                Import
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setShowImport(false);
                  setImportJson("");
                }}
                className="text-xs"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* User ID */}
      <p className="text-xs text-zinc-600 text-center">
        ID: {progress.id.slice(0, 20)}...
      </p>
    </Card>
  );
}
