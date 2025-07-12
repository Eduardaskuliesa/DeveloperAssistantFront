import { useState, useRef, useEffect } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useDatabaseStore } from "@/stores/useDatabaseStore";

interface DatabaseTableHeaderProps {
  tableId: string;
  label: string;
}

export const DatabaseTableHeader = ({
  tableId,
  label,
}: DatabaseTableHeaderProps) => {
  const { renameTable, deleteTable } = useDatabaseStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(label);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditValue(label);
  }, [label]);

  const handleRenameTable = () => {
    setIsEditing(true);
    setEditValue(label);
  };

  const handleSaveRename = () => {
    if (editValue.trim() && editValue !== label) {
      renameTable(tableId, editValue.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveRename();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setEditValue(label);
      setIsEditing(false);
    }
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleBlur = () => {
    handleSaveRename();
  };

  const handleDeleteTable = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    deleteTable(tableId);
    setShowDeleteDialog(false);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isEditing]);

  return (
    <>
      {isEditing ? (
        <div className="border-b border-neutral-600 text-neutral-300 rounded-tl-lg rounded-tr-lg p-2 text-center text-sm">
          <Input
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onClick={handleInputClick}
            className="text-center focus-visible:border-theme-xlgray rounded-sm bg-transparent border p-0 h-auto text-neutral-300 focus:outline-none focus:ring-0 focus-visible:ring-0"
          />
        </div>
      ) : (
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <div className="border-b font-medium border-neutral-600 text-neutral-300 rounded-tl-lg rounded-tr-lg p-2 text-center text-sm">
              {label}
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent className="bg-theme-bg text-sm p-0 text-theme-xlgray border-neutral-600">
            <ContextMenuItem
              onClick={handleRenameTable}
              className="hover:bg-theme-lgray cursor-pointer focus:bg-theme-lgray focus:text-neutral-400 transition-colors hover:text-neutral-400 border-b border-neutral-600 rounded-none"
            >
              Rename
            </ContextMenuItem>
            <ContextMenuItem
              onClick={handleDeleteTable}
              className="hover:bg-theme-lgray cursor-pointer focus:bg-theme-lgray focus:text-neutral-400 transition-colors hover:text-neutral-400 rounded-none"
            >
              Delete
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-theme-gray border-none">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-neutral-300">
              Delete Table
            </AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-400">
              Are you sure you want to delete this table? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-theme-gray border-neutral-600 text-neutral-300 hover:text-neutral-300 cursor-pointer hover:bg-theme-lgray">
              No
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-theme-pink text-neutral-300 hover:bg-theme-pink/80 cursor-pointer"
            >
              I&#39;m sure
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
