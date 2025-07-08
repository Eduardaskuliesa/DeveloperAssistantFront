import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Home, Layers, Package } from "lucide-react";

const getIcon = (type: string) => {
  switch (type) {
    case "home":
      return <Home size={18} />;
    case "layer":
      return <Layers size={18} />;
    default:
      return <Package size={18} />;
  }
};

const HomeNode = memo(({ data }: NodeProps) => {
  return (
    <>
      <div
        className={`
         flex items-center  gap-2 px-4 py-3 border-neutral-600  bg-theme-lgray rounded-lg border transition-all hover:border-theme-pink  text-neutral-300 font-medium min-w-[150px]
       `}
      >
        {getIcon(data.type as string)}
        <span>{data.label as string}</span>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
});

HomeNode.displayName = "HomeNode";

export default HomeNode;
