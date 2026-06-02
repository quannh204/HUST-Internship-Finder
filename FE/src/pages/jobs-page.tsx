import { useEffect, useLayoutEffect, useRef, useState, type UIEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { JobCard } from "../components/jobs/job-card";
import { JobFilterPanel } from "../components/jobs/job-filter-panel";
import { JobSearchBar } from "../components/jobs/job-search-bar";
import { Pagination } from "../components/jobs/pagination";
import { Panel, SectionTitle } from "../components/jobs/ui";
import { jobApi } from "../lib/api";
import { buildSearchParams, defaultJobFilters, parseFilters, parsePage } from "../lib/job-filters";
import type { Job, JobFilters, JobsResponse } from "../types/job";

const PAGE_SIZE = 10;

type SearchDraft = {
  searchKey: string;
  keyword: string;
  location: string;
};

function toggleValue<T extends string>(values: T[], value: T) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

function getSavedScrollPosition(key: string) {
  try {
    const savedPosition = Number(window.sessionStorage.getItem(key));

    return Number.isFinite(savedPosition) && savedPosition > 0 ? savedPosition : 0;
  } catch {
    return 0;
  }
}

function saveScrollPosition(key: string, position: number) {
  try {
    window.sessionStorage.setItem(key, String(position));
  } catch {
    // Session storage can be unavailable in restricted browser contexts.
  }
}

export function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = parseFilters(searchParams);
  const currentPage = parsePage(searchParams);
  const currentSearch = searchParams.toString();
  const filterPagePath = currentSearch ? `/jobs/filter?${currentSearch}` : "/jobs/filter";
  const listScrollKey = `jobs-list-scroll:/jobs?${currentSearch}`;
  const jobsListRef = useRef<HTMLDivElement>(null);
  const [skillSearch, setSkillSearch] = useState("");
  const [searchDraft, setSearchDraft] = useState<SearchDraft>(() => ({
    searchKey: currentSearch,
    keyword: filters.keyword,
    location: filters.location,
  }));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const selectedSkills = filters.skills.join(",");
  const selectedWorkTypes = filters.workTypes.join(",");
  const selectedJobTypes = filters.jobTypes.join(",");
  const isSearchDraftCurrent = searchDraft.searchKey === currentSearch;
  const keywordInput = isSearchDraftCurrent ? searchDraft.keyword : filters.keyword;
  const locationInput = isSearchDraftCurrent ? searchDraft.location : filters.location;

  useLayoutEffect(() => {
    if (loading) return;

    const listElement = jobsListRef.current;
    if (!listElement) return;

    const frameId = window.requestAnimationFrame(() => {
      listElement.scrollTop = getSavedScrollPosition(listScrollKey);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [jobs.length, listScrollKey, loading]);

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
    setSearchParams(buildSearchParams(nextFilters));
  }

  function updatePage(page: number) {
    setSearchParams(buildSearchParams(filters, page));
  }

  function handleListScroll(event: UIEvent<HTMLDivElement>) {
    saveScrollPosition(listScrollKey, event.currentTarget.scrollTop);
  }

  function updateKeywordInput(keyword: string) {
    setSearchDraft({
      searchKey: currentSearch,
      keyword,
      location: locationInput,
    });
  }

  function updateLocationInput(location: string) {
    setSearchDraft({
      searchKey: currentSearch,
      keyword: keywordInput,
      location,
    });
  }

  function patchFilters(patch: Partial<JobFilters>) {
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
            onKeywordChange={updateKeywordInput}
            onLocationChange={updateLocationInput}
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
                    setSearchDraft({
                      searchKey: "",
                      keyword: defaultJobFilters.keyword,
                      location: defaultJobFilters.location,
                    });
                    updateFilters(defaultJobFilters);
                  }}
                />
              </div>
            </aside>

            {/* Jobs List - scroll riêng phần này */}
            <div className="flex min-h-0 flex-col">
              <div ref={jobsListRef} onScroll={handleListScroll} className="min-h-0 flex-1 overflow-y-auto">
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
                      to={filterPagePath}
                      className="inline-flex items-center justify-center rounded-xl border border-line bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface lg:hidden"
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
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={updatePage} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
