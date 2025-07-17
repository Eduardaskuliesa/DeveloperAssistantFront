import React from "react";
import DatabaseLayer from "./DatabaseLayer";

const LayerPage = async ({
  params,
}: {
  params: Promise<{ layer: string }>;
}) => {
  const layer = (await params).layer;

  const renderLayer = () => {
    switch (layer) {
      case "Database":
        return <DatabaseLayer />;
      case "Frontend":
        return <div>Frontend Layer</div>;
      default:
        return <div>Custom Layer</div>;
    }
  };

  return <div className="h-full w-full">{renderLayer()}</div>;
};

export default LayerPage;
