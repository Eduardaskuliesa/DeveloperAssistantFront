"use client";
import { ChevronLeft, ChevronsUpDown, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import CreateProjectButton from "./CreateProjectButton";
import { ProgressLink } from "@/components/links/ProgressButton";
import { useLayerStore } from "@/stores/useLayerStore";

interface NavbarProps {
  projectId: string;
}

const Navbar = ({ projectId }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const pathname = usePathname();

  const { getProjectLayerNodes } = useLayerStore();

  const layers = getProjectLayerNodes().filter(
    (layer) => layer.type !== "architectureNode"
  );

  const isOnBlueprintPage = pathname.includes("/blueprint");

  const { data: project, isPending } = useQuery(
    convexQuery(api.projects.getById, { id: projectId as Id<"projects"> })
  );

  const { data: allProjects } = useQuery(
    convexQuery(api.projects.list, { teamId: "team_123" })
  );

  const filteredProjects = allProjects?.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClosePopover = () => {
    setIsOpen(false);
    setSearchTerm("");
  };

  const isOnMainBlueprint = pathname === `/project/${projectId}/blueprint`;

  return (
    <div className="ml-38 pt-5 mx-4 pb-2 flex items-center gap-2">
      <ProgressLink
        href="/dashboard"
        className="text-sm bg-theme-gray hover:bg-theme-lgray p-1 rounded-full inline-block"
      >
        <ChevronLeft className="text-theme-xlgray" />
      </ProgressLink>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="text-neutral-300 hover:bg-theme-gray transition-colors cursor-pointer text-xl font-semibold flex items-center gap-2 rounded-full px-4 h-10 w-fit">
            {isPending ? (
              <div className="h-6 bg-theme-lgray rounded animate-pulse w-32"></div>
            ) : (
              project?.name || "Unknown Project"
            )}
            <ChevronsUpDown className="w-4 h-4" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0 bg-theme-bg border-neutral-700 overflow-hidden">
          <div className="px-2 py-3">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-theme-lgray border-neutral-600 text-neutral-300"
              />
            </div>
            <div className="space-y-1 px-1 max-h-60 overflow-y-auto overflow-x-visible scrollbar-hide">
              <div className="text-xs text-neutral-400 px-2 py-1">Projects</div>
              {filteredProjects?.map((proj) => (
                <ProgressLink
                  key={proj._id}
                  href={`/project/${proj._id}/blueprint`}
                  onClick={handleClosePopover}
                  className={`w-full overflow-visible text-left font-semibold px-3 cursor-pointer hover:scale-[1.02] py-2 rounded-md text-sm hover:bg-theme-gray transition-colors block ${
                    proj._id === projectId
                      ? "bg-theme-gray text-theme-pink"
                      : "text-neutral-300"
                  }`}
                >
                  {proj.name}
                </ProgressLink>
              ))}
              <CreateProjectButton />
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {isOnBlueprintPage && (
        <div className="flex border-l-2 gap-4 pl-4 border-neutral-500 h-full">
          {layers.length !== 0 && (
            <>
              {isOnMainBlueprint ? (
                <div className="text-neutral-300 gap-4 transition-colors cursor-default text-lg font-semibold flex items-center rounded-full px-4 h-10 w-fit border border-theme-pink">
                  <h4 className="text-neutral-300">Blueprint</h4>
                </div>
              ) : (
                <ProgressLink
                  href={`/project/${projectId}/blueprint`}
                  className="text-neutral-300 gap-4 hover:bg-theme-gray transition-colors cursor-pointer text-lg font-semibold flex items-center rounded-full px-4 h-10 w-fit border border-neutral-700"
                >
                  <h4 className="text-neutral-300">Blueprint</h4>
                </ProgressLink>
              )}
            </>
          )}

          {layers.map((layer) => {
            const isActiveLayer = pathname.includes(
              `/project/${projectId}/blueprint/${layer.data.label}`
            );

            if (isActiveLayer) {
              return (
                <div
                  key={layer.id}
                  className="text-neutral-300 gap-4 transition-colors cursor-default text-lg font-semibold flex items-center rounded-full px-4 h-10 w-fit border border-theme-pink"
                >
                  <h4 className="text-neutral-300">
                    {String(layer.data.label)}
                  </h4>
                </div>
              );
            }

            return (
              <ProgressLink
                href={`/project/${projectId}/blueprint/${layer.data.label}`}
                key={layer.id}
                className="text-neutral-300 gap-4 hover:bg-theme-gray transition-colors cursor-pointer text-lg font-semibold flex items-center rounded-full px-4 h-10 w-fit border border-neutral-700"
              >
                <h4 className="text-neutral-300">{String(layer.data.label)}</h4>
              </ProgressLink>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Navbar;
