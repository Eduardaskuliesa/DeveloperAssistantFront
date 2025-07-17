import React, { memo, useState, useRef, useEffect } from "react";
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
import { toast } from "sonner";

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
  const { layers, deleteLayer, addCabinet, updateCabinet, deleteCabinet } =
    useLayerStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newCabinetName, setNewCabinetName] = useState("");
  const [editingCabinetId, setEditingCabinetId] = useState<string | null>(null);
  const [editingCabinetName, setEditingCabinetName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const editContainerRef = useRef<HTMLDivElement>(null);
  const layer = layers.find((l) => l.id === id);

  useEffect(() => {
    if (isCreating && inputRef.current) {
      inputRef.current.select();
    }
  }, [isCreating]);

  useEffect(() => {
    if (editingCabinetId && editInputRef.current) {
      setTimeout(() => {
        if (editInputRef.current) {
          editInputRef.current.focus();
          editInputRef.current.select();
        }
      }, 0);
    }
  }, [editingCabinetId]);

  if (!layer) {
    return null;
  }

  const currentLayer =
    layerOptions.find((l) => l.type === layer.layerType) || layerOptions[0];
  const IconComponent = currentLayer.icon;

  const cabinets = layer.cabinets || [];

  const handleCreateCabinet = () => {
    setIsCreating(true);
    setNewCabinetName("");
  };

  const handleSaveCabinet = () => {
    if (newCabinetName.trim()) {
      addCabinet({
        layerId: layer.id,
        name: newCabinetName.trim(),
        description: "",
      });
    }
    setIsCreating(false);
    setNewCabinetName("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveCabinet();
    } else if (e.key === "Escape") {
      setIsCreating(false);
      setNewCabinetName("");
    }
  };

  const handleBlur = () => {
    if (newCabinetName.trim()) {
      handleSaveCabinet();
    } else {
      setIsCreating(false);
      setNewCabinetName("");
    }
  };

  const handleEditBlur = () => {
    if (editingCabinetName.trim()) {
      updateCabinet({
        layerId: layer.id,
        cabinetId: editingCabinetId || "",
        name: editingCabinetName.trim(),
      });
    }
    setEditingCabinetId(null);
    setEditingCabinetName("");
  };

  const handleUpdateCabinet = (cabinetId: string, currentName: string) => {
    setEditingCabinetId(cabinetId);
    setEditingCabinetName(currentName);
  };

  const handleSaveUpdate = () => {
    if (editingCabinetName.trim() && editingCabinetId) {
      updateCabinet({
        layerId: layer.id,
        cabinetId: editingCabinetId,
        name: editingCabinetName.trim(),
      });
    }
    setEditingCabinetId(null);
    setEditingCabinetName("");
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveUpdate();
    } else if (e.key === "Escape") {
      setEditingCabinetId(null);
      setEditingCabinetName("");
    }
  };

  const handleDeleteCabinet = (cabinetId: string) => {
    if (cabinets.length <= 1) {
      toast.error("Cannot delete the last cabinet");
      return;
    }

    deleteCabinet(layer.id, cabinetId);
  };

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
              <button
                onClick={handleCreateCabinet}
                className="p-1 bg-theme-bg hover:bg-theme-gray cursor-pointer transition-colors rounded"
              >
                <Plus size={14} className="text-theme-xlgray" />
              </button>
            </div>

            <div className="space-y-1">
              {cabinets.map((cabinet: Cabinet) => (
                <div key={cabinet.id}>
                  {editingCabinetId === cabinet.id ? (
                    <div
                      ref={editContainerRef}
                      className="p-2 bg-theme-bg border border-theme-pink rounded text-neutral-300 text-sm"
                    >
                      <input
                        ref={editInputRef}
                        type="text"
                        value={editingCabinetName}
                        onBlur={handleEditBlur}
                        onChange={(e) => setEditingCabinetName(e.target.value)}
                        onKeyDown={handleEditKeyDown}
                        className="w-full bg-transparent text-neutral-300 text-sm outline-none"
                      />
                    </div>
                  ) : (
                    <ContextMenu>
                      <ContextMenuTrigger asChild>
                        <div className="p-2 bg-theme-bg border border-neutral-600 rounded text-neutral-300 text-sm">
                          {cabinet.name}
                        </div>
                      </ContextMenuTrigger>
                      <ContextMenuContent className="bg-theme-bg text-sm p-0 text-theme-xlgray border-neutral-600">
                        <ContextMenuItem
                          onClick={() =>
                            handleUpdateCabinet(cabinet.id, cabinet.name)
                          }
                          className="hover:bg-theme-lgray cursor-pointer focus:bg-theme-lgray focus:text-neutral-400 transition-colors hover:text-neutral-400 border-b border-neutral-600 rounded-none"
                        >
                          Update
                        </ContextMenuItem>
                        <ContextMenuItem
                          onClick={() => handleDeleteCabinet(cabinet.id)}
                          className="hover:bg-theme-lgray cursor-pointer focus:bg-theme-lgray focus:text-neutral-400 transition-colors rounded-none"
                        >
                          Delete
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  )}
                </div>
              ))}

              {isCreating && (
                <div className="p-2 bg-theme-bg border border-theme-pink rounded">
                  <input
                    ref={inputRef}
                    type="text"
                    value={newCabinetName}
                    onChange={(e) => setNewCabinetName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    placeholder="Cabinet name..."
                    className="w-full bg-transparent text-neutral-300 text-sm outline-none placeholder:text-neutral-500"
                  />
                </div>
              )}

              {cabinets.length === 0 && !isCreating && (
                <div className="text-center py-2 text-neutral-500 text-xs">
                  No cabinets
                </div>
              )}
            </div>
          </div>
        </div>
      </ContextMenuTrigger>

      <ContextMenuContent className="bg-theme-bg text-sm p-0 text-theme-xlgray border-neutral-600">
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
