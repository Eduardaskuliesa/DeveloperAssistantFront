import CreateLayer from "../actions/CreateLayer";

const CustomControls = () => {
  return (
    <div className="absolute top-5 left-5 flex gap-2 z-10">
      <CreateLayer />
      <button className="px-3 py-2 bg-theme-bg text-neutral-300 cursor-pointer rounded-md hover:bg-theme-gray hover:border-theme-pink border border-neutral-600 transition-colors">
        Create Node
      </button>
      <button className="px-3 py-2 bg-theme-bg text-neutral-300 cursor-pointer rounded-md hover:bg-theme-gray hover:border-theme-pink border border-neutral-600 transition-colors">
        Create Textbox
      </button>
    </div>
  );
};

export default CustomControls;
