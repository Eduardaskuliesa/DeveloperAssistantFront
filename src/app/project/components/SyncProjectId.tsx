"use client";
import { useLayerStore } from "@/stores/useLayerStore";
import { useEffect } from "react";

interface SyncProjectIdProps {
  projectId: string;
}

const SyncProjectId = ({ projectId }: SyncProjectIdProps) => {
  const { setProjectId } = useLayerStore();

  useEffect(() => {
    if (projectId) {
      setProjectId(projectId);
      console.log("Project ID set in store:", projectId);
    }
  }, [setProjectId, projectId]);

  return null;
};

export default SyncProjectId;
