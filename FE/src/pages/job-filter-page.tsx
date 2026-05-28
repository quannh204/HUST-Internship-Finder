import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { JobFilterPanel } from "../components/jobs/job-filter-panel";
import { SectionTitle } from "../components/jobs/ui";
import { buildSearchParams, defaultJobFilters, parseFilters } from "../lib/job-filters";
import type { Degree, ExperienceLevel, JobFilters, JobType } from "../types/job";

function toggleValue<T extends string>(values: T[], value: T) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

export function JobFilterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [skillSearch, setSkillSearch] = useState("");
  const [draftFilters, setDraftFilters] = useState<JobFilters>(() => parseFilters(searchParams));

  function patchFilters(patch: Partial<JobFilters>) {
    setDraftFilters((current) => ({
      ...current,
      ...patch,
    }));
  }

  function saveFilters() {
    navigate({
      pathname: "/jobs",
      search: `?${buildSearchParams(draftFilters).toString()}`,
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <Link to="/jobs" className="text-sm font-medium text-primary transition hover:text-blue-700">
            Quay lại danh sách
          </Link>
          <SectionTitle
            title="Bộ lọc công việc"
            subtitle="Trang riêng cho mobile hoặc khi cần chỉnh toàn bộ bộ lọc."
          />
        </div>
      </div>

      <JobFilterPanel
        filters={draftFilters}
        skillSearch={skillSearch}
        onSkillSearchChange={setSkillSearch}
        onToggleSkill={(value) => patchFilters({ skills: toggleValue(draftFilters.skills, value) })}
        onToggleJobType={(value: JobType) => patchFilters({ jobTypes: toggleValue(draftFilters.jobTypes, value) })}
        onToggleLevel={(value: ExperienceLevel) => patchFilters({ levels: toggleValue(draftFilters.levels, value) })}
        onToggleDegree={(value: Degree) => patchFilters({ degrees: toggleValue(draftFilters.degrees, value) })}
        onPositionChange={(position) => patchFilters({ position })}
        onReset={() => setDraftFilters(defaultJobFilters)}
        onSave={saveFilters}
      />
    </div>
  );
}
