import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { JobFilterPanel } from "../components/jobs/job-filter-panel";
import { SectionTitle } from "../components/jobs/ui";
import { jobApi } from "../lib/api";
import { buildSearchParams, defaultJobFilters, parseFilters, parsePage } from "../lib/job-filters";
import type { JobFilters } from "../types/job";

function toggleValue<T extends string>(values: T[], value: T) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

function getSearchString(searchParams: URLSearchParams) {
  const search = searchParams.toString();

  return search ? `?${search}` : "";
}

function areFiltersEqual(firstFilters: JobFilters, secondFilters: JobFilters) {
  return buildSearchParams(firstFilters).toString() === buildSearchParams(secondFilters).toString();
}

export function JobFilterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentFilters = parseFilters(searchParams);
  // const jobsPath = `/jobs${getSearchString(searchParams)}`;
  const [skillSearch, setSkillSearch] = useState("");
  const [draftFilters, setDraftFilters] = useState<JobFilters>(() => parseFilters(searchParams));
  const [availableSkills, setAvailableSkills] = useState<Array<{ _id: string; name: string }>>([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await jobApi.getSkills();
        setAvailableSkills(response.data);
      } catch (err) {
        console.error("Failed to fetch skills:", err);
      }
    };

    fetchSkills();
  }, []);

  function patchFilters(patch: Partial<JobFilters>) {
    setDraftFilters((current) => ({
      ...current,
      ...patch,
    }));
  }

  function saveFilters() {
    const shouldKeepCurrentPage = areFiltersEqual(currentFilters, draftFilters);
    const nextParams = buildSearchParams(
      draftFilters,
      shouldKeepCurrentPage ? parsePage(searchParams) : 1
    );

    navigate({
      pathname: "/jobs",
      search: getSearchString(nextParams),
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm font-medium">
            <Link
              to="/"
              className="rounded-md text-slate-500 transition hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              Trang chủ
            </Link>

            <span aria-hidden="true" className="text-slate-300">
              &gt;
            </span>
            <span className="text-slate-900">Bộ lọc nâng cao</span>
          </nav>
          <SectionTitle
            title="Bộ lọc nâng cao"
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
        availableSkills={availableSkills}
      />

      <button
        type="button"
        onClick={saveFilters}
        className="rounded-xl bg-primary px-6 py-3 text-center font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
      >
        Áp dụng bộ lọc
      </button>
    </div>
  );
}
