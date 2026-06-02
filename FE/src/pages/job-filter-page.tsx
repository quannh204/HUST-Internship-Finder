import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { JobFilterPanel } from "../components/jobs/job-filter-panel";
import { SectionTitle, Panel } from "../components/jobs/ui";
import { buildSearchParams, defaultJobFilters, parseFilters } from "../lib/job-filters";
import { jobApi } from "../lib/api";
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
  const [availableSkills, setAvailableSkills] = useState<Array<{ _id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await jobApi.getSkills();
        setAvailableSkills(response.data);
      } catch (err) {
        console.error("Failed to fetch skills:", err);
      } finally {
        setLoading(false);
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
    navigate({
      pathname: "/jobs",
      search: `?${buildSearchParams(draftFilters).toString()}`,
    });
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8">
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

          {loading ? (
            <Panel className="p-8 text-center">
              <p className="text-slate-500">Đang tải danh sách kỹ năng...</p>
            </Panel>
          ) : (
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
          )}

          <button
            type="button"
            onClick={saveFilters}
            className="rounded-xl bg-primary px-6 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
          >
            Áp dụng bộ lọc
          </button>
        </div>
      </div>
    </div>
  );
}