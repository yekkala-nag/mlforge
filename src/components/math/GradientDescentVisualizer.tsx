"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import * as d3 from "d3";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Play,
  Pause,
  RotateCcw,
  TrendingDown,
  Target,
  Zap,
} from "lucide-react";

// Loss function definitions
const lossFunctions = {
  mse: {
    name: "Mean Squared Error",
    fn: (w: number, b: number) => w * w + b * b,
    gradW: (w: number) => 2 * w,
    gradB: (b: number) => 2 * b,
    description: "L(w,b) = w² + b²",
    range: [-3, 3],
  },
  bowl: {
    name: "Convex Bowl",
    fn: (w: number, b: number) => 0.5 * w * w + 2 * b * b,
    gradW: (w: number) => w,
    gradB: (b: number) => 4 * b,
    description: "L(w,b) = 0.5w² + 2b²",
    range: [-3, 3],
  },
  rastrigin: {
    name: "Rastrigin (Non-Convex)",
    fn: (w: number, b: number) =>
      20 + w * w - 10 * Math.cos(2 * Math.PI * w * 0.3) + b * b - 10 * Math.cos(2 * Math.PI * b * 0.3),
    gradW: (w: number) =>
      2 * w + 10 * 0.3 * 2 * Math.PI * Math.sin(2 * Math.PI * w * 0.3),
    gradB: (b: number) =>
      2 * b + 10 * 0.3 * 2 * Math.PI * Math.sin(2 * Math.PI * b * 0.3),
    description: "Many local minima — gradient descent can get stuck",
    range: [-5, 5],
  },
  saddle: {
    name: "Saddle Point",
    fn: (w: number, b: number) => w * w - b * b,
    gradW: (w: number) => 2 * w,
    gradB: (b: number) => -2 * b,
    description: "L(w,b) = w² - b² — saddle point at origin",
    range: [-3, 3],
  },
};

interface Point {
  w: number;
  b: number;
  loss: number;
}

export function GradientDescentVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedFn, setSelectedFn] = useState("mse");
  const [learningRate, setLearningRate] = useState(0.1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [path, setPath] = useState<Point[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [startPoint, setStartPoint] = useState({ w: 2.5, b: 2.5 });
  const [speed, setSpeed] = useState(50);
  const animRef = useRef<NodeJS.Timeout | null>(null);

  const fn = lossFunctions[selectedFn as keyof typeof lossFunctions];

  // Compute gradient descent path
  const computePath = useCallback(() => {
    const points: Point[] = [];
    let w = startPoint.w;
    let b = startPoint.b;
    const lr = learningRate;
    const maxSteps = 200;

    for (let i = 0; i < maxSteps; i++) {
      const loss = fn.fn(w, b);
      points.push({ w, b, loss });

      const gw = fn.gradW(w);
      const gb = fn.gradB(b);

      w -= lr * gw;
      b -= lr * gb;

      // Clamp
      w = Math.max(fn.range[0], Math.min(fn.range[1], w));
      b = Math.max(fn.range[0], Math.min(fn.range[1], b));

      // Check convergence
      if (Math.abs(gw) < 1e-6 && Math.abs(gb) < 1e-6) break;
    }
    return points;
  }, [startPoint, learningRate, fn]);

  // Draw the loss surface
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 500;
    canvas.width = size;
    canvas.height = size;

    const [lo, hi] = fn.range;
    const resolution = 100;
    const cellSize = size / resolution;

    // Compute loss values for the grid
    const losses: number[][] = [];
    let minLoss = Infinity;
    let maxLoss = -Infinity;

    for (let i = 0; i < resolution; i++) {
      losses[i] = [];
      for (let j = 0; j < resolution; j++) {
        const w = lo + (i / resolution) * (hi - lo);
        const b = lo + (j / resolution) * (hi - lo);
        const loss = fn.fn(w, b);
        losses[i][j] = loss;
        if (loss < minLoss) minLoss = loss;
        if (loss > maxLoss) maxLoss = loss;
      }
    }

    // Color scale
    const colorScale = d3
      .scaleSequential(d3.interpolateViridis)
      .domain([minLoss, maxLoss]);

    // Draw heatmap
    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < resolution; j++) {
        ctx.fillStyle = colorScale(losses[i][j]);
        ctx.fillRect(i * cellSize, j * cellSize, cellSize + 1, cellSize + 1);
      }
    }

    // Draw contour lines
    const thresholds = d3.range(minLoss, maxLoss, (maxLoss - minLoss) / 12);
    const contourGen = d3.contours()
      .size([resolution, resolution])
      .thresholds(thresholds.map((t) => (t - minLoss) / (maxLoss - minLoss)));

    const normalizedLosses = losses.flatMap((row) =>
      row.map((v) => (v - minLoss) / (maxLoss - minLoss))
    );

    contourGen(normalizedLosses).forEach((contour) => {
      ctx.beginPath();
      d3.geoPath(d3.geoTransform({
        point: function (x, y) {
          this.stream.point(x * cellSize, y * cellSize);
        },
      }))(contour as any);
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });

    // Draw gradient descent path
    if (path.length > 0) {
      const visiblePath = path.slice(0, currentIdx + 1);

      // Path line
      ctx.beginPath();
      visiblePath.forEach((p, i) => {
        const x = ((p.w - lo) / (hi - lo)) * size;
        const y = ((p.b - lo) / (hi - lo)) * size;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = "#f97316";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Path points
      visiblePath.forEach((p, i) => {
        const x = ((p.w - lo) / (hi - lo)) * size;
        const y = ((p.b - lo) / (hi - lo)) * size;
        ctx.beginPath();
        ctx.arc(x, y, i === visiblePath.length - 1 ? 5 : 2, 0, Math.PI * 2);
        ctx.fillStyle = i === visiblePath.length - 1 ? "#f97316" : "rgba(249,115,22,0.5)";
        ctx.fill();
      });

      // Current position label
      const current = visiblePath[visiblePath.length - 1];
      const cx = ((current.w - lo) / (hi - lo)) * size;
      const cy = ((current.b - lo) / (hi - lo)) * size;
      ctx.fillStyle = "#fff";
      ctx.font = "11px monospace";
      ctx.fillText(`w=${current.w.toFixed(2)} b=${current.b.toFixed(2)}`, cx + 8, cy - 8);
      ctx.fillText(`loss=${current.loss.toFixed(4)}`, cx + 8, cy + 12);
    }

    // Draw start point
    const sx = ((startPoint.w - lo) / (hi - lo)) * size;
    const sy = ((startPoint.b - lo) / (hi - lo)) * size;
    ctx.beginPath();
    ctx.arc(sx, sy, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#22c55e";
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Axes labels
    ctx.fillStyle = "#a1a1aa";
    ctx.font = "12px sans-serif";
    ctx.fillText("Weight (w) →", size / 2 - 30, size - 8);
    ctx.save();
    ctx.translate(12, size / 2 + 30);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Bias (b) →", 0, 0);
    ctx.restore();
  }, [fn, path, currentIdx, startPoint]);

  // Animation loop
  useEffect(() => {
    if (isPlaying && currentIdx < path.length - 1) {
      animRef.current = setInterval(() => {
        setCurrentIdx((prev) => {
          if (prev >= path.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }
    return () => {
      if (animRef.current) clearInterval(animRef.current);
    };
  }, [isPlaying, path.length, speed]);

  const start = useCallback(() => {
    const p = computePath();
    setPath(p);
    if (currentIdx >= p.length - 1) setCurrentIdx(0);
    setIsPlaying(true);
  }, [computePath, currentIdx]);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setPath([]);
    setCurrentIdx(0);
  }, []);

  const presets: Record<string, { w: number; b: number; lr: number }> = {
    mse: { w: 2.5, b: 2.5, lr: 0.1 },
    bowl: { w: 2.5, b: 2.5, lr: 0.15 },
    rastrigin: { w: 4.0, b: 4.0, lr: 0.01 },
    saddle: { w: 0.5, b: 2.5, lr: 0.1 },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <TrendingDown className="w-6 h-6 text-orange-400" />
          Visual ML Mathematics
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          See gradient descent in action. Watch the optimizer navigate the loss
          surface.
        </p>
      </div>

      {/* Loss function selector */}
      <div className="flex gap-2 flex-wrap">
        {Object.entries(lossFunctions).map(([id, f]) => (
          <Button
            key={id}
            variant={selectedFn === id ? "default" : "ghost"}
            size="sm"
            onClick={() => {
              setSelectedFn(id);
              reset();
              const preset = presets[id];
              setStartPoint({ w: preset.w, b: preset.b });
              setLearningRate(preset.lr);
            }}
            className={
              selectedFn === id ? "bg-orange-600 text-white" : "text-zinc-400"
            }
          >
            {f.name}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Canvas */}
        <div className="lg:col-span-2">
          <Card className="bg-zinc-900 border-zinc-800 p-4">
            <canvas
              ref={canvasRef}
              width={500}
              height={500}
              className="rounded-lg bg-zinc-950 w-full max-w-[500px] cursor-crosshair"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                const [lo, hi] = fn.range;
                setStartPoint({
                  w: lo + x * (hi - lo),
                  b: lo + y * (hi - lo),
                });
                reset();
              }}
            />
            <p className="text-xs text-zinc-600 mt-2 text-center">
              Click on the surface to set the starting point
            </p>
          </Card>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <Card className="bg-zinc-900 border-zinc-800 p-4 space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-zinc-300">Learning Rate</label>
                <Badge variant="secondary" className="font-mono text-xs">
                  {learningRate}
                </Badge>
              </div>
              <Slider
                value={[learningRate]}
                onValueChange={(v) => setLearningRate(Array.isArray(v) ? v[0] : v)}
                min={0.001}
                max={0.5}
                step={0.001}
              />
              <div className="flex justify-between text-xs text-zinc-600 mt-1">
                <span>Too slow</span>
                <span>Too fast</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-zinc-300">Animation Speed</label>
                <Badge variant="secondary" className="font-mono text-xs">
                  {speed}ms
                </Badge>
              </div>
              <Slider
                value={[speed]}
                onValueChange={(v) => setSpeed(Array.isArray(v) ? v[0] : v)}
                min={10}
                max={200}
                step={10}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={isPlaying ? () => setIsPlaying(false) : start}
                className="flex-1 bg-orange-600 hover:bg-orange-700"
                size="sm"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 mr-1" />
                ) : (
                  <Play className="w-4 h-4 mr-1" />
                )}
                {isPlaying ? "Pause" : "Run"}
              </Button>
              <Button onClick={reset} variant="outline" size="sm">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </Card>

          {/* Formula */}
          <Card className="bg-zinc-900 border-zinc-800 p-4">
            <h3 className="text-sm font-semibold text-zinc-200 mb-2">
              Loss Function
            </h3>
            <p className="font-mono text-amber-400 text-sm mb-2">
              {fn.description}
            </p>
            <p className="text-xs text-zinc-500">
              Gradient descent updates: w = w - lr * ∂L/∂w
            </p>
          </Card>

          {/* Current state */}
          {path.length > 0 && currentIdx < path.length && (
            <Card className="bg-zinc-900 border-zinc-800 p-4">
              <h3 className="text-sm font-semibold text-zinc-200 mb-2">
                Current Position
              </h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Step</span>
                  <span className="font-mono text-zinc-300">
                    {currentIdx} / {path.length - 1}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Weight</span>
                  <span className="font-mono text-zinc-300">
                    {path[currentIdx].w.toFixed(4)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Bias</span>
                  <span className="font-mono text-zinc-300">
                    {path[currentIdx].b.toFixed(4)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Loss</span>
                  <span className="font-mono text-amber-400">
                    {path[currentIdx].loss.toFixed(6)}
                  </span>
                </div>
              </div>
            </Card>
          )}

          {/* Learning rate experiment */}
          <Card className="bg-zinc-900 border-zinc-800 p-4">
            <h3 className="text-sm font-semibold text-zinc-200 mb-2 flex items-center gap-1">
              <Zap className="w-4 h-4 text-amber-400" />
              Experiment
            </h3>
            <div className="space-y-2 text-xs text-zinc-400">
              <p>
                <span className="text-blue-400">Try lr = 0.001</span> — watch
                it crawl toward the minimum
              </p>
              <p>
                <span className="text-emerald-400">Try lr = 0.1</span> — smooth
                convergence
              </p>
              <p>
                <span className="text-red-400">Try lr = 0.5</span> — overshooting and oscillation
              </p>
              <p>
                <span className="text-amber-400">Try the Rastrigin function</span>{" "}
                — gradient descent gets stuck in local minima
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
