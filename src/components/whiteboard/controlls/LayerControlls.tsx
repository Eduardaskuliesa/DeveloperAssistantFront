import { useDatabaseStore } from "@/stores/useDatabaseStore";

const LayerControlls = () => {
  const { createTable, projectId } = useDatabaseStore();

  const handleCreateTable = () => {
    createTable(projectId as string, {
      x: Math.random() * 400 + 100,
      y: Math.random() * 400 + 100,
    });
  };

  return (
    <div className="absolute top-5 left-5 flex gap-2 z-10">
      <button
        onClick={handleCreateTable}
        className="px-3 py-2 bg-theme-bg text-neutral-300 cursor-pointer rounded-md hover:bg-theme-gray hover:border-theme-pink border border-neutral-600 transition-colors"
      >
        Create Table
      </button>
      <button className="px-3 py-2 bg-theme-bg text-neutral-300 cursor-pointer rounded-md hover:bg-theme-gray hover:border-theme-pink border border-neutral-600 transition-colors">
        Add sticky note
      </button>
    </div>
  );
};
export default LayerControlls;
