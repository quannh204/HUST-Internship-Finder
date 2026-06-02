import { Link, useLocation } from "react-router-dom";
import type { Job } from "../../types/job";
import { Panel, Pill } from "./ui";

function getCompanyInitials(companyName: string): string {
  return companyName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function JobCard({ job }: { job: Job }) {
  const location = useLocation();
  const fromPath = `${location.pathname}${location.search}`;
  const initials = getCompanyInitials(job.companyName);
  const skillNames = Array.isArray(job.skills) 
    ? job.skills.map(s => typeof s === 'string' ? s : s.name).slice(0, 3)
    : [];

  return (
    <Panel className="p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-lg font-semibold text-primary">
            {initials}
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-sm text-slate-500">{job.companyName}</p>
              <h3 className="text-lg font-semibold text-slate-900">{job.title}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <Pill tone="blue">{job.jobType}</Pill>
              <Pill>{job.workType}</Pill>
              {job.fresherAccepted && <Pill tone="success">Fresher OK</Pill>}
            </div>
          </div>
        </div>

        <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
          <p>{job.location}</p>
          <p>{job.salary || "Thỏa thuận"}</p>
        </div>

        {skillNames.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skillNames.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-line bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        <p className="line-clamp-2 text-sm leading-6 text-slate-600">{job.description}</p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to={`/jobs/${job._id}`}
            state={{ fromJobsNavigation: true, fromPath }}
            className="inline-flex flex-1 items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Xem chi tiết
          </Link>
          <button
            type="button"
            className="inline-flex flex-1 items-center justify-center rounded-xl border border-line bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
          >
            Lưu công việc
          </button>
        </div>
      </div>
    </Panel>
  );
}
