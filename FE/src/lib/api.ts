import type { Job, JobsResponse } from "../types/job";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api";

export const jobApi = {
  /**
   * Get paginated jobs with optional filters
   */
  async getJobs(
    page = 1,
    limit = 10,
    filters?: {
      position?: string;
      skills?: string;
      majors?: string;
      foreignLanguageAbility?: string;
      location?: string;
      workType?: string;
      experience?: string;
      fresherAccepted?: boolean;
      jobType?: string;
    }
  ): Promise<JobsResponse> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    if (filters) {
      if (filters.position) params.append("position", filters.position);
      if (filters.skills) params.append("skills", filters.skills);
      if (filters.majors) params.append("majors", filters.majors);
      if (filters.foreignLanguageAbility)
        params.append("foreignLanguageAbility", filters.foreignLanguageAbility);
      if (filters.location) params.append("location", filters.location);
      if (filters.workType) params.append("workType", filters.workType);
      if (filters.experience) params.append("experience", filters.experience);
      if (filters.fresherAccepted !== undefined)
        params.append("fresherAccepted", filters.fresherAccepted.toString());
      if (filters.jobType) params.append("jobType", filters.jobType);
    }

    const response = await fetch(`${API_BASE_URL}/jobs?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch jobs: ${response.statusText}`);
    }
    return response.json();
  },

  /**
   * Search jobs by keyword
   */
  async searchJobs(
    query: string,
    page = 1,
    limit = 10,
    filters?: {
      position?: string;
      skills?: string;
      location?: string;
      workType?: string;
      jobType?: string;
    }
  ): Promise<JobsResponse> {
    const params = new URLSearchParams();
    params.append("q", query);
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    if (filters) {
      if (filters.position) params.append("position", filters.position);
      if (filters.skills) params.append("skills", filters.skills);
      if (filters.location) params.append("location", filters.location);
      if (filters.workType) params.append("workType", filters.workType);
      if (filters.jobType) params.append("jobType", filters.jobType);
    }

    const response = await fetch(`${API_BASE_URL}/jobs/search?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }
    return response.json();
  },

  /**
   * Get job detail by ID
   */
  async getJobById(id: string): Promise<{ data: Job }> {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Job not found");
      }
      throw new Error(`Failed to fetch job: ${response.statusText}`);
    }
    return response.json();
  },

  async getSkills(): Promise<{ data: Array<{ _id: string; name: string }> }> {
    const response = await fetch(`${API_BASE_URL}/skills`);
    if (!response.ok) {
      throw new Error(`Failed to fetch skills: ${response.statusText}`);
    }
    return response.json();
  },
};
