import { NavigationProgress } from "@/components/ui/navigation-progress";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { ChatWidget } from "@/components/chat/ChatWidget";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const projectId = (await params).id;

  return (
    <>
      <NavigationProgress />
      <Sidebar projectId={projectId} />
      <div className="flex flex-col">
        <Navbar projectId={projectId} />
        <main className="ml-44 pt-14 px-10">{children}</main>
      </div>
      <ChatWidget></ChatWidget>
    </>
  );
}
