import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Panel, Pill } from "../components/jobs/ui";
import { jobApi } from "../lib/api";
import type { Job } from "../types/job";

function getCompanyInitials(companyName: string): string {
  return companyName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

type JobDetailLocationState = {
  fromJobsNavigation?: boolean;
  fromPath?: string;
};

function isJobsReturnPath(path: string) {
  return path === "/jobs" || path.startsWith("/jobs?") || path === "/jobs/filter" || path.startsWith("/jobs/filter?");
}

function ArrowLeftIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
  );
}

const backButtonClassName =
  "inline-flex items-center justify-center gap-2 rounded-full border border-line bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-primary hover:bg-primary-soft hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface";

function BackToJobsButton({
  className = "",
  onClick,
}: {
  className?: string;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className={`${backButtonClassName} ${className}`}>
      <ArrowLeftIcon />
      <span>Quay lại danh sách</span>
    </button>
  );
}

export function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const routeState = location.state as JobDetailLocationState | null;
  const returnPath =
    routeState?.fromPath && isJobsReturnPath(routeState.fromPath) ? routeState.fromPath : "/jobs";
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function handleBackToJobs() {
    const historyState = window.history.state as { idx?: number } | null;
    const canUseHistoryReturn =
      routeState?.fromJobsNavigation === true &&
      typeof historyState?.idx === "number" &&
      historyState.idx > 0;

    if (canUseHistoryReturn) {
      navigate(-1);
      return;
    }

    navigate(returnPath);
  }

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await jobApi.getJobById(id);
        setJob(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch job");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <Panel className="mx-auto max-w-2xl p-8 text-center">
        <p className="text-slate-500">Đang tải thông tin công việc...</p>
      </Panel>
    );
  }

  if (error) {
    return (
      <Panel className="mx-auto max-w-2xl border border-red-200 bg-red-50 p-8 text-center">
        <h2 className="text-xl font-semibold text-red-600">Lỗi</h2>
        <p className="mt-2 text-sm text-red-500">{error}</p>
        <BackToJobsButton onClick={handleBackToJobs} className="mt-6" />
      </Panel>
    );
  }

  if (!job) {
    return (
      <Panel className="mx-auto max-w-2xl p-8 text-center">
        <h2 className="text-xl font-semibold text-slate-900">Không tìm thấy công việc</h2>
        <p className="mt-2 text-sm text-slate-500">Công việc bạn tìm kiếm không tồn tại.</p>
        <BackToJobsButton onClick={handleBackToJobs} className="mt-6" />
      </Panel>
    );
  }

  const skillNames = Array.isArray(job.skills) 
    ? job.skills.map(s => typeof s === 'string' ? s : s.name)
    : [];

  const initials = getCompanyInitials(job.companyName);

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <BackToJobsButton onClick={handleBackToJobs} />
      </div>

      <div className="mx-auto w-full max-w-5xl space-y-5">
        <Panel className="p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-2xl font-semibold text-primary">
                {initials}
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-500">{job.companyName}</p>
                  <h2 className="text-2xl font-semibold text-slate-900">{job.title}</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Pill tone="blue">{job.jobType}</Pill>
                  <Pill>{job.workType}</Pill>
                  {job.fresherAccepted && <Pill tone="success">Fresher OK</Pill>}
                </div>
              </div>
            </div>
            <div className="space-y-2 text-right text-sm text-slate-600">
              <p>
                <span className="block text-xs font-semibold uppercase text-slate-500">Địa điểm</span>
                {job.location}
              </p>
              <p>
                <span className="block text-xs font-semibold uppercase text-slate-500">Mức lương</span>
                {job.salary || "Thỏa thuận"}
              </p>
              <p>
                <span className="block text-xs font-semibold uppercase text-slate-500">Hạn nộp</span>
                {new Date(job.deadline).toLocaleDateString("vi-VN")}
              </p>
            </div>
          </div>
        </Panel>

        <Panel className="p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row">
            <button className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 sm:flex-1">
              Ứng tuyển ngay
            </button>
            <button className="rounded-xl border border-line bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary sm:flex-1">
              Lưu công việc
            </button>
          </div>
        </Panel>

        {/* Description */}
        <Panel className="p-5 sm:p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Mô tả công việc</h2>
            <p className="whitespace-pre-wrap leading-relaxed text-slate-700">{job.description}</p>
          </div>
        </Panel>

        {/* Requirements */}
        <Panel className="p-5 sm:p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Yêu cầu</h2>
            <p className="whitespace-pre-wrap leading-relaxed text-slate-700">{job.requirements}</p>
          </div>
        </Panel>

        {/* Skills */}
        {skillNames.length > 0 && (
          <Panel className="p-5 sm:p-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Kỹ năng cần thiết</h2>
              <div className="flex flex-wrap gap-2">
                {skillNames.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </Panel>
        )}

        {/* Additional Info */}
        {(job.experience || job.foreignLanguageAbility) && (
          <Panel className="p-5 sm:p-6">
            <div className="grid gap-6 sm:grid-cols-2">
              {job.experience && (
                <div>
                  <h3 className="font-semibold text-slate-900">Kinh nghiệm</h3>
                  <p className="mt-2 text-slate-700">{job.experience}</p>
                </div>
              )}
              {job.foreignLanguageAbility && (
                <div>
                  <h3 className="font-semibold text-slate-900">Yêu cầu ngoại ngữ</h3>
                  <p className="mt-2 text-slate-700">{job.foreignLanguageAbility}</p>
                </div>
              )}
            </div>
          </Panel>
        )}
      </div>
    </div>
  );
}
