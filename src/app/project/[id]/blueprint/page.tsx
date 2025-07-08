"use client";
import React, { useCallback, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  type OnConnect,
  type Edge,
  type Node,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { BaseNode } from "@/components/base-node";
import HomeNode from "./nodes/HomeNode";
import LayerNode from "./nodes/LayerNode";
import { Monitor, Server, Database, Cloud, Settings, Plus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const layerOptions = [
  { type: "frontend", label: "Frontend", icon: Monitor },
  { type: "backend", label: "Backend", icon: Server },
  { type: "database", label: "Database", icon: Database },
  { type: "infrastructure", label: "Infrastructure", icon: Cloud },
  { type: "integration", label: "Integration", icon: Settings },
];

const CustomControls = ({
  onCreateLayer,
}: {
  onCreateLayer: (layerType: string) => void;
}) => {
  const [open, setOpen] = useState(false);

  const handleCreateLayer = (layerType: string) => {
    onCreateLayer(layerType);
    setOpen(false);
  };

  return (
    <div className="absolute top-5 left-5 flex gap-2 z-10">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="px-3 py-2 bg-theme-bg text-neutral-300 cursor-pointer hover:bg-theme-gray hover:border-theme-pink border border-neutral-600 rounded-md transition-colors flex items-center gap-2">
            <Plus size={16} />
            Create Layer
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-0 bg-theme-bg border-neutral-600">
          <div className="grid">
            {layerOptions.map((layer) => {
              const LayerIcon = layer.icon;
              return (
                <button
                  key={layer.type}
                  onClick={() => handleCreateLayer(layer.type)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-theme-gray transition-colors text-left"
                >
                  <LayerIcon size={18} className="text-neutral-400" />
                  <span className="text-neutral-300">{layer.label}</span>
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>

      <button className="px-3 py-2 bg-theme-bg text-neutral-300 cursor-pointer rounded-md hover:bg-theme-gray hover:border-theme-pink border border-neutral-600 transition-colors">
        Create Node
      </button>
      <button className="px-3 py-2 bg-theme-bg text-neutral-300 cursor-pointer rounded-md hover:bg-theme-gray hover:border-theme-pink border border-neutral-600 transition-colors">
        Create Textbox
      </button>
    </div>
  );
};

const initialEdges: Edge[] = [
  {
    id: "home-layer1",
    source: "home",
    target: "layer1",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#737373",
    },
    style: { stroke: "#737373", strokeWidth: 2 },
    type: "bezier",
  },
  {
    id: "home-layer2",
    source: "home",
    target: "layer2",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#737373",
    },
    style: { stroke: "#737373", strokeWidth: 2 },
    type: "bezier",
  },
];

const nodeTypes = {
  baseNode: BaseNode,
  layerNode: LayerNode,
  architectureNode: HomeNode,
};

const BlueprintPage = () => {
  const initialNodes: Node[] = [
    {
      id: "home",
      type: "architectureNode",
      position: { x: 700, y: 100 },
      data: {
        label: "Course Platform",
        type: "home",
      },
      deletable: false,
      draggable: true,
    },
    {
      id: "layer1",
      type: "layerNode",
      position: { x: 100, y: 250 },
      data: {
        label: "Frontend Layer",
        layerType: "frontend",
        cabinets: [{ name: "User Interface" }, { name: "Authentication" }],
      },
      deletable: true,
      draggable: true,
    },
    {
      id: "layer2",
      type: "layerNode",
      position: { x: 450, y: 250 },
      data: {
        label: "Backend Layer",
        layerType: "backend",
        cabinets: [{ name: "API Services" }, { name: "Authentication" }],
      },
      deletable: true,
      draggable: true,
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect: OnConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: "#737373",
            },
            style: { stroke: "#737373", strokeWidth: 2 },
            type: "bezier",
          },
          eds
        )
      ),
    [setEdges]
  );

  const handleCreateLayer = useCallback(
    (layerType: string) => {
      const newId = `layer-${Date.now()}`;
      const newNode: Node = {
        id: newId,
        type: "layerNode",
        position: {
          x: Math.random() * 500 + 100,
          y: Math.random() * 300 + 250,
        },
        data: {
          label: `${layerType.charAt(0).toUpperCase() + layerType.slice(1)} Layer`,
          layerType: layerType,
          cabinets: [],
        },
        deletable: true,
        draggable: true,
      };

      const newEdge: Edge = {
        id: `home-${newId}`,
        source: "home",
        target: newId,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#737373",
        },
        style: { stroke: "#737373", strokeWidth: 2 },
        type: "bezier",
      };

      setNodes((nds) => [...nds, newNode]);
      setEdges((eds) => [...eds, newEdge]);
    },
    [setNodes, setEdges]
  );

  return (
    <div className="h-[90vh] w-full relative rounded-xl bg-theme-gray">
      <CustomControls onCreateLayer={handleCreateLayer} />
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .react-flow-controls-custom {
          background-color: #2d292d !important;
          border: 1px solid #6b7280 !important;
          border-radius: 6px !important;
        }
        .react-flow-controls-custom button {
          background-color: #2d292d !important;
          border: 1px solid #6b7280 !important;
          color: #fff !important;
        }
        .react-flow-controls-custom button:hover {
          background-color: #3f3a3f !important;
        }
        .react-flow-controls-custom svg {
          fill: #fff !important;
        }
        .react-flow__node:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
      `,
        }}
      />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        className="w-full h-full rounded-xl bg-theme-xlgray"
        connectionLineStyle={{ stroke: "#ec4899", strokeWidth: 2 }}
        defaultEdgeOptions={{
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "#737373",
          },
          style: { stroke: "#737373", strokeWidth: 2 },
          type: "bezier",
        }}
      >
        <Background color="#928f94" gap={20} />
        <Controls className="react-flow-controls-custom" />
        <MiniMap
          style={{
            left: 40,
            borderColor: "#6b7280",
          }}
          position="bottom-left"
          nodeStrokeWidth={1}
          pannable
          zoomable
          bgColor="#2d292d"
        />
      </ReactFlow>
    </div>
  );
};

export default BlueprintPage;
