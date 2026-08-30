"use client";

import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { BarChart3, Info } from "lucide-react";

interface Feature {
  name: string;
  importance: number;
  description: string;
}

const presetFeatures: Feature[] = [
  { name: "Age", importance: 0.15, description: "Customer age in years" },
  { name: "Income", importance: 0.35, description: "Annual income ($)" },
  { name: "Credit Score", importance: 0.25, description: "Credit score (300-850)" },
  { name: "Debt Ratio", importance: 0.15, description: "Total debt / total assets" },
  { name: "Account Age", importance: 0.10, description: "Months as customer" },
];

export function FeatureImportanceExplainer() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [features] = useState<Feature[]>(presetFeatures);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [perturbation, setPerturbation] = useState(0);

  // Normalize importance
  const total = features.reduce((s, f) => s + f.importance, 0);
  const normalized = features.map((f) => ({
    ...f,
    normalized: f.importance / total,
  }));

  // Draw chart
  useEffect(() => {
    if (!chartRef.current) return;

    const margin = { top: 20, right: 20, bottom: 30, left: 120 };
    const width = 500 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;

    const svg = d3
      .select(chartRef.current)
      .html("")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const sorted = [...normalized].sort((a, b) => a.normalized - b.normalized);

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(sorted, (d) => d.normalized) || 1])
      .range([0, width]);

    const y = d3
      .scaleBand()
      .domain(sorted.map((d) => d.name))
      .range([0, height])
      .padding(0.3);

    // Bars
    svg
      .selectAll("rect")
      .data(sorted)
      .join("rect")
      .attr("x", 0)
      .attr("y", (d) => y(d.name) || 0)
      .attr("width", (d) => x(d.normalized))
      .attr("height", y.bandwidth())
      .attr("fill", (d) =>
        d.name === selectedFeature ? "#f97316" : "#3f3f46"
      )
      .attr("rx", 4)
      .style("cursor", "pointer")
      .on("click", (_, d) => setSelectedFeature(d.name));

    // Labels
    svg
      .selectAll(".label")
      .data(sorted)
      .join("text")
      .attr("class", "label")
      .attr("x", -8)
      .attr("y", (d) => (y(d.name) || 0) + y.bandwidth() / 2)
      .attr("text-anchor", "end")
      .attr("dominant-baseline", "middle")
      .attr("fill", "#a1a1aa")
      .attr("font-size", "11px")
      .text((d) => d.name);

    // Values
    svg
      .selectAll(".value")
      .data(sorted)
      .join("text")
      .attr("class", "value")
      .attr("x", (d) => x(d.normalized) + 5)
      .attr("y", (d) => (y(d.name) || 0) + y.bandwidth() / 2)
      .attr("dominant-baseline", "middle")
      .attr("fill", "#a1a1aa")
      .attr("font-size", "11px")
      .text((d) => `${(d.normalized * 100).toFixed(1)}%`);
  }, [normalized, selectedFeature]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-orange-400" />
          Feature Importance
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          See which features drive your model&apos;s predictions. Understanding
          feature importance is key to building trustworthy ML systems.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-zinc-900 border-zinc-800 p-4">
            <h3 className="text-sm font-semibold text-zinc-200 mb-4">
              Feature Importance Rankings
            </h3>
            <div ref={chartRef} className="w-full" />
          </Card>

          {selectedFeature && (
            <Card className="bg-zinc-900 border-zinc-800 p-4">
              <h3 className="text-sm font-semibold text-zinc-200 mb-2">
                {selectedFeature}
              </h3>
              <p className="text-xs text-zinc-400 mb-3">
                {features.find((f) => f.name === selectedFeature)?.description}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-800 rounded-lg p-3">
                  <p className="text-xs text-zinc-500">Raw Importance</p>
                  <p className="text-lg font-bold text-orange-400">
                    {features
                      .find((f) => f.name === selectedFeature)
                      ?.importance.toFixed(3)}
                  </p>
                </div>
                <div className="bg-zinc-800 rounded-lg p-3">
                  <p className="text-xs text-zinc-500">Normalized</p>
                  <p className="text-lg font-bold text-blue-400">
                    {(
                      (features.find((f) => f.name === selectedFeature)
                        ?.importance || 0) / total * 100
                    ).toFixed(1)}
                    %
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card className="bg-zinc-900 border-zinc-800 p-4">
            <h3 className="text-sm font-semibold text-zinc-200 mb-3">
              What is Feature Importance?
            </h3>
            <div className="space-y-2 text-xs text-zinc-400">
              <p>
                Feature importance tells you how much each input variable
                contributes to the model&apos;s predictions.
              </p>
              <p>
                <span className="text-orange-400">Higher importance</span> means
                the feature has more influence on the output.
              </p>
              <p>
                Use this to understand your model, remove irrelevant features, and
                explain decisions to stakeholders.
              </p>
            </div>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 p-4">
            <h3 className="text-sm font-semibold text-zinc-200 mb-3 flex items-center gap-1">
              <Info className="w-4 h-4 text-blue-400" />
              How to Read This
            </h3>
            <div className="space-y-2 text-xs text-zinc-400">
              <p>
                <span className="text-zinc-300">Bar length</span> shows relative
                importance
              </p>
              <p>
                <span className="text-zinc-300">Click a bar</span> to see details
                about that feature
              </p>
              <p>
                <span className="text-zinc-300">Normalized values</span> sum to
                100%
              </p>
            </div>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 p-4">
            <h3 className="text-sm font-semibold text-zinc-200 mb-3">
              Perturbation Experiment
            </h3>
            <p className="text-xs text-zinc-400 mb-3">
              See what happens when you change a feature&apos;s value.
            </p>
            <div className="mb-2">
              <div className="flex justify-between mb-1">
                <label className="text-xs text-zinc-500">
                  Perturbation Amount
                </label>
                <Badge variant="secondary" className="text-xs font-mono">
                  ±{perturbation}%
                </Badge>
              </div>
              <Slider
                value={[perturbation]}
                onValueChange={(v) => setPerturbation(Array.isArray(v) ? v[0] : v)}
                min={0}
                max={50}
                step={5}
              />
            </div>
            <div className="text-xs text-zinc-500">
              {perturbation > 0
                ? `If you change a feature by ${perturbation}%, the prediction impact depends on that feature's importance.`
                : "Set perturbation > 0 to see the effect."}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
