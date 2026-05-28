import type { JobFilters } from "../types/job";

export const defaultJobFilters: JobFilters = {
  keyword: "",
  location: "",
  skills: [],
};

export function parseFilters(searchParams: URLSearchParams): JobFilters {
  return {
    keyword: searchParams.get("keyword") ?? "",
    location: searchParams.get("location") ?? "",
    skills: searchParams.getAll("skill"),
  };
}

export function buildSearchParams(filters: JobFilters): URLSearchParams {
  const nextParams = new URLSearchParams();
  const trimmedKeyword = filters.keyword.trim();
  const trimmedLocation = filters.location.trim();

  if (trimmedKeyword) nextParams.set("keyword", trimmedKeyword);
  if (trimmedLocation) nextParams.set("location", trimmedLocation);
  filters.skills.forEach((skill) => nextParams.append("skill", skill));

  return nextParams;
}
