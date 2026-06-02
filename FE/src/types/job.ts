export type JobType = "PART_TIME" | "FULL_TIME" | "INTERNSHIP";

export type WorkType = "OFFLINE" | "REMOTE" | "HYBRID";

export type JobStatus = "ACTIVE" | "EXPIRED" | "DRAFT";

export type Skill = {
  _id: string;
  name: string;
};

export type Major = {
  _id: string;
  name: string;
};

export type Job = {
  _id: string;
  companyName: string;
  title: string;
  jobType: JobType;
  description: string;
  requirements: string;
  skills?: Skill[];
  majors?: Major[];
  foreignLanguageAbility?: string;
  location: string;
  workType: WorkType;
  experience?: string;
  fresherAccepted?: boolean;
  salary?: string;
  deadline: string;
  sourceLink?: string;
  status?: JobStatus;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
};

export type Pagination = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type JobsResponse = {
  data: Job[];
  pagination: Pagination;
};

export type JobFilters = {
  keyword: string;
  location: string;
  skills: string[];
  workTypes: WorkType[];
  experience?: string;
  fresherAccepted?: boolean;
  jobTypes: JobType[];
  position?: string;
};
