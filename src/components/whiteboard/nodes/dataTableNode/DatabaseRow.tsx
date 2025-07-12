import { Handle, Position } from "@xyflow/react";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import {
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";

interface DatabaseRowProps {
  entry: { id: string; title: string; type: string };
  tableId: string;
  onAddHandle: (rowId: string, side: "left" | "right") => void;
  onRemoveHandle: (rowId: string, side: "left" | "right") => void;
  hasLeftHandle?: boolean;
  hasRightHandle?: boolean;
}

export const DatabaseRow = ({
  entry,
  onAddHandle,
  onRemoveHandle,
  hasLeftHandle = false,
  hasRightHandle = false,
}: DatabaseRowProps) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="flex border-b hover:bg-theme-lgray border-neutral-600 last:border-b-0 text-xs relative">
          {hasLeftHandle && (
            <Handle
              type="target"
              position={Position.Left}
              id={`${entry.id}-target`}
              className="!w-2 !h-2 !bg-theme-pink !border-neutral-600 border"
              style={{ left: -1 }}
            />
          )}

          <div className="flex-1 py-1 px-3 font-light text-neutral-300">
            {entry.title}
          </div>
          <div className="py-1.5 px-3 font-thin text-right text-neutral-400">
            {entry.type}
          </div>

          {hasRightHandle && (
            <Handle
              type="source"
              position={Position.Right}
              id={`${entry.id}-source`}
              className="!w-2 !h-2 !bg-theme-pink !border-neutral-600 border"
              style={{ right: -2 }}
            />
          )}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="bg-theme-bg text-sm p-0 text-theme-xlgray border-neutral-600">
        <ContextMenuItem
          onClick={() =>
            hasLeftHandle
              ? onRemoveHandle(entry.id, "left")
              : onAddHandle(entry.id, "left")
          }
          className="hover:bg-theme-lgray cursor-pointer focus:bg-theme-lgray focus:text-neutral-400 transition-colors hover:text-neutral-400 border-b border-neutral-600 rounded-none"
        >
          {hasLeftHandle ? "x Handle" : "< Add Handle"}
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() =>
            hasRightHandle
              ? onRemoveHandle(entry.id, "right")
              : onAddHandle(entry.id, "right")
          }
          className="hover:bg-theme-lgray cursor-pointer focus:bg-theme-lgray focus:text-neutral-400 transition-colors hover:text-neutral-400 rounded-none"
        >
          {hasRightHandle ? "Handle x" : "Add Handle >"}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
