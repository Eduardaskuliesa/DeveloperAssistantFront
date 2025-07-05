"use client";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../../convex/_generated/api";
import { ProgressLink } from "@/components/links/ProgressButton";

const ProjectButton = ({ name }: { name: string }) => {
  return (
    <button className="flex items-center hover:scale-[1.02] justify-between hover:bg-theme-gray cursor-pointer transition-colors px-2 h-9 text-sm rounded-md text-neutral-400 font-semibold">
      <span className="text-left">{name}</span>
      <span className=""></span>
    </button>
  );
};

const ProjectSkeleton = () => (
  <div className="flex items-center px-2 h-9 bg-theme-gray rounded-md animate-pulse">
    <div className="h-3 bg-theme-xlgray rounded-sm animate-pulse w-full"></div>
  </div>
);

const ProjectsList = () => {
  const { data: projects, isPending } = useQuery(
    convexQuery(api.projects.list, { teamId: "team_123" })
  );

  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-neutral-400">Projects</span>
      {isPending ? (
        <>
          <ProjectSkeleton />
          <ProjectSkeleton />
          <ProjectSkeleton />
        </>
      ) : (
        projects?.map((project) => (
          <ProgressLink key={project._id} href={`/project/${project._id}`}>
            <ProjectButton name={project.name} />
          </ProgressLink>
        ))
      )}
    </div>
  );
};

export default ProjectsList;
