import CreateProjectButton from "./CreateProjectButton";
import ProjectsList from "./ProjectList";

const Sidebar = () => {
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
        <ProjectsList />
        <CreateProjectButton />
      </div>
    </div>
  );
};

export default Sidebar;
