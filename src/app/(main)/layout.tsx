import { NavigationProgress } from "@/components/ui/navigation-progress";
import Sidebar from "./components/Sidebar";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavigationProgress />
      <Sidebar />
      <main className="ml-44 pt-14 px-10">{children}</main>
    </>
  );
}
