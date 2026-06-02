import { jobTypeLabels, jobTypeOptions, workTypeLabels, workTypeOptions } from "../../data/jobs";
import type { JobFilters, JobType, WorkType } from "../../types/job";
import { Panel, SectionTitle } from "./ui";

type JobFilterPanelProps = {
  filters: JobFilters;
  skillSearch: string;
  onSkillSearchChange: (value: string) => void;
  onToggleSkill: (value: string) => void;
  onToggleJobType: (value: JobType) => void;
  onToggleWorkType: (value: WorkType) => void;
  onLocationChange: (value: string) => void;
  onReset: () => void;
};

function CheckboxRow({
  checked,
  label,
  onClick,
}: {
  checked: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-slate-50">
      <input
        type="checkbox"
        checked={checked}
        onChange={onClick}
        className="h-4 w-4 rounded border-line text-primary focus:ring-primary"
      />
      <span className="text-sm text-slate-700">{label}</span>
    </label>
  );
}

export function JobFilterPanel({
  filters,
  skillSearch,
  onSkillSearchChange,
  onToggleSkill,
  onToggleJobType,
  onToggleWorkType,
  onLocationChange,
  onReset,
}: JobFilterPanelProps) {
  return (
    <Panel className="p-5">
      <div className="space-y-5">
        <SectionTitle title="Bộ lọc công việc" subtitle="Tinh chỉnh danh sách theo nhu cầu của bạn." />

        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">Kỹ năng</h3>
          <input
            value={skillSearch}
            onChange={(event) => onSkillSearchChange(event.target.value)}
            placeholder="Tìm kiếm kỹ năng..."
            className="h-11 w-full rounded-xl border border-line bg-slate-50 px-4 text-sm outline-none transition focus:border-primary focus:bg-white"
          />
          <div className="flex max-h-52 flex-wrap gap-2 overflow-y-auto pt-1">
            {filters.skills.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => onToggleSkill(skill)}
                className="rounded-full border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700"
              >
                {skill} ✕
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">Địa điểm</h3>
          <input
            value={filters.location}
            onChange={(event) => onLocationChange(event.target.value)}
            placeholder="Hà Nội, TP HCM..."
            className="h-11 w-full rounded-xl border border-line bg-slate-50 px-4 text-sm outline-none transition focus:border-primary focus:bg-white"
          />
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-900">Hình thức làm việc</h3>
          <div className="space-y-3">
            <div className="space-y-1">
              <p className="px-3 text-xs font-semibold uppercase text-slate-400">Job type</p>
              {jobTypeOptions.map((jobType) => (
                <CheckboxRow
                  key={jobType}
                  checked={filters.jobTypes.includes(jobType)}
                  label={jobTypeLabels[jobType]}
                  onClick={() => onToggleJobType(jobType)}
                />
              ))}
            </div>
            <div className="space-y-1">
              <p className="px-3 text-xs font-semibold uppercase text-slate-400">Work mode</p>
              {workTypeOptions.map((workType) => (
                <CheckboxRow
                  key={workType}
                  checked={filters.workTypes.includes(workType)}
                  label={workTypeLabels[workType]}
                  onClick={() => onToggleWorkType(workType)}
                />
              ))}
            </div>
          </div>
        </section>

        <div className="flex items-center gap-3 border-t border-line pt-4">
          <button
            type="button"
            onClick={onReset}
            className="flex-1 rounded-xl border border-line bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
          >
            Xóa tất cả
          </button>
        </div>
      </div>
    </Panel>
  );
}
