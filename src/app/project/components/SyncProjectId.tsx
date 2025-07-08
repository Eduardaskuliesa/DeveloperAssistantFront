"use client";
import { useLayerStore } from "@/stores/useLayerStore";
import { useQuery } from "convex/react";
import { useEffect } from "react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface SyncProjectIdProps {
  projectId: string;
}

const SyncProjectId = ({ projectId }: SyncProjectIdProps) => {
  const { setProjectId, setProjectName } = useLayerStore();

  const data = useQuery(api.projects.getById, {
    id: projectId as Id<"projects">,
  });

  useEffect(() => {
    if (projectId) {
      setProjectId(projectId);
      setProjectName(data?.name as string);
      console.log("Project ID set in store:", projectId);
    }
  }, [setProjectId, projectId, data, setProjectName]);

  return null;
};

export default SyncProjectId;
