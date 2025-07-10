"use client";
import React, { useEffect, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  MarkerType,
  useNodesState,
  useEdgesState,
  addEdge,
  Edge,
  Node,
  NodeChange,
  Viewport,
  OnConnect,
  EdgeChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useDatabaseStore } from "@/stores/useDatabaseStore";
import DataTableNode from "@/components/whiteboard/nodes/dataTableNode/DataTableNode";
import LayerControlls from "@/components/whiteboard/controlls/LayerControlls";

const LayerPage = () => {
  const nodeTypes = {
    dataTableNode: DataTableNode,
  };

  const {
    updateTablePosition,
    viewport,
    updateViewport,
    getProjectTableEdges,
    tableEdgeState,
    tableNodeState,
    getProjectTableNodes,
    addTableEdge,
    updateTableEdges,
  } = useDatabaseStore();

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
          updateTablePosition(change.id, change.position);
        }
      });
    },
    [onNodesChange, updateTablePosition]
  );

  const handleViewportChange = useCallback(
    (newViewport: Viewport) => {
      updateViewport(newViewport);
    },
    [updateViewport]
  );

  useEffect(() => {
    const stateNodes = getProjectTableNodes();
    const stateEdges = getProjectTableEdges();

    const newNodes = [...stateNodes];
    const newEdges = [...stateEdges];

    setNodes(newNodes);
    setEdges(newEdges);
  }, [
    getProjectTableNodes,
    getProjectTableEdges,
    setNodes,
    setEdges,
    tableEdgeState,
    tableNodeState,
  ]);

  const onConnect: OnConnect = useCallback(
    (params) => {
      const newEdge = {
        ...params,
        id: `edge-${params.source}-${params.target}`,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#737373",
        },
        style: { stroke: "#737373", strokeWidth: 2 },
        type: "bezier",
      } as Edge;

      setEdges((eds) => addEdge(newEdge, eds));
      addTableEdge(newEdge);
    },
    [setEdges, addTableEdge]
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      onEdgesChange(changes);

      setTimeout(() => {
        setEdges((currentEdges) => {
          updateTableEdges(currentEdges);
          return currentEdges;
        });
      }, 0);
    },
    [onEdgesChange, setEdges, updateTableEdges]
  );

  return (
    <div className="h-[90vh] w-full relative rounded-xl bg-theme-gray">
      <LayerControlls />
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
        onEdgesChange={handleEdgesChange}
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

export default LayerPage;
