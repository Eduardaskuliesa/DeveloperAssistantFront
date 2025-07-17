import { useEffect, useMemo, useState } from "react";
import { useDatabaseStore } from "@/stores/useDatabaseStore";
import { useLayerStore } from "@/stores/useLayerStore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown, Plus } from "lucide-react";

const DatabseLayerControlls = () => {
  const { createTable, projectId, activeCabinetId, setCabinetId } =
    useDatabaseStore();
  const { layers, addCabinet } = useLayerStore();
  const [isOpen, setIsOpen] = useState(false);

  const cabinets = useMemo(() => {
    const databaseLayer = layers.find(
      (layer) => layer.projectId === projectId && layer.layerType === "database"
    );
    return databaseLayer?.cabinets || [];
  }, [layers, projectId]);

  const databaseLayer = layers.find(
    (layer) => layer.projectId === projectId && layer.layerType === "database"
  );

  const activeCabinet = cabinets.find(
    (cabinet) => cabinet.id === activeCabinetId
  );

  useEffect(() => {
    if (!activeCabinetId && cabinets.length > 0) {
      setCabinetId(cabinets[0].id);
    }
  }, [activeCabinetId, cabinets, setCabinetId]);

  const handleCreateTable = () => {
    if (!activeCabinetId) return;

    createTable(projectId as string, activeCabinetId, {
      x: Math.random() * 400 + 100,
      y: Math.random() * 400 + 100,
    });
  };

  const handleCabinetSelect = (cabinetId: string) => {
    setCabinetId(cabinetId);
    setIsOpen(false);
  };

  const handleCreateCabinet = () => {
    if (!databaseLayer) return;

    const newCabinet = addCabinet({
      layerId: databaseLayer.id,
      name: `Cabinet ${cabinets.length + 1}`,
      description: "",
    });

    setCabinetId(newCabinet);
    setIsOpen(false);
  };

  return (
    <div className="absolute top-5 left-5 flex gap-2 z-10">
      {cabinets.length > 0 && (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <div className="text-neutral-300 hover:bg-theme-gray hover:border-theme-pink transition-colors cursor-pointer font-medium flex items-center gap-2 rounded-md px-3 h-10 w-fit border border-neutral-600 bg-theme-bg">
              {activeCabinet?.name || "Select Cabinet"}
              <ChevronsUpDown className="w-4 h-4" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-60 p-0 bg-theme-bg border-neutral-700 overflow-hidden scrollbar-hide">
            <div className="px-1 py-2">
              <div className="space-y-1 max-h-64 px-1 overflow-y-auto overflow-x-visible scrollbar-hide">
                <div className="text-xs text-neutral-400 px-2 py-1">
                  Cabinets
                </div>
                {cabinets.map((cabinet) => (
                  <button
                    key={cabinet.id}
                    onClick={() => handleCabinetSelect(cabinet.id)}
                    className={`w-full text-left px-3 py-2 outline-none active:ring-0 ring-0 focus:ring-0 cursor-pointer rounded-md hover:scale-102 text-sm hover:bg-theme-gray transition-colors ${
                      cabinet.id === activeCabinetId
                        ? "bg-theme-gray text-theme-pink"
                        : "text-neutral-300"
                    }`}
                  >
                    {cabinet.name}
                  </button>
                ))}

                <button
                  onClick={handleCreateCabinet}
                  className="w-full text-left px-3 py-2 outline-none active:ring-0 ring-0 focus:ring-0 cursor-pointer rounded-md hover:scale-102 text-sm hover:bg-theme-gray transition-colors text-neutral-400 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Cabinet
                </button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}

      <button
        onClick={handleCreateTable}
        disabled={!activeCabinetId}
        className="px-3 py-2 bg-theme-bg text-neutral-300 cursor-pointer rounded-md hover:bg-theme-gray hover:border-theme-pink border border-neutral-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Create Table
      </button>

      <button className="px-3 py-2 bg-theme-bg text-neutral-300 cursor-pointer rounded-md hover:bg-theme-gray hover:border-theme-pink border border-neutral-600 transition-colors">
        Add sticky note
      </button>
    </div>
  );
};

export default DatabseLayerControlls;
