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
import DissconnectTableEdge from "@/components/whiteboard/edges/DissconetTableEdge";
import RowConnectionEdge from "@/components/whiteboard/edges/RowConnectionEdge";
import DatabseLayerControlls from "@/components/whiteboard/controlls/LayerControlls";

const DatabaseLayer = () => {
  const nodeTypes = {
    dataTableNode: DataTableNode,
  };

  const edgeTypes = {
    tableEdge: DissconnectTableEdge,
    rowConnectionEdge: RowConnectionEdge,
  };

  const {
    updateTablePosition,
    getCabinetViewport,
    updateCabinetViewport,
    getActiveCabinetTableEdges,
    tableEdgeState,
    tableNodeState,
    getActiveCabinetTableNodes,
    addTableEdge,
    updateTableEdges,
    activeCabinetId,
  } = useDatabaseStore();

  const initialEdges: Edge[] = [];
  const initialNodes: Node[] = [];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const cabinetViewport = getCabinetViewport();

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
      updateCabinetViewport(newViewport);
    },
    [updateCabinetViewport]
  );

  useEffect(() => {
    const stateNodes = getActiveCabinetTableNodes();
    const stateEdges = getActiveCabinetTableEdges();

    const newNodes = [...stateNodes];
    const newEdges = [...stateEdges];

    setNodes(newNodes);
    setEdges(newEdges);
  }, [
    getActiveCabinetTableNodes, // Update dependency
    getActiveCabinetTableEdges, // Update dependency
    setNodes,
    setEdges,
    tableEdgeState,
    tableNodeState,
    activeCabinetId, // Add this dependency to re-render when cabinet changes
  ]);

  const onConnect: OnConnect = useCallback(
    (params) => {
      const isRowConnection =
        params.sourceHandle &&
        params.targetHandle &&
        params.sourceHandle.includes("-source") &&
        params.targetHandle.includes("-target");

      const newEdge = {
        ...params,
        id: `edge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isRowConnection ? "#ec4899" : "#737373",
        },
        style: {
          stroke: isRowConnection ? "#ec4899" : "#737373",
          strokeWidth: 2,
        },
        type: isRowConnection ? "rowConnectionEdge" : "tableEdge",
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
      <DatabseLayerControlls />
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
        edgeTypes={edgeTypes}
        nodeTypes={nodeTypes}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        viewport={cabinetViewport} // Use cabinet-specific viewport
        onViewportChange={handleViewportChange} // Use cabinet-specific handler
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

export default DatabaseLayer;
