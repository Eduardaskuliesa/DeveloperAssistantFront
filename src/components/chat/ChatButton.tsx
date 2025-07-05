"use client";
import { MessageCircle, Eye } from "lucide-react";
import { usePathname } from "next/navigation";

interface ChatButtonProps {
  onClick: () => void;
}

export function ChatButton({ onClick }: ChatButtonProps) {
  const pathname = usePathname();

  const getCurrentPage = () => {
    if (pathname.includes("/blueprint")) return "Blueprint";
    if (pathname.includes("/memory")) return "Memory";
    if (pathname.includes("/dependencies")) return "Dependencies";
    if (pathname.includes("/documents")) return "Documents";
    if (pathname.includes("/settings")) return "Settings";
    return "Project Overview";
  };

  return (
    <button
      onClick={onClick}
      className="bg-theme-gray border border-neutral-700 hover:border-theme-pink text-neutral-300 rounded-lg px-6 py-4 shadow-lg hover:scale-[1.01] transition-all min-w-[280px]"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-5 h-5 text-theme-pink" />
          <span className="font-semibold">Start talk with buddy!</span>
        </div>
        <div className="flex items-center gap-2 bg-theme-lgray rounded-md px-2 py-1">
          <Eye className="w-3 h-3 text-theme-pink" />
          <span className="text-xs text-theme-pink font-semibold">
            {getCurrentPage()}
          </span>
        </div>
      </div>
    </button>
  );
}
