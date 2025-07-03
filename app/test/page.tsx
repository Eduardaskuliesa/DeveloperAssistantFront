"use client";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const TestPage = () => {
  const tasks = useQuery(api.tasks.get);
  return (
    <div>{tasks?.map((task) => <div key={task._id}>{task.text}</div>)} </div>
  );
};
export default TestPage;
