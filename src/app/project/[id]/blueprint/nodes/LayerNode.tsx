import React, { memo, useState } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import {
  Monitor,
  Server,
  Database,
  Cloud,
  Settings,
  Edit3,
  ChevronDown,
  Plus,
} from "lucide-react";

const layerOptions = [
  { type: "frontend", label: "Frontend", icon: Monitor },
  { type: "backend", label: "Backend", icon: Server },
  { type: "database", label: "Database", icon: Database },
  {
    type: "infrastructure",
    label: "Infrastructure",
    icon: Cloud,
  },
  {
    type: "integration",
    label: "Integration",
    icon: Settings,
  },
];

const LayerNode = memo(({ data }: NodeProps) => {
  const currentLayer =
    layerOptions.find((l) => l.type === data.layerType) || layerOptions[0];
  const IconComponent = currentLayer.icon;

  const cabinets = data.cabinets || [];

  return (
    <>
      <Handle type="target" position={Position.Top} />

      <div
        className={`
         w-80 min-h-32 border-neutral-600  bg-theme-lgray rounded-lg border transition-all hover:border-theme-pink
       `}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-2 border-b border-neutral-600">
          {/* Layer Icon Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLayerPicker(!showLayerPicker)}
              className="flex items-center gap-2 px-2 py-1 rounded bg-theme-bg border border-neutral-600 transition-colors"
            >
              <IconComponent size={18} className="text-theme-xlgray" />
            </button>
          </div>

          <div className="flex items-center gap-2 flex-1">
            <span className="text-neutral-300 font-medium">{data.label}</span>
          </div>
        </div>

        {/* Cabinets */}
        <div className="p-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-300 text-sm">Cabinets</span>
            <button className="p-1 bg-theme-bg hover:bg-theme-gray cursor-pointer transition-colors rounded">
              <Plus size={14} className="text-theme-xlgray" />
            </button>
          </div>

          <div className="space-y-1">
            {cabinets.map((cabinet: any, index: number) => (
              <div
                key={index}
                className="p-2 bg-theme-bg cursor-pointer hover:bg-theme-gray transition-colors border border-neutral-600 rounded text-neutral-300 text-sm"
              >
                {cabinet.name}
              </div>
            ))}

            {cabinets.length === 0 && (
              <div className="text-center py-2 text-neutral-500 text-xs">
                No cabinets
              </div>
            )}
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </>
  );
});

LayerNode.displayName = "LayerNode";

export default LayerNode;
