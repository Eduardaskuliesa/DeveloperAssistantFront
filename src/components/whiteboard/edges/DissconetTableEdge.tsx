import React, { memo } from "react";
import { EdgeLabelRenderer, getBezierPath, EdgeProps } from "@xyflow/react";
import { X } from "lucide-react";
import { useDatabaseStore } from "@/stores/useDatabaseStore";

const DissconnectTableEdge = memo(({ 
  id, 
  sourceX, 
  sourceY, 
  targetX, 
  targetY, 
  sourcePosition, 
  targetPosition 
}: EdgeProps) => {
  const { removeTableEdge } = useDatabaseStore();
  
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeDelete = () => {
    removeTableEdge(id);
  };

  return (
    <>
      <path 
        id={id} 
        className="react-flow__edge-path stroke-neutral-400 stroke-2" 
        d={edgePath} 
      />
      <EdgeLabelRenderer>
        <button
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="flex items-center bg-theme-gray hover:bg-theme-lgray transition-colors border-neutral-600 border text-theme-xlgray cursor-pointer rounded-full justify-center w-6 h-6 "
          onClick={onEdgeDelete}
        >
          <X size={12} />
        </button>
      </EdgeLabelRenderer>
    </>
  );
});

DissconnectTableEdge.displayName = "CustomEdge";
export default DissconnectTableEdge;