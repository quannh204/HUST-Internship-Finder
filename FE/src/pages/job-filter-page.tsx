import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { JobFilterPanel } from "../components/jobs/job-filter-panel";
import { SectionTitle } from "../components/jobs/ui";
import { buildSearchParams, defaultJobFilters, parseFilters } from "../lib/job-filters";
import type { JobFilters } from "../types/job";

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
            subtitle="Tinh chỉnh tìm kiếm theo nhu cầu của bạn."
          />
        </div>
      </div>

      <JobFilterPanel
        filters={draftFilters}
        skillSearch={skillSearch}
        onSkillSearchChange={setSkillSearch}
        onToggleSkill={(value) => patchFilters({ skills: toggleValue(draftFilters.skills, value) })}
        onToggleJobType={(value) => patchFilters({ jobTypes: toggleValue(draftFilters.jobTypes, value) })}
        onToggleWorkType={(value) => patchFilters({ workTypes: toggleValue(draftFilters.workTypes, value) })}
        onLocationChange={(location) => patchFilters({ location })}
        onReset={() => setDraftFilters(defaultJobFilters)}
      />

      <button
        type="button"
        onClick={saveFilters}
        className="rounded-xl bg-primary px-6 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
      >
        Áp dụng bộ lọc
      </button>
    </div>
  );
}
