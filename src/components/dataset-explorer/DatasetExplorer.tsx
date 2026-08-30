"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { usePyodide } from "@/hooks/usePyodide";
import * as d3 from "d3";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Database,
  BarChart3,
  ScatterChart,
  AlertTriangle,
} from "lucide-react";

interface ColumnInfo {
  name: string;
  dtype: string;
  missing: number;
  unique: number;
  mean?: number;
  std?: number;
  min?: number;
  max?: number;
  top?: string;
}

interface DatasetStats {
  rows: number;
  columns: number;
  columnInfo: ColumnInfo[];
  correlationMatrix?: number[][];
  missingTotal: number;
}

interface RawDataset {
  X: number[][];
  y: number[];
  columns: string[];
  target_names?: string[];
}

const SAMPLE_DATASETS = [
  {
    name: "Iris",
    code: `import json
from sklearn.datasets import load_iris
iris = load_iris()
X = iris.data.tolist()
y = iris.target.tolist()
cols = iris.feature_names
json.dumps({"X": X, "y": y, "columns": cols, "target_names": iris.target_names.tolist()})`,
  },
  {
    name: "Wine",
    code: `import json
from sklearn.datasets import load_wine
wine = load_wine()
X = wine.data.tolist()
y = wine.target.tolist()
cols = wine.feature_names
json.dumps({"X": X, "y": y, "columns": cols, "target_names": wine.target_names.tolist()})`,
  },
  {
    name: "Breast Cancer",
    code: `import json
from sklearn.datasets import load_breast_cancer
bc = load_breast_cancer()
X = bc.data.tolist()
y = bc.target.tolist()
cols = bc.feature_names
json.dumps({"X": X, "y": y, "columns": cols, "target_names": bc.target_names.tolist()})`,
  },
];

export function DatasetExplorer() {
  const { isReady, run } = usePyodide();
  const [dataset, setDataset] = useState<RawDataset | null>(null);
  const [stats, setStats] = useState<DatasetStats | null>(null);
  const [selectedCol, setSelectedCol] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeViz, setActiveViz] = useState<"distributions" | "correlations" | "scatter">("distributions");
  const histRef = useRef<SVGSVGElement>(null);
  const corrRef = useRef<SVGSVGElement>(null);

  const loadDataset = useCallback(
    async (index: number) => {
      if (!isReady) return;
      setIsLoading(true);
      try {
        const data = await run<RawDataset>(SAMPLE_DATASETS[index].code);
        if (!data) return;
        setDataset(data);

        // Compute stats
        const colInfo: ColumnInfo[] = data.columns.map((col: string, i: number) => {
          const values = data.X.map((row: number[]) => row[i]);
          const numValues = values.filter((v: number) => v !== null && v !== undefined);
          return {
            name: col,
            dtype: typeof numValues[0] === "number" ? "float64" : "object",
            missing: values.length - numValues.length,
            unique: new Set(values).size,
            mean: numValues.length > 0 ? d3.mean(numValues as number[]) : undefined,
            std: numValues.length > 0 ? d3.deviation(numValues as number[]) : undefined,
            min: numValues.length > 0 ? d3.min(numValues as number[]) : undefined,
            max: numValues.length > 0 ? d3.max(numValues as number[]) : undefined,
          };
        });

        setStats({
          rows: data.X.length,
          columns: data.columns.length,
          columnInfo: colInfo,
          missingTotal: colInfo.reduce((sum, c) => sum + c.missing, 0),
        });
      } catch (err) {
        console.error("Dataset load error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [isReady, run]
  );

  // Draw distribution histogram
  useEffect(() => {
    if (!dataset || !histRef.current || !selectedCol) return;

    const svg = d3.select(histRef.current);
    svg.selectAll("*").remove();

    const colIdx = dataset.columns.indexOf(selectedCol);
    const values = dataset.X.map((row: number[]) => row[colIdx]).filter((v: number) => v != null);

    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const width = 500 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    const extent = d3.extent(values) as unknown as [number, number];
    const x = d3.scaleLinear()
      .domain(extent)
      .range([0, width]);

    const histogram = d3.bin().domain(x.domain() as [number, number]).thresholds(20);
    const bins = histogram(values);

    const y = d3.scaleLinear()
      .domain([0, d3.max(bins, (d) => d.length) ?? 0])
      .range([height, 0]);

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    g.selectAll("rect")
      .data(bins)
      .join("rect")
      .attr("x", (d) => x(d.x0!) + 1)
      .attr("width", (d) => Math.max(0, x(d.x1!) - x(d.x0!) - 2))
      .attr("y", (d) => y(d.length))
      .attr("height", (d) => height - y(d.length))
      .attr("fill", "#f97316")
      .attr("opacity", 0.7);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(6))
      .selectAll("text")
      .attr("fill", "#71717a");

    g.append("g")
      .call(d3.axisLeft(y).ticks(4))
      .selectAll("text")
      .attr("fill", "#71717a");

    g.selectAll(".domain, .tick line").attr("stroke", "#3f3f46");
  }, [dataset, selectedCol]);

  // Draw correlation heatmap
  useEffect(() => {
    if (!dataset || !corrRef.current) return;

    const svg = d3.select(corrRef.current);
    svg.selectAll("*").remove();

    const n = dataset.columns.length;
    const corr: number[][] = [];

    for (let i = 0; i < n; i++) {
      corr[i] = [];
      for (let j = 0; j < n; j++) {
        const xi = dataset.X.map((row: number[]) => row[i]);
        const xj = dataset.X.map((row: number[]) => row[j]);
        const mi = d3.mean(xi) ?? 0;
        const mj = d3.mean(xj) ?? 0;
        const si = d3.deviation(xi) ?? 1;
        const sj = d3.deviation(xj) ?? 1;
        const cov = d3.mean(xi.map((v: number, k: number) => (v - mi) * (xj[k] - mj))) ?? 0;
        corr[i][j] = cov / (si * sj + 1e-8);
      }
    }

    const margin = { top: 20, right: 20, bottom: 60, left: 60 };
    const size = Math.min(400, window.innerWidth - 100);
    const cellSize = (size - margin.left - margin.right) / n;

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const color = d3.scaleSequential(d3.interpolateRdBu).domain([1, -1]);

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        g.append("rect")
          .attr("x", j * cellSize)
          .attr("y", i * cellSize)
          .attr("width", cellSize)
          .attr("height", cellSize)
          .attr("fill", color(corr[i][j]))
          .attr("stroke", "#18181b")
          .attr("stroke-width", 1);
      }
    }

    // Labels
    for (let i = 0; i < n; i++) {
      g.append("text")
        .attr("x", i * cellSize + cellSize / 2)
        .attr("y", n * cellSize + 12)
        .attr("text-anchor", "middle")
        .attr("fill", "#71717a")
        .attr("font-size", "9px")
        .text(dataset.columns[i].substring(0, 8));

      g.append("text")
        .attr("x", -8)
        .attr("y", i * cellSize + cellSize / 2 + 3)
        .attr("text-anchor", "end")
        .attr("fill", "#71717a")
        .attr("font-size", "9px")
        .text(dataset.columns[i].substring(0, 8));
    }
  }, [dataset, activeViz]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Database className="w-6 h-6 text-orange-400" />
          Dataset Explorer
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Load, visualize, and understand datasets before modeling.
        </p>
      </div>

      {/* Load dataset */}
      <Card className="bg-zinc-900 border-zinc-800 p-5">
        <h3 className="text-sm font-semibold text-zinc-200 mb-3">
          Load a Dataset
        </h3>
        <div className="flex gap-3">
          {SAMPLE_DATASETS.map((ds, i) => (
            <Button
              key={ds.name}
              variant="outline"
              size="sm"
              onClick={() => loadDataset(i)}
              disabled={!isReady || isLoading}
              className="border-zinc-700"
            >
              {isLoading ? "Loading..." : ds.name}
            </Button>
          ))}
        </div>
      </Card>

      {stats && (
        <>
          {/* Stats overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-zinc-900 border-zinc-800 p-4">
              <div className="text-xs text-zinc-500">Rows</div>
              <div className="text-xl font-mono font-bold text-zinc-200">
                {stats.rows.toLocaleString()}
              </div>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800 p-4">
              <div className="text-xs text-zinc-500">Columns</div>
              <div className="text-xl font-mono font-bold text-zinc-200">
                {stats.columns}
              </div>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800 p-4">
              <div className="text-xs text-zinc-500">Missing Values</div>
              <div
                className={`text-xl font-mono font-bold ${
                  stats.missingTotal > 0 ? "text-amber-400" : "text-emerald-400"
                }`}
              >
                {stats.missingTotal}
              </div>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800 p-4">
              <div className="text-xs text-zinc-500">Target Classes</div>
              <div className="text-xl font-mono font-bold text-zinc-200">
                {new Set(dataset?.y).size}
              </div>
            </Card>
          </div>

          {/* Column details */}
          <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="px-4 py-2 text-left text-zinc-500 font-medium">
                    Column
                  </th>
                  <th className="px-4 py-2 text-right text-zinc-500 font-medium">
                    Missing
                  </th>
                  <th className="px-4 py-2 text-right text-zinc-500 font-medium">
                    Unique
                  </th>
                  <th className="px-4 py-2 text-right text-zinc-500 font-medium">
                    Mean
                  </th>
                  <th className="px-4 py-2 text-right text-zinc-500 font-medium">
                    Std
                  </th>
                  <th className="px-4 py-2 text-right text-zinc-500 font-medium">
                    Min
                  </th>
                  <th className="px-4 py-2 text-right text-zinc-500 font-medium">
                    Max
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.columnInfo.map((col) => (
                  <tr
                    key={col.name}
                    onClick={() => setSelectedCol(col.name)}
                    className={`border-b border-zinc-800/50 cursor-pointer transition-colors ${
                      selectedCol === col.name
                        ? "bg-orange-950/20 border-orange-500/30"
                        : "hover:bg-zinc-800/50"
                    }`}
                  >
                    <td className="px-4 py-2 font-mono text-zinc-300 text-xs">
                      {col.name}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {col.missing > 0 ? (
                        <Badge className="bg-amber-900/50 text-amber-400 text-xs">
                          {col.missing}
                        </Badge>
                      ) : (
                        <span className="text-zinc-600">0</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-right font-mono text-zinc-400 text-xs">
                      {col.unique}
                    </td>
                    <td className="px-4 py-2 text-right font-mono text-zinc-400 text-xs">
                      {col.mean?.toFixed(2) ?? "-"}
                    </td>
                    <td className="px-4 py-2 text-right font-mono text-zinc-400 text-xs">
                      {col.std?.toFixed(2) ?? "-"}
                    </td>
                    <td className="px-4 py-2 text-right font-mono text-zinc-400 text-xs">
                      {col.min?.toFixed(2) ?? "-"}
                    </td>
                    <td className="px-4 py-2 text-right font-mono text-zinc-400 text-xs">
                      {col.max?.toFixed(2) ?? "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {/* Visualizations */}
          <div className="flex gap-2">
            <Button
              variant={activeViz === "distributions" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveViz("distributions")}
            >
              <BarChart3 className="w-4 h-4 mr-1" />
              Distributions
            </Button>
            <Button
              variant={activeViz === "correlations" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveViz("correlations")}
            >
              <ScatterChart className="w-4 h-4 mr-1" />
              Correlations
            </Button>
          </div>

          {activeViz === "distributions" && selectedCol && (
            <Card className="bg-zinc-900 border-zinc-800 p-4">
              <h3 className="text-sm font-semibold text-zinc-200 mb-3">
                Distribution: {selectedCol}
              </h3>
              <svg ref={histRef} width={500} height={200} className="rounded-lg bg-zinc-950" />
            </Card>
          )}

          {activeViz === "distributions" && !selectedCol && (
            <Card className="bg-zinc-900 border-zinc-800 p-8 text-center text-zinc-500">
              Click a column above to see its distribution
            </Card>
          )}

          {activeViz === "correlations" && (
            <Card className="bg-zinc-900 border-zinc-800 p-4">
              <h3 className="text-sm font-semibold text-zinc-200 mb-3">
                Correlation Matrix
              </h3>
              <svg ref={corrRef} width={500} height={400} className="rounded-lg bg-zinc-950" />
            </Card>
          )}

          {/* AI suggestion */}
          <Card className="bg-zinc-900 border-zinc-800 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
              <div>
                <h3 className="font-semibold text-zinc-200 mb-1">
                  What should I do next?
                </h3>
                <p className="text-sm text-zinc-400">
                  {stats.missingTotal > 0
                    ? `${stats.missingTotal} missing values detected. Consider imputation strategies (mean, median, or model-based).`
                    : "No missing values. Data looks clean. Consider feature scaling if using distance-based algorithms (KNN, SVM)."}
                </p>
              </div>
            </div>
          </Card>
        </>
      )}

      {!dataset && !isLoading && (
        <Card className="bg-zinc-900 border-zinc-800 p-12 text-center">
          <Database className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-500">
            Load a dataset to start exploring
          </p>
        </Card>
      )}
    </div>
  );
}
