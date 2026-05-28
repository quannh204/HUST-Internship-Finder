import type { Job, JobFilters } from "../types/job";

export const defaultJobFilters: JobFilters = {
  keyword: "",
  location: "",
  skills: [],
  jobTypes: [],
  levels: [],
  degrees: [],
  position: "",
};

export function parseFilters(searchParams: URLSearchParams): JobFilters {
  return {
    keyword: searchParams.get("keyword") ?? "",
    location: searchParams.get("location") ?? "",
    position: searchParams.get("position") ?? "",
    skills: searchParams.getAll("skill"),
    jobTypes: searchParams.getAll("jobType") as JobFilters["jobTypes"],
    levels: searchParams.getAll("level") as JobFilters["levels"],
    degrees: searchParams.getAll("degree") as JobFilters["degrees"],
  };
}

export function buildSearchParams(filters: JobFilters): URLSearchParams {
  const nextParams = new URLSearchParams();
  const trimmedKeyword = filters.keyword.trim();
  const trimmedLocation = filters.location.trim();
  const trimmedPosition = filters.position.trim();

  if (trimmedKeyword) nextParams.set("keyword", trimmedKeyword);
  if (trimmedLocation) nextParams.set("location", trimmedLocation);
  if (trimmedPosition) nextParams.set("position", trimmedPosition);
  filters.skills.forEach((skill) => nextParams.append("skill", skill));
  filters.jobTypes.forEach((jobType) => nextParams.append("jobType", jobType));
  filters.levels.forEach((level) => nextParams.append("level", level));
  filters.degrees.forEach((degree) => nextParams.append("degree", degree));

  return nextParams;
}

export function filterJobs(jobs: Job[], filters: JobFilters) {
  const keyword = filters.keyword.trim().toLowerCase();
  const location = filters.location.trim().toLowerCase();
  const position = filters.position.trim().toLowerCase();

  return jobs.filter((job) => {
    const searchTarget = [
      job.companyName,
      job.title,
      job.description,
      ...job.skills,
    ]
      .join(" ")
      .toLowerCase();

    if (keyword && !searchTarget.includes(keyword)) {
      return false;
    }

    if (location && !job.location.toLowerCase().includes(location)) {
      return false;
    }

    if (position && !job.title.toLowerCase().includes(position)) {
      return false;
    }

    if (filters.skills.length > 0 && !filters.skills.every((skill) => job.skills.includes(skill))) {
      return false;
    }

    if (filters.jobTypes.length > 0 && !filters.jobTypes.includes(job.jobType)) {
      return false;
    }

    if (filters.levels.length > 0 && !filters.levels.includes(job.level)) {
      return false;
    }

    if (filters.degrees.length > 0 && !filters.degrees.every((degree) => job.degreeRequirements.includes(degree))) {
      return false;
    }

    return true;
  });
}
