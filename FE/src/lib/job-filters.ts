import { jobTypeOptions, workTypeOptions } from "../data/jobs";
import type { JobFilters } from "../types/job";
import type { JobType, WorkType } from "../types/job";

export const defaultJobFilters: JobFilters = {
  keyword: "",
  location: "",
  skills: [],
  workTypes: [],
  jobTypes: [],
};

function getListParam(searchParams: URLSearchParams, name: string): string[] {
  return searchParams
    .getAll(name)
    .flatMap((value) => value.split(","))
    .map((value) => value.trim())
    .filter(Boolean);
}

function filterKnownValues<T extends string>(values: string[], allowedValues: readonly T[]): T[] {
  return values.filter((value): value is T => allowedValues.includes(value as T));
}

export function parseFilters(searchParams: URLSearchParams): JobFilters {
  return {
    keyword: searchParams.get("keyword") ?? "",
    location: searchParams.get("location") ?? "",
    skills: searchParams.getAll("skill"),
    workTypes: filterKnownValues<WorkType>(getListParam(searchParams, "workType"), workTypeOptions),
    jobTypes: filterKnownValues<JobType>(getListParam(searchParams, "jobType"), jobTypeOptions),
  };
}

export function parsePage(searchParams: URLSearchParams): number {
  const page = Number(searchParams.get("page"));

  return Number.isInteger(page) && page > 0 ? page : 1;
}

export function buildSearchParams(filters: JobFilters, page = 1): URLSearchParams {
  const nextParams = new URLSearchParams();
  const trimmedKeyword = filters.keyword.trim();
  const trimmedLocation = filters.location.trim();

  if (trimmedKeyword) nextParams.set("keyword", trimmedKeyword);
  if (trimmedLocation) nextParams.set("location", trimmedLocation);
  filters.skills.forEach((skill) => nextParams.append("skill", skill));
  filters.workTypes.forEach((workType) => nextParams.append("workType", workType));
  filters.jobTypes.forEach((jobType) => nextParams.append("jobType", jobType));
  if (page > 1) nextParams.set("page", String(page));

  return nextParams;
}
