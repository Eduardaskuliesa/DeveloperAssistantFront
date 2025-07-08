"use client";
import React from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const LayerPage = () => {
  return (
    <div className="h-[90vh] w-full relative rounded-xl bg-theme-gray">
      {/* <CustomControls /> */}
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
