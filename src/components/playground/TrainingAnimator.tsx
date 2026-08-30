"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ScatterPlot } from "./ScatterPlot";
import { LossChart } from "./LossChart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipForward, SkipBack, RotateCcw } from "lucide-react";

interface Snapshot {
  step: number;
  line?: { x: number; y: number }[];
  boundary?: number[][];
  w?: number;
  b?: number;
  loss?: number;
}

interface TrainingAnimatorProps {
  points: { x: number; y: number; predicted?: number; cluster?: number }[];
  snapshots: Snapshot[];
  lossHistory: number[];
  metrics: Record<string, number>;
  isRegression?: boolean;
}

export function TrainingAnimator({
  points,
  snapshots,
  lossHistory,
  metrics,
  isRegression = true,
}: TrainingAnimatorProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(300);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalSteps = snapshots.length;

  useEffect(() => {
    if (isPlaying && currentStep < totalSteps - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= totalSteps - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, totalSteps, speed]);

  const play = useCallback(() => {
    if (currentStep >= totalSteps - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(true);
  }, [currentStep, totalSteps]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const stepForward = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep((s) => Math.min(s + 1, totalSteps - 1));
  }, [totalSteps]);

  const stepBack = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep((s) => Math.max(s - 1, 0));
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
  }, []);

  if (!snapshots || snapshots.length === 0) return null;

  const snapshot = snapshots[currentStep];
  const progress = totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 100;

  return (
    <div className="space-y-4">
      <Card className="bg-zinc-900 border-zinc-800 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-zinc-800 font-mono">
              Step {snapshot.step} / {snapshots[snapshots.length - 1].step}
            </Badge>
            {snapshot.w !== undefined && (
              <span className="text-xs text-zinc-500">
                w = {snapshot.w.toFixed(4)}, b = {snapshot.b?.toFixed(4)}
              </span>
            )}
            {snapshot.loss !== undefined && (
              <span className="text-xs text-zinc-500">
                loss = {snapshot.loss.toFixed(4)}
              </span>
            )}
          </div>
          <Badge
            variant={isPlaying ? "default" : "secondary"}
            className={isPlaying ? "bg-orange-600" : "bg-zinc-800"}
          >
            {isPlaying ? "Playing" : currentStep === totalSteps - 1 ? "Done" : "Paused"}
          </Badge>
        </div>

        {/* Visualization */}
        <ScatterPlot
          points={points}
          line={snapshot.line}
          decisionBoundary={snapshot.boundary}
          showRegressionLine={isRegression}
          showDecisionBoundary={!isRegression}
        />
      </Card>

      {/* Controls */}
      <Card className="bg-zinc-900 border-zinc-800 p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={reset} className="h-8 w-8 p-0">
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={stepBack} className="h-8 w-8 p-0">
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button
              onClick={isPlaying ? pause : play}
              className="h-8 w-8 p-0 bg-orange-600 hover:bg-orange-700"
              size="sm"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={stepForward} className="h-8 w-8 p-0">
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1">
            <Slider
              value={[currentStep]}
              onValueChange={(val) => {
                const v = Array.isArray(val) ? val[0] : val;
                setIsPlaying(false);
                setCurrentStep(v);
              }}
              min={0}
              max={totalSteps - 1}
              step={1}
              className="w-full"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span>Speed</span>
            <Slider
              value={[speed]}
              onValueChange={(val) => setSpeed(Array.isArray(val) ? val[0] : val)}
              min={50}
              max={1000}
              step={50}
              className="w-20"
            />
          </div>
        </div>

        {/* Mini loss chart */}
        {lossHistory.length > 0 && (
          <div className="mt-3">
            <LossChart
              data={lossHistory.slice(0, currentStep + 1)}
              width={600}
              height={100}
              label="Training Loss"
            />
          </div>
        )}
      </Card>
    </div>
  );
}
