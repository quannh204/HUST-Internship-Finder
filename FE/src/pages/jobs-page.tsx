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
  const [keywordInput, setKeywordInput] = useState(filters.keyword);
  const [locationInput, setLocationInput] = useState(filters.location);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const selectedSkills = filters.skills.join(",");
  const selectedWorkTypes = filters.workTypes.join(",");
  const selectedJobTypes = filters.jobTypes.join(",");

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        let response: JobsResponse;
        const apiFilters = {
          location: filters.location || undefined,
          skills: selectedSkills || undefined,
          workType: selectedWorkTypes || undefined,
          jobType: selectedJobTypes || undefined,
        };
        
        if (filters.keyword) {
          response = await jobApi.searchJobs(
            filters.keyword,
            currentPage,
            PAGE_SIZE,
            apiFilters
          );
        } else {
          response = await jobApi.getJobs(currentPage, PAGE_SIZE, apiFilters);
        }
    
        setJobs(response.data);
        setTotalPages(response.pagination.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [currentPage, filters.location, filters.keyword, selectedJobTypes, selectedSkills, selectedWorkTypes]);

  function updateFilters(nextFilters: JobFilters) {
    setCurrentPage(1);
    setSearchParams(buildSearchParams(nextFilters));
  }

  function patchFilters(patch: Partial<JobFilters>) {
    if (patch.keyword !== undefined) {
      setKeywordInput(patch.keyword);
    }

    if (patch.location !== undefined) {
      setLocationInput(patch.location);
    }

    updateFilters({
      ...filters,
      ...patch,
    });
  }

  return (
    <div className="flex min-h-[calc(100dvh-80px)] flex-1 flex-col">
      {/* Fixed Header */}
      <div className="shrink-0 bg-white px-4 sm:px-6 lg:px-8 py-4 border-b border-line">
        <div className="mx-auto max-w-7xl">
          <SectionTitle
            title="Danh sách việc làm"
            subtitle="Tìm kiếm công việc phù hợp từ các công ty hàng đầu."
          />

          <JobSearchBar
            keyword={keywordInput}
            location={locationInput}
            onKeywordChange={(keyword) => setKeywordInput(keyword)}
            onLocationChange={(location) => setLocationInput(location)}
            onSearch={() => {
              patchFilters({ keyword: keywordInput, location: locationInput });
            }}
          />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 min-h-0 overflow-hidden px-4 sm:px-6 lg:px-8 py-6">
        <div className="mx-auto max-w-7xl h-full">
          <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] h-full">
            <aside className="hidden lg:block min-h-0">
              <div className="h-full overflow-y-auto">
                <JobFilterPanel
                  filters={filters}
                  skillSearch={skillSearch}
                  onSkillSearchChange={setSkillSearch}
                  onToggleSkill={(value) => patchFilters({ skills: toggleValue(filters.skills, value) })}
                  onToggleJobType={(value) => patchFilters({ jobTypes: toggleValue(filters.jobTypes, value) })}
                  onToggleWorkType={(value) => patchFilters({ workTypes: toggleValue(filters.workTypes, value) })}
                  onLocationChange={(location) => patchFilters({ location })}
                  onReset={() => {
                    setKeywordInput(defaultJobFilters.keyword);
                    setLocationInput(defaultJobFilters.location);
                    updateFilters(defaultJobFilters);
                  }}
                />
              </div>
            </aside>

            {/* Jobs List - scroll riêng phần này */}
            <div className="flex min-h-0 flex-col">
              <div className="min-h-0 flex-1 overflow-y-auto">
                <div className="flex flex-col gap-5 pb-6">
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
                  <div className="gap-4 flex flex-col">
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

                </div>
              </div>
              <div className="shrink-0 border-t border-line bg-surface/95 py-4">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
