import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { JobCard } from "../components/jobs/job-card";
import { JobFilterPanel } from "../components/jobs/job-filter-panel";
import { JobSearchBar } from "../components/jobs/job-search-bar";
import { Pagination } from "../components/jobs/pagination";
import { Panel, SectionTitle } from "../components/jobs/ui";
import { jobApi } from "../lib/api";
import { buildSearchParams, defaultJobFilters, parseFilters } from "../lib/job-filters";
import type { Job, JobFilters, JobsResponse } from "../types/job";

const PAGE_SIZE = 10;

function toggleValue<T extends string>(values: T[], value: T) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

export function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = parseFilters(searchParams);
  const [currentPage, setCurrentPage] = useState(1);
  const [skillSearch, setSkillSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await jobApi.getJobs(currentPage, PAGE_SIZE, {
          location: filters.location || undefined,
        });
        setJobs(response.data);
        setTotalPages(response.pagination.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [currentPage, filters.location]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchParams]);

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
        subtitle="Tìm kiếm công việc phù hợp từ các công ty hàng đầu."
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
              onLocationChange={(location) => patchFilters({ location })}
              onReset={() => updateFilters(defaultJobFilters)}
            />
          </div>
        </aside>

        <div className="space-y-5">
          <Panel className="p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-500">Trạng thái</p>
                <p className="text-lg font-semibold text-slate-900">
                  {loading ? "Đang tải..." : `${jobs.length} công việc`}
                </p>
              </div>
              <Link
                to="/jobs/filter"
                className="inline-flex items-center justify-center rounded-xl border border-line bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary lg:hidden"
              >
                Mở bộ lọc
              </Link>
            </div>
          </Panel>

          {error && (
            <Panel className="border border-red-200 bg-red-50 p-5 text-center">
              <p className="text-sm text-red-600">Lỗi: {error}</p>
            </Panel>
          )}

          {loading ? (
            <Panel className="p-8 text-center">
              <p className="text-slate-500">Đang tải danh sách công việc...</p>
            </Panel>
          ) : jobs.length > 0 ? (
            <div className="space-y-4">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
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

          {totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          )}
        </div>
      </div>
    </div>
  );
}
