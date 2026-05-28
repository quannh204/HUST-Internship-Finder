import { Link, useParams } from "react-router-dom";
import { Panel, Pill, SectionTitle } from "../components/jobs/ui";
import { jobs } from "../data/jobs";

function BulletList({
  items,
  tone = "default",
}: {
  items: string[];
  tone?: "default" | "success" | "muted";
}) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-6">
          <span
            className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${
              tone === "success"
                ? "bg-emerald-50 text-emerald-600"
                : tone === "muted"
                  ? "bg-slate-100 text-slate-500"
                  : "bg-blue-50 text-blue-600"
            }`}
          >
            {tone === "success" ? "OK" : "-"}
          </span>
          <span className={tone === "muted" ? "text-slate-500" : "text-slate-700"}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function JobDetailPage() {
  const { id } = useParams();
  const job = jobs.find((item) => item.id === id);

  if (!job) {
    return (
      <Panel className="mx-auto max-w-2xl p-8 text-center">
        <h2 className="text-xl font-semibold text-slate-900">Không tìm thấy công việc</h2>
        <p className="mt-2 text-sm text-slate-500">Job ID không tồn tại trong mock data hiện tại.</p>
        <Link
          to="/jobs"
          className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Quay lại danh sách
        </Link>
      </Panel>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 text-center">
        <div className="flex items-center justify-start">
          <Link to="/jobs" className="text-sm font-medium text-primary transition hover:text-blue-700">
            Quay lại
          </Link>
        </div>
        <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Chi tiết công việc</h1>
      </div>

      <div className="mx-auto w-full max-w-5xl space-y-5">
        <Panel className="p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-xl font-semibold text-primary">
                {job.companyLogoText}
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-500">{job.companyName}</p>
                  <h2 className="text-2xl font-semibold text-slate-900">{job.title}</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Pill tone="blue">{job.jobType}</Pill>
                  <Pill>{job.level}</Pill>
                  <Pill>{job.workType}</Pill>
                </div>
              </div>
            </div>
            <div className="grid gap-2 text-sm text-slate-600 sm:text-right">
              <p>{job.location}</p>
              <p>{job.salary}</p>
              <p>{job.duration}</p>
            </div>
          </div>
        </Panel>

        <Panel className="p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 sm:flex-1"
            >
              Ứng tuyển
            </button>
            <button
              type="button"
              className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 sm:flex-1"
            >
              Đã lưu
            </button>
            <button
              type="button"
              className="rounded-xl border border-line bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 sm:flex-1"
            >
              Tạm bỏ qua
            </button>
          </div>
        </Panel>

        <Panel className="p-5 sm:p-6">
          <div className="space-y-4">
            <SectionTitle title="Mô tả công việc" />
            <p className="text-sm leading-7 text-slate-600">{job.description}</p>
            <BulletList items={job.responsibilities} />
          </div>
        </Panel>

        <Panel className="p-5 sm:p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <SectionTitle title="Phải có" />
              <BulletList items={job.mustHave} tone="success" />
            </div>
            <div className="space-y-4">
              <SectionTitle title="Nice to have" />
              <BulletList items={job.niceToHave} tone="muted" />
            </div>
          </div>
        </Panel>

        <Panel className="p-5 sm:p-6">
          <div className="space-y-4">
            <SectionTitle title="Kỹ năng" />
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-line bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </Panel>

        <Panel className="p-5 sm:p-6">
          <div className="space-y-4">
            <SectionTitle title="Lợi ích" />
            <BulletList items={job.benefits} />
          </div>
        </Panel>
      </div>
    </div>
  );
}
