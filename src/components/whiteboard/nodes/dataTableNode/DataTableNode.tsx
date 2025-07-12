import { memo, useState } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Plus } from "lucide-react";
import { motion } from "motion/react";
import { DatabaseTableHeader } from "./DatabaseTableHeader";
import RowManagementDialog from "./RowManagmentDialog";
import { DatabaseRow } from "./DatabaseRow";
import { useDatabaseStore } from "@/stores/useDatabaseStore";

export type DataTableNodeProps = NodeProps & {
  data: {
    label: string;
    schema: {
      id: string;
      title: string;
      type: string;
      hasLeftHandle?: boolean;
      hasRightHandle?: boolean;
    }[];
    tableId: string;
  };
};

const DataTableNode = memo(({ data }: DataTableNodeProps) => {
  const [showRowDialog, setShowRowDialog] = useState(false);
  const { addRowHandle, removeRowHandle } = useDatabaseStore();

  const handleCreateRow = () => {
    setShowRowDialog(true);
  };

  const handleAddHandle = (rowId: string, side: "left" | "right") => {
    addRowHandle(data.tableId, rowId, side);
  };

  const handleRemoveHandle = (rowId: string, side: "left" | "right") => {
    removeRowHandle(data.tableId, rowId, side);
  };

  return (
    <>
      <div className="w-60 border-neutral-600  bg-theme-bg rounded-lg border transition-all hover:border-theme-pink">
        <Handle type="target" position={Position.Top} id={data.tableId} />
        <DatabaseTableHeader tableId={data.tableId} label={data.label} />

        <div className="p-0 bg-theme-gray  rounded-b-lg">
          <div className="w-full">
            <div className="flex flex-col  rounded-b-lg">
              {data.schema.map((entry) => (
                <DatabaseRow
                  key={entry.id}
                  entry={entry}
                  tableId={data.tableId}
                  onAddHandle={handleAddHandle}
                  onRemoveHandle={handleRemoveHandle}
                  hasLeftHandle={entry.hasLeftHandle}
                  hasRightHandle={entry.hasRightHandle}
                />
              ))}

              <div className="hover:bg-theme-lgray rounded-b-lg border-none cursor-pointer group transition-none">
                <div className="p-0 transition-none">
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreateRow}
                    className="flex items-center justify-center gap-1 py-2 mx-2 my-1 rounded-sm border border-dashed border-theme-xlgray text-neutral-400 hover:text-neutral-300 hover:bg-theme-lgray/50 transition-colors group-hover:bg-theme-lgray/30"
                  >
                    <Plus size={14} />
                    <span className="text-xs">Manage Rows</span>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Handle type="source" position={Position.Bottom} id={data.tableId} />
      </div>

      <RowManagementDialog
        open={showRowDialog}
        onOpenChange={setShowRowDialog}
        tableId={data.tableId}
        tableName={data.label}
        existingRows={data.schema}
      />
    </>
  );
});

DataTableNode.displayName = "DataTableNode";

export default DataTableNode;
