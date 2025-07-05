"use client";
import { ChevronsUpDown, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import CreateProjectButton from "./CreateProjectButton";

interface NavbarProps {
  projectId: string;
}

const Navbar = ({ projectId }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const { data: project, isPending } = useQuery(
    convexQuery(api.projects.getById, { id: projectId as Id<"projects"> })
  );

  const { data: allProjects } = useQuery(
    convexQuery(api.projects.list, { teamId: "team_123" })
  );

  const filteredProjects = allProjects?.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProjectSelect = (id: string) => {
    router.push(`/project/${id}`);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="ml-38 pt-5 mx-4 pb-2">
      <Popover  open={isOpen} onOpenChange={setIsOpen}>
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
                <button
                  key={proj._id}
                  onClick={() => handleProjectSelect(proj._id)}
                  className={`w-full overflow-visible text-left font-semibold px-3 cursor-pointer hover:scale-[1.02] py-2 rounded-md text-sm hover:bg-theme-gray transition-colors ${
                    proj._id === projectId
                      ? "bg-theme-gray text-theme-pink"
                      : "text-neutral-300"
                  }`}
                >
                  {proj.name}
                </button>
              ))}
              <div className="border-neutral-600 border-b"></div>
              <CreateProjectButton></CreateProjectButton>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Navbar;
