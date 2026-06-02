import type { JobType, WorkType } from "../types/job";

export const jobTypeOptions: JobType[] = ["FULL_TIME", "PART_TIME", "INTERNSHIP"];

export const workTypeOptions: WorkType[] = ["OFFLINE", "REMOTE", "HYBRID"];

export const jobTypeLabels: Record<JobType, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  INTERNSHIP: "Internship",
};

export const workTypeLabels: Record<WorkType, string> = {
  OFFLINE: "On-site",
  REMOTE: "Remote",
  HYBRID: "Hybrid",
};
