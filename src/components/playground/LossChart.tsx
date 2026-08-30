"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface LossChartProps {
  data: number[];
  width?: number;
  height?: number;
  label?: string;
  color?: string;
}

export function LossChart({
  data,
  width = 300,
  height = 150,
  label = "Loss",
  color = "#f97316",
}: LossChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 10, right: 10, bottom: 25, left: 45 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const xScale = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([0, innerW]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data)! * 1.1 || 1])
      .range([innerH, 0]);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Area
    const areaGen = d3
      .area<number>()
      .x((_, i) => xScale(i))
      .y0(innerH)
      .y1((d) => yScale(d))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(data)
      .attr("d", areaGen)
      .attr("fill", color)
      .attr("opacity", 0.15);

    // Line
    const lineGen = d3
      .line<number>()
      .x((_, i) => xScale(i))
      .y((d) => yScale(d))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(data)
      .attr("d", lineGen)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 2);

    // Current point
    const lastIdx = data.length - 1;
    g.append("circle")
      .attr("cx", xScale(lastIdx))
      .attr("cy", yScale(data[lastIdx]))
      .attr("r", 4)
      .attr("fill", color)
      .attr("stroke", "#09090b")
      .attr("stroke-width", 2);

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${innerH})`)
      .call(d3.axisBottom(xScale).ticks(4))
      .selectAll("text")
      .attr("fill", "#71717a")
      .attr("font-size", "10px");

    g.append("g")
      .call(d3.axisLeft(yScale).ticks(4).tickFormat(d3.format(".2f")))
      .selectAll("text")
      .attr("fill", "#71717a")
      .attr("font-size", "10px");

    g.selectAll(".domain, .tick line").attr("stroke", "#3f3f46");

    // Label
    g.append("text")
      .attr("x", 0)
      .attr("y", -4)
      .attr("fill", "#a1a1aa")
      .attr("font-size", "11px")
      .text(label);
  }, [data, width, height, label, color]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      className="rounded-lg bg-zinc-950"
    />
  );
}
