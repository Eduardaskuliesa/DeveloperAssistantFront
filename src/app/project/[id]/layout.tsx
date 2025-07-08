import { NavigationProgress } from "@/components/ui/navigation-progress";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { ChatWidget } from "@/components/chat/ChatWidget";
import SyncProjectId from "../components/SyncProjectId";

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
      <SyncProjectId projectId={projectId} />
      <Sidebar projectId={projectId} />
      <div className="flex flex-col">
        <Navbar projectId={projectId} />
        <main className="ml-44 px-4 max-h-screen">{children}</main>
      </div>
      <ChatWidget />
    </>
  );
}
