"use client";

import { useEffect, useRef, useMemo } from "react";
import * as d3 from "d3";

interface Point {
  x: number;
  y: number;
  predicted?: number;
  cluster?: number;
  correct?: boolean;
  predicted_class?: number;
}

interface Centroid {
  x: number;
  y: number;
}

interface ScatterPlotProps {
  points: Point[];
  line?: { x: number; y: number }[];
  centroids?: Centroid[];
  supportVectors?: Point[];
  width?: number;
  height?: number;
  showRegressionLine?: boolean;
  showDecisionBoundary?: boolean;
  decisionBoundary?: number[][];
}

const clusterColors = ["#3b82f6", "#ef4444", "#22c55e", "#eab308", "#a855f7", "#06b6d4", "#f97316", "#ec4899"];

export function ScatterPlot({
  points,
  line,
  centroids,
  supportVectors,
  width = 600,
  height = 400,
  showRegressionLine = true,
  showDecisionBoundary = true,
  decisionBoundary,
}: ScatterPlotProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const margin = useMemo(() => ({ top: 20, right: 20, bottom: 40, left: 50 }), []);

  useEffect(() => {
    if (!svgRef.current || points.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const xExtent = d3.extent(points, (d) => d.x) as [number, number];
    const yExtent = d3.extent(points, (d) => d.y) as [number, number];
    const allY = [...(yExtent as number[])];
    if (line) {
      const ly = d3.extent(line, (d) => d.y) as [number, number];
      allY.push(ly[0]!, ly[1]!);
    }

    const xScale = d3
      .scaleLinear()
      .domain([xExtent[0]! - 1, xExtent[1]! + 1])
      .range([0, innerW]);

    const yScale = d3
      .scaleLinear()
      .domain([d3.min(allY)! - 1, d3.max(allY)! + 1])
      .range([innerH, 0]);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Grid
    g.append("g")
      .attr("transform", `translate(0,${innerH})`)
      .call(d3.axisBottom(xScale).tickSize(-innerH).tickFormat(() => ""))
      .selectAll("line")
      .attr("stroke", "#27272a")
      .attr("stroke-dasharray", "2,2");

    g.append("g")
      .call(d3.axisLeft(yScale).tickSize(-innerW).tickFormat(() => ""))
      .selectAll("line")
      .attr("stroke", "#27272a")
      .attr("stroke-dasharray", "2,2");

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${innerH})`)
      .call(d3.axisBottom(xScale).ticks(6))
      .selectAll("text")
      .attr("fill", "#71717a");

    g.append("g")
      .call(d3.axisLeft(yScale).ticks(6))
      .selectAll("text")
      .attr("fill", "#71717a");

    g.selectAll(".domain, .tick line").attr("stroke", "#3f3f46");

    // Decision boundary heatmap
    if (showDecisionBoundary && decisionBoundary && decisionBoundary.length > 0) {
      const rows = decisionBoundary.length;
      const cols = decisionBoundary[0].length;
      const cellW = innerW / cols;
      const cellH = innerH / rows;

      const vals = decisionBoundary.flat();
      const vMin = Math.min(...vals);
      const vMax = Math.max(...vals);

      const colorScale = d3
        .scaleSequential(d3.interpolateRdBu)
        .domain([vMax, vMin]);

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          g.append("rect")
            .attr("x", j * cellW)
            .attr("y", i * cellH)
            .attr("width", cellW + 1)
            .attr("height", cellH + 1)
            .attr("fill", colorScale(decisionBoundary[i][j]))
            .attr("opacity", 0.25);
        }
      }
    }

    // Regression line
    if (showRegressionLine && line && line.length > 0) {
      const lineGen = d3
        .line<{ x: number; y: number }>()
        .x((d) => xScale(d.x))
        .y((d) => yScale(d.y))
        .curve(d3.curveLinear);

      g.append("path")
        .datum(line)
        .attr("d", lineGen)
        .attr("fill", "none")
        .attr("stroke", "#f97316")
        .attr("stroke-width", 2.5)
        .attr("stroke-linecap", "round");
    }

    // Support vectors
    if (supportVectors && supportVectors.length > 0) {
      g.selectAll(".sv")
        .data(supportVectors)
        .join("circle")
        .attr("class", "sv")
        .attr("cx", (d) => xScale(d.x))
        .attr("cy", (d) => yScale(d.y))
        .attr("r", 7)
        .attr("fill", "none")
        .attr("stroke", "#f97316")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "3,2");
    }

    // Centroids
    if (centroids && centroids.length > 0) {
      g.selectAll(".centroid")
        .data(centroids)
        .join("circle")
        .attr("class", "centroid")
        .attr("cx", (d) => xScale(d.x))
        .attr("cy", (d) => yScale(d.y))
        .attr("r", 8)
        .attr("fill", "#f97316")
        .attr("stroke", "#fff")
        .attr("stroke-width", 2);

      g.selectAll(".centroid-label")
        .data(centroids)
        .join("text")
        .attr("class", "centroid-label")
        .attr("x", (d) => xScale(d.x))
        .attr("y", (d) => yScale(d.y) - 12)
        .attr("text-anchor", "middle")
        .attr("fill", "#f97316")
        .attr("font-size", "10px")
        .attr("font-weight", "bold")
        .text("C");
    }

    // Data points
    g.selectAll(".data-point")
      .data(points)
      .join("circle")
      .attr("class", "data-point")
      .attr("cx", (d) => xScale(d.x))
      .attr("cy", (d) => yScale(d.y))
      .attr("r", 4)
      .attr("fill", (d) =>
        d.cluster !== undefined
          ? clusterColors[d.cluster % clusterColors.length]
          : "#60a5fa"
      )
      .attr("opacity", 0.8)
      .attr("stroke", "#1e293b")
      .attr("stroke-width", 1);

    // Residual lines for regression
    if (showRegressionLine && points[0]?.predicted !== undefined) {
      g.selectAll(".residual")
        .data(points)
        .join("line")
        .attr("class", "residual")
        .attr("x1", (d) => xScale(d.x))
        .attr("y1", (d) => yScale(d.y))
        .attr("x2", (d) => xScale(d.x))
        .attr("y2", (d) => yScale(d.predicted!))
        .attr("stroke", "#ef4444")
        .attr("stroke-width", 0.8)
        .attr("stroke-dasharray", "3,2")
        .attr("opacity", 0.4);
    }
  }, [points, line, centroids, supportVectors, width, height, margin, showRegressionLine, showDecisionBoundary, decisionBoundary]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      className="rounded-lg bg-zinc-950 w-full"
    />
  );
}
