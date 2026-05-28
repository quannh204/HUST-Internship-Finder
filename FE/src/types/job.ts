export type JobType =
  | "Internship"
  | "Fresher"
  | "Full-time"
  | "Part-time"
  | "Contract"
  | "Temporary";

export type ExperienceLevel =
  | "Fresher"
  | "Junior"
  | "Mid"
  | "Senior"
  | "Lead"
  | "Manager";

export type WorkType = "Remote" | "Hybrid" | "Onsite";

export type Degree = "Bachelor" | "Associate" | "Final-year" | "Certification";

export type Job = {
  id: string;
  companyName: string;
  companyLogoText: string;
  title: string;
  jobType: JobType;
  level: ExperienceLevel;
  location: string;
  workType: WorkType;
  salary: string;
  duration: string;
  skills: string[];
  description: string;
  responsibilities: string[];
  mustHave: string[];
  niceToHave: string[];
  benefits: string[];
  degreeRequirements: Degree[];
};

export type JobFilters = {
  keyword: string;
  location: string;
  skills: string[];
  jobTypes: JobType[];
  levels: ExperienceLevel[];
  degrees: Degree[];
  position: string;
};
