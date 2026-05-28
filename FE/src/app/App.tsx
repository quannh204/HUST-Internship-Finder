import { Outlet } from "react-router-dom";
import { SiteHeader } from "../components/layout/site-header";

export function App() {
  return (
    <div className="min-h-screen bg-surface text-text">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-col px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
