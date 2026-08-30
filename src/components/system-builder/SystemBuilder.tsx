"use client";

import { useState, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Database,
  Cpu,
  BarChart3,
  Rocket,
  Settings,
  Trash2,
  Play,
  CheckCircle,
  AlertCircle,
  GripVertical,
  ArrowRight,
} from "lucide-react";

interface PipelineNode {
  id: string;
  type: string;
  label: string;
  icon: React.ReactNode;
  x: number;
  y: number;
  config: Record<string, unknown>;
  status: "idle" | "running" | "completed" | "error";
}

interface Connection {
  id: string;
  from: string;
  to: string;
}

const nodeTypes = [
  {
    type: "data-source",
    label: "Data Source",
    icon: <Database className="w-4 h-4" />,
    color: "bg-blue-900/50 border-blue-700",
    config: { format: "csv", source: "upload" },
  },
  {
    type: "feature-eng",
    label: "Feature Engineering",
    icon: <Settings className="w-4 h-4" />,
    color: "bg-purple-900/50 border-purple-700",
    config: { operations: ["normalize", "encode"] },
  },
  {
    type: "model",
    label: "Model Training",
    icon: <Cpu className="w-4 h-4" />,
    color: "bg-orange-900/50 border-orange-700",
    config: { algorithm: "random-forest", epochs: 100 },
  },
  {
    type: "evaluation",
    label: "Evaluation",
    icon: <BarChart3 className="w-4 h-4" />,
    color: "bg-emerald-900/50 border-emerald-700",
    config: { metrics: ["accuracy", "f1"] },
  },
  {
    type: "deploy",
    label: "Deployment",
    icon: <Rocket className="w-4 h-4" />,
    color: "bg-red-900/50 border-red-700",
    config: { target: "api" },
  },
];

export function SystemBuilder() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const nodeCounterRef = useRef(0);
  const connCounterRef = useRef(0);
  const [nodes, setNodes] = useState<PipelineNode[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [connecting, setConnecting] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const addNode = (type: string) => {
    const nodeType = nodeTypes.find((n) => n.type === type);
    if (!nodeType) return;

    nodeCounterRef.current += 1;
    const offsetIndex = nodeCounterRef.current;
    const newNode: PipelineNode = {
      id: `node-${offsetIndex}`,
      type,
      label: nodeType.label,
      icon: nodeType.icon,
      x: 200 + ((offsetIndex * 40) % 200),
      y: 100 + ((offsetIndex * 35) % 200),
      config: { ...nodeType.config },
      status: "idle",
    };

    setNodes((prev) => [...prev, newNode]);
  };

  const removeNode = (id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setConnections((prev) => prev.filter((c) => c.from !== id && c.to !== id));
    if (selectedNode === id) setSelectedNode(null);
  };

  const startConnect = (nodeId: string) => {
    setConnecting(nodeId);
  };

  const endConnect = (nodeId: string) => {
    if (connecting && connecting !== nodeId) {
      const exists = connections.some(
        (c) => c.from === connecting && c.to === nodeId
      );
      if (!exists) {
        connCounterRef.current += 1;
        const newConn: Connection = {
          id: `conn-${connCounterRef.current}`,
          from: connecting,
          to: nodeId,
        };
        setConnections((prev) => [...prev, newConn]);
      }
    }
    setConnecting(null);
  };

  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    if (connecting) {
      endConnect(nodeId);
      return;
    }
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;
    setDraggingNode(nodeId);
    setDragOffset({
      x: e.clientX - node.x,
      y: e.clientY - node.y,
    });
    setSelectedNode(nodeId);
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!draggingNode) return;
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      setNodes(
        nodes.map((n) =>
          n.id === draggingNode
            ? { ...n, x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y }
            : n
        )
      );
    },
    [draggingNode, dragOffset, nodes]
  );

  const handleMouseUp = useCallback(() => {
    setDraggingNode(null);
  }, []);

  const runPipeline = async () => {
    setIsRunning(true);
    for (const node of nodes) {
      setNodes((prev) =>
        prev.map((n) => (n.id === node.id ? { ...n, status: "running" } : n))
      );
      await new Promise((r) => setTimeout(r, 800));
      setNodes((prev) =>
        prev.map((n) => (n.id === node.id ? { ...n, status: "completed" } : n))
      );
    }
    setIsRunning(false);
  };

  const getNodeColor = (type: string) =>
    nodeTypes.find((n) => n.type === type)?.color || "bg-zinc-800 border-zinc-700";

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-3 h-3 text-emerald-400" />;
      case "running":
        return <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse" />;
      case "error":
        return <AlertCircle className="w-3 h-3 text-red-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Database className="w-6 h-6 text-orange-400" />
          ML System Builder
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Drag and drop components to design your ML pipeline. Connect nodes and
          watch data flow through.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Toolbox */}
        <div className="space-y-4">
          <Card className="bg-zinc-900 border-zinc-800 p-4">
            <h3 className="text-sm font-semibold text-zinc-200 mb-3">
              Components
            </h3>
            <div className="space-y-2">
              {nodeTypes.map((nt) => (
                <Button
                  key={nt.type}
                  variant="outline"
                  size="sm"
                  onClick={() => addNode(nt.type)}
                  className={`w-full justify-start ${nt.color}`}
                >
                  <GripVertical className="w-3 h-3 mr-2 text-zinc-500" />
                  {nt.icon}
                  <span className="ml-2">{nt.label}</span>
                </Button>
              ))}
            </div>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 p-4">
            <h3 className="text-sm font-semibold text-zinc-200 mb-3">
              Actions
            </h3>
            <div className="space-y-2">
              <Button
                onClick={runPipeline}
                disabled={isRunning || nodes.length === 0}
                className="w-full bg-orange-600 hover:bg-orange-700"
                size="sm"
              >
                <Play className="w-3 h-3 mr-1" />
                {isRunning ? "Running..." : "Run Pipeline"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setNodes([]);
                  setConnections([]);
                  setSelectedNode(null);
                }}
                className="w-full text-red-400"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Clear All
              </Button>
            </div>
          </Card>

          {selectedNode && (
            <Card className="bg-zinc-900 border-zinc-800 p-4">
              <h3 className="text-sm font-semibold text-zinc-200 mb-3">
                Node Config
              </h3>
              <div className="space-y-2 text-xs text-zinc-400">
                <p>
                  <span className="text-zinc-500">Type:</span>{" "}
                  {nodes.find((n) => n.id === selectedNode)?.type}
                </p>
                <p>
                  <span className="text-zinc-500">Status:</span>{" "}
                  {nodes.find((n) => n.id === selectedNode)?.status}
                </p>
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startConnect(selectedNode)}
                    className="w-full text-xs"
                  >
                    <ArrowRight className="w-3 h-3 mr-1" />
                    Connect to...
                  </Button>
                </div>
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeNode(selectedNode)}
                    className="w-full text-xs text-red-400"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Legend */}
          <Card className="bg-zinc-900 border-zinc-800 p-4">
            <h3 className="text-sm font-semibold text-zinc-200 mb-2">
              How It Works
            </h3>
            <div className="space-y-1 text-xs text-zinc-500">
              <p>1. Add components from the toolbox</p>
              <p>2. Click a node, then &quot;Connect to...&quot;</p>
              <p>3. Click another node to link them</p>
              <p>4. Click &quot;Run Pipeline&quot; to simulate</p>
            </div>
          </Card>
        </div>

        {/* Canvas */}
        <div className="lg:col-span-3">
          <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
            <div
              ref={canvasRef}
              className="relative w-full h-[600px] bg-zinc-950 cursor-crosshair overflow-hidden"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* Grid background */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />

              {/* SVG for connections */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {connections.map((conn) => {
                  const fromNode = nodes.find((n) => n.id === conn.from);
                  const toNode = nodes.find((n) => n.id === conn.to);
                  if (!fromNode || !toNode) return null;

                  const fromX = fromNode.x + 80;
                  const fromY = fromNode.y + 25;
                  const toX = toNode.x;
                  const toY = toNode.y + 25;

                  return (
                    <g key={conn.id}>
                      <path
                        d={`M ${fromX} ${fromY} C ${fromX + 50} ${fromY}, ${toX - 50} ${toY}, ${toX} ${toY}`}
                        stroke="#f97316"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray="5,5"
                      />
                      <circle cx={toX} cy={toY} r="4" fill="#f97316" />
                    </g>
                  );
                })}
              </svg>

              {/* Nodes */}
              {nodes.map((node) => (
                <div
                  key={node.id}
                  className={`absolute cursor-move select-none border-2 rounded-lg p-3 min-w-[160px] ${
                    getNodeColor(node.type)
                  } ${selectedNode === node.id ? "ring-2 ring-orange-500" : ""} ${
                    draggingNode === node.id ? "opacity-80" : ""
                  }`}
                  style={{ left: node.x, top: node.y }}
                  onMouseDown={(e) => handleMouseDown(e, node.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {node.icon}
                      <span className="text-sm font-medium">{node.label}</span>
                    </div>
                    {getStatusIcon(node.status)}
                  </div>
                </div>
              ))}

              {nodes.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-zinc-600">
                  <div className="text-center">
                    <Database className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">
                      Add components from the toolbox to start building
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
