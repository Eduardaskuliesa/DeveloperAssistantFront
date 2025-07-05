"use client";
import SimpleButton from "@/components/buttons/SimpleButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMutation } from "convex/react";
import { Loader, Plus } from "lucide-react";

import { useState } from "react";
import { toast } from "sonner";
import { api } from "../../../../convex/_generated/api";

const CreateProjectButton = () => {
  const [projectName, setProjectName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const createProject = useMutation(api.projects.create);

  const handleCreateProject = async () => {
    setIsLoading(true);
    if (!projectName.trim()) {
      toast.error("Please enter a project name");
      setIsLoading(false);
      return;
    }
    try {
      await createProject({
        name: projectName,
        teamId: "team_123",
        userId: "user_123",
      });
      toast.success("Project created successfully!");

      setProjectName("");
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project");
    } finally {
      setOpen(false);
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex h-9 px-1 items-center rounded-md border cursor-pointer border-neutral-700 text-neutral-400 font-semibold text-sm hover:bg-theme-gray hover:scale-[1.02] transition-colors">
          <span className="text-left flex items-center">
            <Plus className="h-4 w-4 mr-1 text-neutral-300" />
            Create Project
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="border-none bg-theme-bg px-4 py-4 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-bottom-2 data-[state=open]:slide-in-from-bottom-20 duration-200">
        <DialogHeader>
          <DialogTitle className="text-neutral-300">
            Create New Project
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            className="bg-theme-lgray border-neutral-600 text-neutral-300"
            placeholder="Project name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <SimpleButton onClick={() => setOpen(false)}>Cancel</SimpleButton>
            <SimpleButton
              className="text-theme-pink "
              onClick={handleCreateProject}
            >
              {isLoading ? (
                <Loader className="animate-spin"></Loader>
              ) : (
                "Create"
              )}
            </SimpleButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectButton;
