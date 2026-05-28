import { Link } from "react-router-dom";

type JobSearchBarProps = {
  keyword: string;
  location: string;
  onKeywordChange: (value: string) => void;
  onLocationChange: (value: string) => void;
};

export function JobSearchBar({
  keyword,
  location,
  onKeywordChange,
  onLocationChange,
}: JobSearchBarProps) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4 shadow-card sm:p-5">
      <div className="grid items-end gap-3 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)_160px_140px]">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-700">Từ khóa</span>
          <input
            value={keyword}
            onChange={(event) => onKeywordChange(event.target.value)}
            placeholder="React Developer, Internship..."
            className="h-12 rounded-xl border border-line bg-slate-50 px-4 text-sm outline-none transition focus:border-primary focus:bg-white"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-700">Địa điểm</span>
          <input
            value={location}
            onChange={(event) => onLocationChange(event.target.value)}
            placeholder="Ha Noi, HCM..."
            className="h-12 rounded-xl border border-line bg-slate-50 px-4 text-sm outline-none transition focus:border-primary focus:bg-white"
          />
        </label>
        <button
          type="button"
          className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Tìm kiếm
        </button>
        <Link
          to="/jobs/filter"
          className="inline-flex h-12 items-center justify-center rounded-xl border border-line bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary lg:hidden"
        >
          Bộ lọc
        </Link>
      </div>
    </div>
  );
}
