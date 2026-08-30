"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  ServerCog,
  Activity,
  AlertTriangle,
  CheckCircle,
  RotateCcw,
  Play,
  Pause,
  TrendingDown,
  Zap,
} from "lucide-react";

interface DayData {
  day: number;
  accuracy: number;
  latency: number;
  requests: number;
  drift: number;
  errorRate: number;
}

export function MLOpsRoom() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentDay, setCurrentDay] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [decision, setDecision] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalDays = 60;

  const generateDayData = useCallback(
    (day: number): DayData => {
      const degradation = day / totalDays;
      return {
        day,
        accuracy: Math.max(0.6, 0.942 - degradation * 0.15 + (Math.random() - 0.5) * 0.02),
        latency: 38 + degradation * 20 + (Math.random() - 0.5) * 5,
        requests: Math.floor(18420 + Math.random() * 2000),
        drift: degradation * 8 + (Math.random() - 0.5) * 0.5,
        errorRate: Math.min(0.15, 0.008 + degradation * 0.08 + (Math.random() - 0.5) * 0.01),
      };
    },
    []
  );

  const [history, setHistory] = useState<DayData[]>([]);

  useEffect(() => {
    if (isSimulating && currentDay < totalDays) {
      intervalRef.current = setInterval(() => {
        setCurrentDay((prev) => {
          if (prev >= totalDays) {
            setIsSimulating(false);
            return prev;
          }
          const newDay = prev + 1;
          setHistory((h) => [...h, generateDayData(newDay)]);
          return newDay;
        });
      }, 1000 / speed);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isSimulating, speed, currentDay, generateDayData]);

  const start = useCallback(() => {
    if (currentDay >= totalDays) {
      setCurrentDay(0);
      setHistory([]);
      setDecision(null);
    }
    setIsSimulating(true);
  }, [currentDay]);

  const pause = useCallback(() => {
    setIsSimulating(false);
  }, []);

  const reset = useCallback(() => {
    setIsSimulating(false);
    setCurrentDay(0);
    setHistory([]);
    setDecision(null);
  }, []);

  const current = history[history.length - 1] ?? generateDayData(0);
  const isDegraded = current.accuracy < 0.85;
  const isCritical = current.accuracy < 0.75;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ServerCog className="w-6 h-6 text-orange-400" />
            MLOps Control Room
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Monitor a production model. Watch performance degrade over time. Decide when to act.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={isCritical ? "destructive" : isDegraded ? "default" : "secondary"}
            className={
              isCritical
                ? "bg-red-600"
                : isDegraded
                  ? "bg-amber-600"
                  : "bg-emerald-600"
            }
          >
            {isCritical
              ? "CRITICAL"
              : isDegraded
                ? "DEGRADED"
                : "HEALTHY"}
          </Badge>
        </div>
      </div>

      {/* Main dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard
          label="Accuracy"
          value={`${(current.accuracy * 100).toFixed(1)}%`}
          trend={current.accuracy < 0.85 ? "down" : "stable"}
          icon={<Activity className="w-4 h-4" />}
        />
        <MetricCard
          label="Latency"
          value={`${current.latency.toFixed(0)}ms`}
          trend={current.latency > 50 ? "down" : "stable"}
          icon={<Zap className="w-4 h-4" />}
        />
        <MetricCard
          label="Requests/min"
          value={current.requests.toLocaleString()}
          trend="stable"
          icon={<ServerCog className="w-4 h-4" />}
        />
        <MetricCard
          label="Drift"
          value={`${current.drift.toFixed(1)}%`}
          trend={current.drift > 5 ? "down" : "stable"}
          icon={<TrendingDown className="w-4 h-4" />}
        />
        <MetricCard
          label="Error Rate"
          value={`${(current.errorRate * 100).toFixed(1)}%`}
          trend={current.errorRate > 0.05 ? "down" : "stable"}
          icon={<AlertTriangle className="w-4 h-4" />}
        />
        <MetricCard
          label="Day"
          value={`${currentDay} / ${totalDays}`}
          trend="stable"
          icon={<Activity className="w-4 h-4" />}
        />
      </div>

      {/* Controls */}
      <Card className="bg-zinc-900 border-zinc-800 p-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={reset}>
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
          <Button
            onClick={isSimulating ? pause : start}
            className="bg-orange-600 hover:bg-orange-700"
            size="sm"
          >
            {isSimulating ? (
              <Pause className="w-4 h-4 mr-1" />
            ) : (
              <Play className="w-4 h-4 mr-1" />
            )}
            {isSimulating ? "Pause" : currentDay >= totalDays ? "Restart" : "Simulate"}
          </Button>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span>Speed</span>
            <Slider
              value={[speed]}
              onValueChange={(val) => setSpeed(Array.isArray(val) ? val[0] : val)}
              min={1}
              max={10}
              step={1}
              className="w-24"
            />
            <span>{speed}x</span>
          </div>
        </div>
      </Card>

      {/* Mini accuracy chart */}
      {history.length > 1 && (
        <Card className="bg-zinc-900 border-zinc-800 p-4">
          <h3 className="text-sm font-semibold text-zinc-200 mb-3">
            Accuracy Over Time
          </h3>
          <div className="h-32 flex items-end gap-[2px]">
            {history.map((d, i) => (
              <div
                key={i}
                className="flex-1 rounded-t transition-all duration-200"
                style={{
                  height: `${d.accuracy * 100}%`,
                  backgroundColor:
                    d.accuracy >= 0.9
                      ? "#22c55e"
                      : d.accuracy >= 0.8
                        ? "#eab308"
                        : d.accuracy >= 0.7
                          ? "#f97316"
                          : "#ef4444",
                }}
              />
            ))}
          </div>
        </Card>
      )}

      {/* Decision panel */}
      {isDegraded && !decision && (
        <Card className="border-amber-500/50 bg-amber-950/20 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-amber-200 mb-2">
                Model Performance Degrading
              </h3>
              <p className="text-sm text-amber-300/70 mb-4">
                Accuracy has dropped to{" "}
                {(current.accuracy * 100).toFixed(1)}%. Feature drift is at{" "}
                {current.drift.toFixed(1)}%. What should you do?
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { id: "investigate", label: "Investigate", desc: "Check data quality" },
                  { id: "rollback", label: "Rollback", desc: "Revert to v16" },
                  { id: "retrain", label: "Retrain", desc: "Update with new data" },
                  { id: "threshold", label: "Adjust Threshold", desc: "Raise decision boundary" },
                ].map((action) => (
                  <Button
                    key={action.id}
                    variant="outline"
                    onClick={() => setDecision(action.id)}
                    className="h-auto py-3 flex-col items-start text-left border-amber-700/50 hover:bg-amber-900/30"
                  >
                    <span className="text-sm font-medium text-amber-200">
                      {action.label}
                    </span>
                    <span className="text-xs text-amber-400/60">
                      {action.desc}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Decision feedback */}
      {decision && (
        <Card
          className={`p-5 ${
            decision === "retrain"
              ? "border-emerald-500/50 bg-emerald-950/20"
              : decision === "rollback"
                ? "border-blue-500/50 bg-blue-950/20"
                : "border-zinc-700 bg-zinc-900"
          }`}
        >
          <div className="flex items-start gap-3">
            {decision === "retrain" || decision === "rollback" ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
            )}
            <div>
              <h3 className="font-semibold text-zinc-200 mb-1">
                {decision === "retrain" && "Retraining initiated"}
                {decision === "rollback" && "Rolled back to v16"}
                {decision === "investigate" && "Investigation started"}
                {decision === "threshold" && "Threshold adjusted to 0.7"}
              </h3>
              <p className="text-sm text-zinc-400">
                {decision === "retrain" &&
                  "Model retrained on last 7 days of data. Accuracy recovered to 92.1%. This is the correct action when you have enough fresh labeled data."}
                {decision === "rollback" &&
                  "Reverted to previous model version v16. Accuracy stabilized at 91.8%. Use rollback when you need immediate stability."}
                {decision === "investigate" &&
                  "Data pipeline checked. Root cause: customer behavior shifted after holiday season. Investigation is always the first step."}
                {decision === "threshold" &&
                  "Decision threshold raised from 0.5 to 0.7. False positives reduced but recall dropped. Threshold tuning is a short-term fix."}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Model info */}
      <Card className="bg-zinc-900 border-zinc-800 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-zinc-200">
            MODEL: Fraud Detection v17
          </h3>
          <Badge variant="secondary" className="bg-zinc-800 text-xs">
            XGBoost
          </Badge>
        </div>
        <Separator className="bg-zinc-800 mb-3" />
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-zinc-500">Deployed</span>
            <p className="text-zinc-300">2026-08-15</p>
          </div>
          <div>
            <span className="text-zinc-500">Training Data</span>
            <p className="text-zinc-300">1.2M rows</p>
          </div>
          <div>
            <span className="text-zinc-500">Features</span>
            <p className="text-zinc-300">47 engineered</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function MetricCard({
  label,
  value,
  trend,
  icon,
}: {
  label: string;
  value: string;
  trend: "up" | "down" | "stable";
  icon: React.ReactNode;
}) {
  return (
    <Card className="bg-zinc-900 border-zinc-800 p-3">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-zinc-500">{icon}</span>
          <span className="text-xs text-zinc-500">{label}</span>
        </div>
        <span className={`text-[10px] ${trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-zinc-500"}`}>
          {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
        </span>
      </div>
      <div className="text-lg font-mono font-bold text-zinc-200">{value}</div>
    </Card>
  );
}
