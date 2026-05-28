import { NavLink } from "react-router-dom";

export function SiteHeader() {
  return (
    <header className="border-b border-line/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <NavLink to="/jobs" className="text-2xl font-bold tracking-tight text-primary">
          JobFit
        </NavLink>
        <nav className="flex items-center gap-2 rounded-full border border-line bg-slate-100 p-1 text-sm font-medium">
          <NavLink
            to="/jobs"
            end
            className={({ isActive }) =>
              `rounded-full px-4 py-2 transition ${
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white text-slate-500 hover:text-slate-900"
              }`
            }
          >
            Việc làm
          </NavLink>
          <NavLink
            to="/jobs/filter"
            className={({ isActive }) =>
              `rounded-full px-4 py-2 transition ${
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white text-slate-500 hover:text-slate-900"
              }`
            }
          >
            Bộ lọc
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
