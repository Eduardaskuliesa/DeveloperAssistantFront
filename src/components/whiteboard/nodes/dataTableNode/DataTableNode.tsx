import { memo, useState } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Plus } from "lucide-react";
import { motion } from "motion/react";
import { DatabaseTableHeader } from "./DatabaseTableHeader";
import RowManagementDialog from "./RowManagmentDialog";

export type DataTableNodeProps = NodeProps & {
  data: {
    label: string;
    schema: { id: string; title: string; type: string }[];
    tableId: string;
  };
};

const DataTableNode = memo(({ data }: DataTableNodeProps) => {
  const [showRowDialog, setShowRowDialog] = useState(false);

  const handleCreateRow = () => {
    setShowRowDialog(true);
  };

  return (
    <>
      <div className="w-60 border-neutral-600 overflow-hidden bg-theme-bg rounded-lg border transition-all hover:border-theme-pink">
        <Handle type="target" position={Position.Top} />
        <DatabaseTableHeader tableId={data.tableId} label={data.label} />

        {/* Table Body */}
        <div className="p-0 bg-theme-gray">
          <table className="w-full">
            <tbody>
              {data.schema.map((entry) => (
                <TableRow
                  key={entry.id}
                  className="border-b hover:bg-theme-lgray border-neutral-600 last:border-b-0 text-xs"
                >
                  <TableCell className="py-1 font-light text-neutral-300">
                    {entry.title}
                  </TableCell>
                  <TableCell className="py-1.5 font-thin text-right text-neutral-400">
                    {entry.type}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="hover:bg-theme-lgray border-none cursor-pointer group transition-none">
                <TableCell colSpan={2} className="p-0 transition-none">
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreateRow}
                    className="flex items-center justify-center gap-1 py-2 mx-2 my-1 rounded-sm border border-dashed border-theme-xlgray text-neutral-400 hover:text-neutral-300 hover:bg-theme-lgray/50 transition-colors group-hover:bg-theme-lgray/30"
                  >
                    <Plus size={14} />
                    <span className="text-xs">Manage Rows</span>
                  </motion.div>
                </TableCell>
              </TableRow>
            </tbody>
          </table>
        </div>

        <Handle type="source" position={Position.Bottom} />
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
