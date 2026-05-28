import { useDeferredValue, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { JobCard } from "../components/jobs/job-card";
import { JobFilterPanel } from "../components/jobs/job-filter-panel";
import { JobSearchBar } from "../components/jobs/job-search-bar";
import { Pagination } from "../components/jobs/pagination";
import { Panel, SectionTitle } from "../components/jobs/ui";
import { jobs } from "../data/jobs";
import { buildSearchParams, defaultJobFilters, filterJobs, parseFilters } from "../lib/job-filters";
import type { Degree, ExperienceLevel, JobFilters, JobType } from "../types/job";

const PAGE_SIZE = 4;

function toggleValue<T extends string>(values: T[], value: T) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

export function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = parseFilters(searchParams);
  const deferredKeyword = useDeferredValue(filters.keyword);
  const deferredLocation = useDeferredValue(filters.location);
  const [currentPage, setCurrentPage] = useState(1);
  const [skillSearch, setSkillSearch] = useState("");

  const effectiveFilters: JobFilters = {
    ...filters,
    keyword: deferredKeyword,
    location: deferredLocation,
  };

  const filteredJobs = filterJobs(jobs, effectiveFilters);
  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / PAGE_SIZE));
  const visibleJobs = filteredJobs.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchParams]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  function updateFilters(nextFilters: JobFilters) {
    setSearchParams(buildSearchParams(nextFilters));
  }

  function patchFilters(patch: Partial<JobFilters>) {
    updateFilters({
      ...filters,
      ...patch,
    });
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Danh sách việc làm"
        subtitle="Danh sách công việc hiện đại, tối giản và responsive với mock data."
      />

      <JobSearchBar
        keyword={filters.keyword}
        location={filters.location}
        onKeywordChange={(keyword) => patchFilters({ keyword })}
        onLocationChange={(location) => patchFilters({ location })}
      />

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-6">
            <JobFilterPanel
              filters={filters}
              skillSearch={skillSearch}
              onSkillSearchChange={setSkillSearch}
              onToggleSkill={(value) => patchFilters({ skills: toggleValue(filters.skills, value) })}
              onToggleJobType={(value: JobType) => patchFilters({ jobTypes: toggleValue(filters.jobTypes, value) })}
              onToggleLevel={(value: ExperienceLevel) => patchFilters({ levels: toggleValue(filters.levels, value) })}
              onToggleDegree={(value: Degree) => patchFilters({ degrees: toggleValue(filters.degrees, value) })}
              onPositionChange={(position) => patchFilters({ position })}
              onReset={() => updateFilters(defaultJobFilters)}
              onSave={() => updateFilters(filters)}
            />
          </div>
        </aside>

        <div className="space-y-5">
          <Panel className="p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-500">Kết quả hiển thị</p>
                <p className="text-lg font-semibold text-slate-900">{filteredJobs.length} công việc</p>
              </div>
              <Link
                to="/jobs/filter"
                className="inline-flex items-center justify-center rounded-xl border border-line bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary lg:hidden"
              >
                Mở bộ lọc
              </Link>
            </div>
          </Panel>

          {visibleJobs.length > 0 ? (
            <div className="space-y-4">
              {visibleJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <Panel className="p-8 text-center">
              <h3 className="text-lg font-semibold text-slate-900">Không tìm thấy công việc</h3>
              <p className="mt-2 text-sm text-slate-500">
                Hãy thử giảm số lượng bộ lọc hoặc đổi từ khóa tìm kiếm.
              </p>
            </Panel>
          )}

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>
    </div>
  );
}
