import SideBar from "./sideBar";

export default function LayoutComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <div className="hidden lg:block h-screen bg-blue-900 shadow-lg sticky top-0 overflow-y-auto">
        <SideBar />
      </div>

      <div className="lg:hidden">
        <SideBar />
      </div>

      <main className="flex-1 p-3 sm:p-6 w-full">{children}</main>
    </div>
  );
}
