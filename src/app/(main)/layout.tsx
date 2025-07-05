import Sidebar from "./components/Sidebar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Sidebar />
      <main className="ml-44 pt-14 px-10">{children}</main>
    </>
  );
}
