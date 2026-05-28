import { degreeOptions, jobTypeOptions, levelOptions, skillsCatalog } from "../../data/jobs";
import type { JobFilters } from "../../types/job";
import { Panel, SectionTitle } from "./ui";

type JobFilterPanelProps = {
  filters: JobFilters;
  skillSearch: string;
  onSkillSearchChange: (value: string) => void;
  onToggleSkill: (value: string) => void;
  onToggleJobType: (value: JobFilters["jobTypes"][number]) => void;
  onToggleLevel: (value: JobFilters["levels"][number]) => void;
  onToggleDegree: (value: JobFilters["degrees"][number]) => void;
  onPositionChange: (value: string) => void;
  onReset: () => void;
  onSave: () => void;
  showSave?: boolean;
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
  onToggleLevel,
  onToggleDegree,
  onPositionChange,
  onReset,
  onSave,
  showSave = true,
}: JobFilterPanelProps) {
  const visibleSkills = skillsCatalog.filter((skill) =>
    skill.toLowerCase().includes(skillSearch.trim().toLowerCase()),
  );

  return (
    <Panel className="p-5">
      <div className="space-y-5">
        <SectionTitle title="Bộ lọc công việc" subtitle="Tinh chỉnh danh sách theo nhu cầu của bạn." />

        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">Kỹ năng</h3>
          <input
            value={skillSearch}
            onChange={(event) => onSkillSearchChange(event.target.value)}
            placeholder="Tìm React, Node.js..."
            className="h-11 w-full rounded-xl border border-line bg-slate-50 px-4 text-sm outline-none transition focus:border-primary focus:bg-white"
          />
          <div className="flex max-h-52 flex-wrap gap-2 overflow-y-auto pt-1">
            {visibleSkills.map((skill) => {
              const active = filters.skills.includes(skill);

              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => onToggleSkill(skill)}
                  className={`rounded-full border px-3 py-2 text-sm transition ${
                    active
                      ? "border-blue-200 bg-blue-50 text-blue-700"
                      : "border-line bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {skill}
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">Vị trí mong muốn</h3>
          <input
            value={filters.position}
            onChange={(event) => onPositionChange(event.target.value)}
            placeholder="Frontend Developer, UI Engineer..."
            className="h-11 w-full rounded-xl border border-line bg-slate-50 px-4 text-sm outline-none transition focus:border-primary focus:bg-white"
          />
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-900">Hình thức tuyển dụng</h3>
          <div className="space-y-1">
            {jobTypeOptions.map((jobType) => (
              <CheckboxRow
                key={jobType}
                checked={filters.jobTypes.includes(jobType)}
                label={jobType}
                onClick={() => onToggleJobType(jobType)}
              />
            ))}
          </div>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-900">Trình độ</h3>
          <div className="space-y-1">
            {levelOptions.map((level) => (
              <CheckboxRow
                key={level}
                checked={filters.levels.includes(level)}
                label={level}
                onClick={() => onToggleLevel(level)}
              />
            ))}
          </div>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-900">Bằng cấp</h3>
          <div className="flex flex-wrap gap-2">
            {degreeOptions.map((degree) => {
              const active = filters.degrees.includes(degree);

              return (
                <button
                  key={degree}
                  type="button"
                  onClick={() => onToggleDegree(degree)}
                  className={`rounded-full border px-3 py-2 text-sm transition ${
                    active
                      ? "border-blue-200 bg-blue-50 text-blue-700"
                      : "border-line bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {degree}
                </button>
              );
            })}
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
          {showSave ? (
            <button
              type="button"
              onClick={onSave}
              className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Lưu cài đặt
            </button>
          ) : null}
        </div>
      </div>
    </Panel>
  );
}
