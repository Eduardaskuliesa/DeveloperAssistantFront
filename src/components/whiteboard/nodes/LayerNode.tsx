import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Monitor, Server, Database, Cloud, Settings, Plus } from "lucide-react";
import { Cabinet } from "@/types/layer";
import { useLayerStore } from "@/stores/useLayerStore";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

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

const LayerNode = memo(({ id }: NodeProps) => {
  const { layers, deleteLayer } = useLayerStore();
  const layer = layers.find((l) => l.id === id);

  if (!layer) {
    return null;
  }

  const currentLayer =
    layerOptions.find((l) => l.type === layer.layerType) || layerOptions[0];
  const IconComponent = currentLayer.icon;

  const cabinets = layer.cabinets || [];

  return (
    <ContextMenu>
      <Handle type="target" position={Position.Top} />
      <ContextMenuTrigger>
        <div
          className={`
         w-80 min-h-32 border-neutral-600  bg-theme-lgray rounded-lg border transition-all hover:border-theme-pink
       `}
        >
          <div className="flex items-center gap-3 p-2 border-b border-neutral-600">
            <div className="relative">
              <button className="flex items-center gap-2 px-2 py-1 rounded bg-theme-bg border border-neutral-600 transition-colors">
                <IconComponent size={18} className="text-theme-xlgray" />
              </button>
            </div>

            <div className="flex items-center gap-2 flex-1">
              <span className="text-neutral-300 font-medium">
                {layer.label}
              </span>
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
              {cabinets.map((cabinet: Cabinet, index: number) => (
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
      </ContextMenuTrigger>

      <ContextMenuContent className="bg-theme-bg text-sm p-0 text-theme-xlgray border-neutral-600">
        <ContextMenuItem className="hover:bg-theme-lgray cursor-pointer focus:bg-theme-lgray focus:text-neutral-400 transition-colors hover:text-neutral-400 border-b border-neutral-600 rounded-none">
          Update Title
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => deleteLayer(layer.id)}
          className="hover:bg-theme-lgray cursor-pointer focus:bg-theme-lgray focus:text-neutral-400 transition-colors hover:text-neutral-400 border-b border-neutral-600 rounded-none"
        >
          Delete Layer
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
});

LayerNode.displayName = "LayerNode";

export default LayerNode;
