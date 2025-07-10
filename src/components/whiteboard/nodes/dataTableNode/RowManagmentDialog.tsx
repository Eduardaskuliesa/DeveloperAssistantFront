import { useState, useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { useDatabaseStore } from "@/stores/useDatabaseStore";

interface RowData {
  id: string;
  title: string;
  type: string;
  isNew?: boolean;
}

interface RowManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tableId: string;
  tableName: string;
  existingRows: { id: string; title: string; type: string }[];
}

const commonTypes = [
  "uuid",
  "string",
  "text",
  "boolean",
  "timestamp",
  "json",
  "array",
];
const RowManagementDialog = ({
  open,
  onOpenChange,
  tableId,
  tableName,
  existingRows,
}: RowManagementDialogProps) => {
  const { createRow, updateRow, deleteRow } = useDatabaseStore();
  const [rows, setRows] = useState<RowData[]>([]);

  useEffect(() => {
    if (open) {
      setRows([
        ...existingRows.map((row) => ({ ...row, isNew: false })),
        { id: `new-${Date.now()}`, title: "", type: "string", isNew: true },
      ]);
    }
  }, [open, existingRows]);

  const addNewRow = () => {
    setRows((prev) => [
      ...prev,
      { id: `new-${Date.now()}`, title: "", type: "string", isNew: true },
    ]);
  };

  const updateRowData = (
    id: string,
    field: "title" | "type",
    value: string
  ) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const removeRow = (id: string) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
  };

  const handleSave = () => {
    // Process new rows
    const newRows = rows.filter((row) => row.isNew && row.title.trim());
    newRows.forEach((row) => {
      createRow(tableId, row.title.trim(), row.type);
    });

    // Process updated existing rows
    const updatedRows = rows.filter((row) => !row.isNew);
    updatedRows.forEach((row) => {
      const original = existingRows.find((r) => r.id === row.id);
      if (
        original &&
        (original.title !== row.title || original.type !== row.type)
      ) {
        updateRow(tableId, row.id, row.title.trim(), row.type);
      }
    });

    // Process deleted rows
    const currentIds = rows.map((row) => row.id);
    const deletedRows = existingRows.filter(
      (row) => !currentIds.includes(row.id)
    );
    deletedRows.forEach((row) => {
      deleteRow(tableId, row.id);
    });

    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-theme-bg border-neutral-600 max-w-2xl p-0 px-2 py-3">
        <DialogHeader>
          <DialogTitle className="text-neutral-300  px-2">
            Manage Rows - {tableName}
          </DialogTitle>
          <DialogClose></DialogClose>
        </DialogHeader>

        <div className="max-h-96 overflow-y-auto scrollbar-hide space-y-2">
          {rows.map((row) => (
            <div
              key={row.id}
              className="flex items-center p-1  bg-theme-gray rounded-lg border border-neutral-600"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Label className="text-xs text-neutral-400 px-1 pb-0.5">
                      Title
                    </Label>
                    <Input
                      value={row.title}
                      onChange={(e) =>
                        updateRowData(row.id, "title", e.target.value)
                      }
                      placeholder="Enter row title"
                      className="bg-theme-bg border-neutral-600 text-neutral-300 focus:border-theme-pink"
                    />
                  </div>
                  <div className="w-28">
                    <Label className="text-xs text-neutral-400 px-1 pb-0.5">
                      Type
                    </Label>
                    <Select
                      value={row.type}
                      onValueChange={(value) =>
                        updateRowData(row.id, "type", value)
                      }
                    >
                      <SelectTrigger className="bg-theme-bg border-neutral-600 text-neutral-300 focus:border-theme-pink">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-theme-bg border-neutral-600">
                        {commonTypes.map((type) => (
                          <SelectItem
                            key={type}
                            value={type}
                            className="text-neutral-300 hover:bg-theme-lgray"
                          >
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRow(row.id)}
                    className="text-theme-pink mt-4 hover:text-theme-pink cursor-pointer  hover:bg-pink-800/20"
                  >
                    <X size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          onClick={addNewRow}
          className="w-full border-dashed text-neutral-300 bg-theme-gray border-neutral-600 hover:bg-theme-lgray hover:text-neutral-300 cursor-pointer"
        >
          <Plus size={16} className="mr-2" />
          Add New Row
        </Button>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            className="bg-theme-gray border-neutral-600 text-neutral-300 cursor-pointer hover:text-neutral-300 hover:bg-theme-lgray"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-theme-pink hover:bg-theme-pink/80 cursor-pointer text-neutral-300"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RowManagementDialog;
