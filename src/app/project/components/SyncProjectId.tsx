"use client";
import { useLayerStore } from "@/stores/useLayerStore";
import { useQuery } from "convex/react";
import { useEffect } from "react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useDatabaseStore } from "@/stores/useDatabaseStore";

interface SyncProjectIdProps {
  projectId: string;
}

const SyncProjectId = ({ projectId }: SyncProjectIdProps) => {
  const { setProjectId: setLayerProjectId, setProjectName } = useLayerStore();
  const { setProjectId: setDataProjectId } = useDatabaseStore();

  const data = useQuery(api.projects.getById, {
    id: projectId as Id<"projects">,
  });

  useEffect(() => {
    if (projectId) {
      setLayerProjectId(projectId);
      setDataProjectId(projectId);
      setProjectName(data?.name as string);
      console.log("Project ID set in store:", projectId);
    }
  }, [setDataProjectId, setLayerProjectId, projectId, data, setProjectName]);

  return null;
};

export default SyncProjectId;
