import { Outlet } from "react-router-dom";
import { SiteHeader } from "../components/layout/site-header";

export function App() {
  return (
    <div className="min-h-screen bg-surface text-text">
      <SiteHeader />
      <main className="mx-auto w-full flex flex-col overflow-hidden" style={{ height: 'calc(100vh - 80px)' }}>
        <Outlet />
      </main>
    </div>
  );
}