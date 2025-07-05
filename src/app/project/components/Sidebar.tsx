"use client";
import { usePathname } from "next/navigation";
import {
  Brain,
  FileText,
  GitBranch,
  Map,
  MessageCircle,
  Settings,
  LucideIcon,
} from "lucide-react";
import { ProgressLink } from "@/components/links/ProgressButton";

interface NavButtonProps {
  icon: LucideIcon;
  label: string;
  href: string;
  pathname: string;
  projectId: string;
}

const NavButton = ({ icon: Icon, label, href, pathname, projectId }: NavButtonProps) => {
  const isActive = pathname.includes(href);
  const trueHref = `/project/${projectId}${href}`;
  return (
    <ProgressLink
      href={trueHref}
      className={`flex items-center gap-3 px-2 h-9 text-sm rounded-md cursor-pointer hover:scale-[1.02] transition-all ${
        isActive
          ? "bg-theme-gray text-theme-pink"
          : "text-neutral-400 hover:bg-theme-gray hover:text-neutral-300"
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </ProgressLink>
  );
};
const Sidebar = ({ projectId }: { projectId: string }) => {
  const pathname = usePathname();

  return (
    <div className="w-38 h-screen fixed top-0">
      <div className="flex flex-col py-4 px-3 gap-4">
        <div className="text-theme-pink font-bold">Logo</div>
        <div className="flex flex-col gap-3 border-b border-neutral-700 pb-3">
          <span className="text-xs text-neutral-400">Team</span>
          <button className="flex items-center justify-between border-emerald-900 px-2 h-9 text-sm rounded-md border text-neutral-400 font-semibold">
            <span className="text-left">My team</span>
            <span className="rounded-full h-2 w-2 bg-emerald-500"></span>
          </button>
        </div>
      </div>

      {/* Project Navigation */}
      <div className="flex flex-col py-4 px-3 gap-1 flex-1">
        <span className="text-xs text-neutral-400">Project</span>
        <NavButton
          projectId={projectId}
          icon={Map}
          label="Blueprint"
          href="/blueprint"
          pathname={pathname}
        />
        <NavButton
          projectId={projectId}
          icon={Brain}
          label="Memory"
          href="/memory"
          pathname={pathname}
        />
        <NavButton
          projectId={projectId}
          icon={GitBranch}
          label="Dependencies"
          href="/dependencies"
          pathname={pathname}
        />
        <NavButton
          projectId={projectId}
          icon={FileText}
          label="Documents"
          href="/documents"
          pathname={pathname}
        />
        <NavButton
          projectId={projectId}
          icon={Settings}
          label="Settings"
          href="/settings"
          pathname={pathname}
        />
      </div>

      <div className="flex flex-col px-3 gap-1 pb-4">
        <span className="text-xs text-neutral-400">Chat</span>
        <NavButton
          projectId={projectId}
          icon={MessageCircle}
          label="Conversations"
          href="/conversations"
          pathname={pathname}
        />
      </div>
    </div>
  );
};

export default Sidebar;
