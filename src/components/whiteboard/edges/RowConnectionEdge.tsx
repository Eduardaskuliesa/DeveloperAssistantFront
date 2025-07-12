import React, { memo } from "react";
import { EdgeLabelRenderer, getBezierPath, EdgeProps } from "@xyflow/react";

const RowConnectionEdge = memo(
  ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  }: EdgeProps) => {
    const [edgePath, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });

    return (
      <>
        <path
          id={id}
          className="react-flow__edge-path stroke-theme-pink stroke-2"
          d={edgePath}
          strokeDasharray="5,5"
        />
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "none",
            }}
            className="flex items-center justify-center w-6 h-4 bg-theme-pink text-white text-xs rounded"
          >
            FK
          </div>
        </EdgeLabelRenderer>
      </>
    );
  }
);

RowConnectionEdge.displayName = "RowConnectionEdge";
export default RowConnectionEdge;
