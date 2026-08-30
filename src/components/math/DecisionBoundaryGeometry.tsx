"use client";

import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw } from "lucide-react";

interface BoundaryProps {
  width?: number;
  height?: number;
}

export function DecisionBoundaryGeometry({ width = 500, height = 500 }: BoundaryProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [algo, setAlgo] = useState<"linear" | "polynomial" | "rbf">("linear");
  const [degree, setDegree] = useState(2);
  const [gamma, setGamma] = useState(1.0);
  const [noise, setNoise] = useState(0.3);
  const [showBoundary, setShowBoundary] = useState(true);
  const [dataPoints, setDataPoints] = useState<{ x: number; y: number; c: number }[]>([]);

  // Generate data
  useEffect(() => {
    const points: { x: number; y: number; c: number }[] = [];
    for (let i = 0; i < 60; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 1.5 + Math.random() * noise;
      points.push({
        x: Math.cos(angle) * r + (Math.random() - 0.5) * noise,
        y: Math.sin(angle) * r + (Math.random() - 0.5) * noise,
        c: 0,
      });
    }
    for (let i = 0; i < 60; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 0.5 + Math.random() * noise;
      points.push({
        x: Math.cos(angle) * r + (Math.random() - 0.5) * noise,
        y: Math.sin(angle) * r + (Math.random() - 0.5) * noise,
        c: 1,
      });
    }
    setDataPoints(points);
  }, [noise]);

  // Draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dataPoints.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    const lo = -4, hi = 4;
    const cellSize = width / 80;

    // Compute decision function value at each grid point
    const gridValues: number[][] = [];
    for (let i = 0; i < 80; i++) {
      gridValues[i] = [];
      for (let j = 0; j < 80; j++) {
        const px = lo + (i / 80) * (hi - lo);
        const py = lo + (j / 80) * (hi - lo);

        let val = 0;
        if (algo === "linear") {
          // Simple linear: positive if inside circle
          val = px * px + py * py - 1.5 * 1.5;
        } else if (algo === "polynomial") {
          // Polynomial boundary
          val = 0;
          for (let d = 0; d <= degree; d++) {
            val += Math.pow(px, d) * Math.pow(py, degree - d) * (d % 2 === 0 ? 1 : -1);
          }
          val = val - 2;
        } else {
          // RBF-like
          val = 0;
          for (const p of dataPoints) {
            const dist = Math.sqrt((px - p.x) ** 2 + (py - p.y) ** 2);
            val += (p.c === 0 ? 1 : -1) * Math.exp(-gamma * dist * dist);
          }
        }
        gridValues[i][j] = val;
      }
    }

    // Draw heatmap
    const minVal = d3.min(gridValues.flat()) ?? -1;
    const maxVal = d3.max(gridValues.flat()) ?? 1;
    const colorScale = d3.scaleSequential(d3.interpolateRdBu).domain([maxVal, minVal]);

    for (let i = 0; i < 80; i++) {
      for (let j = 0; j < 80; j++) {
        ctx.fillStyle = colorScale(gridValues[i][j]);
        ctx.globalAlpha = 0.4;
        ctx.fillRect(i * cellSize, j * cellSize, cellSize + 1, cellSize + 1);
      }
    }
    ctx.globalAlpha = 1;

    // Draw decision boundary contour
    if (showBoundary) {
      const normalizedGrid = gridValues.flatMap((row) =>
        row.map((v) => (v - minVal) / (maxVal - minVal))
      );

      const contourGen = d3
        .contours()
        .size([80, 80])
        .thresholds([0.5]);

      contourGen(normalizedGrid).forEach((contour) => {
        ctx.beginPath();
        d3.geoPath(
          d3.geoTransform({
            point: function (x, y) {
              this.stream.point(x * cellSize, y * cellSize);
            },
          })
        )(contour as any);
        ctx.strokeStyle = "#f97316";
        ctx.lineWidth = 2.5;
        ctx.stroke();
      });
    }

    // Draw data points
    const xScale = d3.scaleLinear().domain([lo, hi]).range([0, width]);
    const yScale = d3.scaleLinear().domain([lo, hi]).range([0, height]);

    dataPoints.forEach((p) => {
      ctx.beginPath();
      ctx.arc(xScale(p.x), yScale(p.y), 4, 0, Math.PI * 2);
      ctx.fillStyle = p.c === 0 ? "#3b82f6" : "#ef4444";
      ctx.fill();
      ctx.strokeStyle = "#1e293b";
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  }, [dataPoints, algo, degree, gamma, showBoundary, width, height]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-zinc-900 border-zinc-800 p-4">
            <canvas
              ref={canvasRef}
              width={width}
              height={height}
              className="rounded-lg bg-zinc-950 w-full max-w-[500px]"
            />
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="bg-zinc-900 border-zinc-800 p-4 space-y-4">
            <h3 className="text-sm font-semibold text-zinc-200">
              Boundary Type
            </h3>
            <div className="flex gap-2">
              {(["linear", "polynomial", "rbf"] as const).map((a) => (
                <Button
                  key={a}
                  variant={algo === a ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setAlgo(a)}
                  className={
                    algo === a ? "bg-orange-600 text-white" : "text-zinc-400"
                  }
                >
                  {a.charAt(0).toUpperCase() + a.slice(1)}
                </Button>
              ))}
            </div>

            {algo === "polynomial" && (
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-xs text-zinc-400">Degree</label>
                  <Badge variant="secondary" className="text-xs font-mono">
                    {degree}
                  </Badge>
                </div>
                <Slider
                  value={[degree]}
                  onValueChange={(v) => setDegree(Array.isArray(v) ? v[0] : v)}
                  min={1}
                  max={5}
                  step={1}
                />
              </div>
            )}

            {algo === "rbf" && (
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-xs text-zinc-400">Gamma</label>
                  <Badge variant="secondary" className="text-xs font-mono">
                    {gamma}
                  </Badge>
                </div>
                <Slider
                  value={[gamma]}
                  onValueChange={(v) => setGamma(Array.isArray(v) ? v[0] : v)}
                  min={0.1}
                  max={5}
                  step={0.1}
                />
              </div>
            )}

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs text-zinc-400">Noise</label>
                <Badge variant="secondary" className="text-xs font-mono">
                  {noise}
                </Badge>
              </div>
              <Slider
                value={[noise]}
                onValueChange={(v) => setNoise(Array.isArray(v) ? v[0] : v)}
                min={0.1}
                max={1}
                step={0.1}
              />
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setAlgo("linear");
                setDegree(2);
                setGamma(1.0);
                setNoise(0.3);
              }}
              className="text-xs"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset
            </Button>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 p-4">
            <h3 className="text-sm font-semibold text-zinc-200 mb-2">
              What&apos;s happening?
            </h3>
            <div className="text-xs text-zinc-400 space-y-2">
              <p>
                The <span className="text-orange-400">orange line</span> is the
                decision boundary — where the model is uncertain (probability =
                0.5).
              </p>
              <p>
                <span className="text-blue-400">Blue points</span> are class 0, <span className="text-red-400">red points</span> are class 1.
              </p>
              <p>
                {algo === "linear" && "Linear boundaries are straight lines. Simple but limited."}
                {algo === "polynomial" && `Polynomial degree ${degree} creates curved boundaries. Higher degree = more complex but risk overfitting.`}
                {algo === "rbf" && `RBF kernel with γ=${gamma} creates local boundaries around each point. Higher γ = tighter boundaries.`}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
