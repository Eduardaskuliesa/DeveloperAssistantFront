import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLayerStore } from "@/stores/useLayerStore";
import { CreateLayerPayload, LayerType } from "@/types/layer";
import { Cloud, Database, Monitor, Plus, Server, Settings } from "lucide-react";
import React, { useState } from "react";

interface LayerOptions {
  type: LayerType;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const layerOptions = [
  { type: "frontend", label: "Frontend", icon: Monitor },
  { type: "backend", label: "Backend", icon: Server },
  { type: "database", label: "Database", icon: Database },
  { type: "infrastructure", label: "Infrastructure", icon: Cloud },
  { type: "integration", label: "Integration", icon: Settings },
];

const CreateLayer = () => {
  const [open, setOpen] = useState(false);

  const { createLayer, projectId } = useLayerStore();

  const handleCreateLayer = (layer: LayerOptions) => {
    const newLayer: CreateLayerPayload = {
      label: layer.label,
      projectId: projectId as string,
      teamId: "team_123",
      layerType: layer.type,
      position: {
        x: Math.random() * 500 + 100,
        y: Math.random() * 300 + 250,
      },
      color: "#374151",
      borderColor: "#6b7280",
    };

    createLayer(newLayer);
    setOpen(false);
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="px-3 py-2 bg-theme-bg text-neutral-300 cursor-pointer hover:bg-theme-gray hover:border-theme-pink border border-neutral-600 rounded-md transition-colors flex items-center gap-2">
          <Plus size={16} />
          Create Layer
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-34 overflow-hidden p-0 bg-theme-bg border-neutral-600">
        <div className="grid">
          {layerOptions.map((layer) => {
            const LayerIcon = layer.icon;
            return (
              <button
                key={layer.type}
                onClick={() => handleCreateLayer(layer as LayerOptions)}
                className="flex text-sm cursor-pointer  items-center gap-2 px-2 py-3 hover:bg-theme-gray transition-colors text-left"
              >
                <LayerIcon size={16} className="text-neutral-400" />
                <span className="text-neutral-300">{layer.label}</span>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CreateLayer;
