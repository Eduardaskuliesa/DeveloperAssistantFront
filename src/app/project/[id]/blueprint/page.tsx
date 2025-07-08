"use client";
import React, { useCallback, useEffect } from "react";
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
  type NodeChange,
  type Viewport,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import CustomControls from "@/components/whiteboard/controlls/RoomControlls";
import HomeNode from "@/components/whiteboard/nodes/HomeNodes";
import LayerNode from "@/components/whiteboard/nodes/LayerNode";
import { useLayerStore } from "@/stores/useLayerStore";

const BlueprintPage = () => {
  const nodeTypes = {
    layerNode: LayerNode,
    architectureNode: HomeNode,
  };
  const {
    layerEdgeState,
    layerNodeState,
    updateLayerPosition,
    viewport,
    updateViewport,
  } = useLayerStore();

  const initialEdges: Edge[] = [];
  const initialNodes: Node[] = [];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes);

      changes.forEach((change) => {
        if (
          change.type === "position" &&
          change.dragging === false &&
          change.position
        ) {
          updateLayerPosition(change.id, change.position);
        }
      });
    },
    [onNodesChange, updateLayerPosition]
  );

  const handleViewportChange = useCallback(
    (newViewport: Viewport) => {
      updateViewport(newViewport);
    },
    [updateViewport]
  );

  useEffect(() => {
    const newEdges = [...layerEdgeState];
    const newNodes = [...layerNodeState];

    setNodes(newNodes);
    setEdges(newEdges);
  }, [layerEdgeState, layerNodeState, setNodes, setEdges]);

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

  return (
    <div className="h-[90vh] w-full relative rounded-xl bg-theme-gray">
      <CustomControls />
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
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        viewport={viewport}
        onViewportChange={handleViewportChange}
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
