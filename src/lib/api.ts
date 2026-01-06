const API_BASE_URL = "/api";

export interface Recruiter {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobApplication {
  id: string;
  companyName: string;
  jobTitle: string | null;
  currentColumn: "inMotion" | "sentApps";
  recruiterId: string | null;
  office: string | null;
  compensation: string | null;
  companySize: string | null;
  questions: string | null;
  pros: string | null;
  cons: string | null;
  vibeCheck: number | null;
  stage: string | null;
  source: string | null;
  logo: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BoardData {
  inMotion: Array<{
    id: string;
    title: string;
    subtitle?: string;
    icon: string;
  }>;
  sentApps: Array<{
    id: string;
    title: string;
    subtitle?: string;
    icon: string;
  }>;
}

// Recruiters API
export async function getRecruiters(): Promise<Recruiter[]> {
  const response = await fetch(`${API_BASE_URL}/recruiters`);
  if (!response.ok) throw new Error("Failed to fetch recruiters");
  return response.json();
}

export async function createRecruiter(name: string): Promise<Recruiter> {
  const response = await fetch(`${API_BASE_URL}/recruiters`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) throw new Error("Failed to create recruiter");
  return response.json();
}

export async function updateRecruiter(
  id: string,
  name: string
): Promise<Recruiter> {
  const response = await fetch(`${API_BASE_URL}/recruiters/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) throw new Error("Failed to update recruiter");
  return response.json();
}

export async function deleteRecruiter(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/recruiters/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete recruiter");
}

// Job Applications API
export async function getJobApplications(): Promise<JobApplication[]> {
  const response = await fetch(`${API_BASE_URL}/job-applications`);
  if (!response.ok) throw new Error("Failed to fetch job applications");
  return response.json();
}

export async function getJobApplicationsByStatus(
  status: "inMotion" | "sentApps"
): Promise<JobApplication[]> {
  const response = await fetch(
    `${API_BASE_URL}/job-applications/status/${status}`
  );
  if (!response.ok) throw new Error("Failed to fetch job applications");
  return response.json();
}

export async function createJobApplication(
  data: Omit<JobApplication, "id" | "createdAt" | "updatedAt">
): Promise<JobApplication> {
  const response = await fetch(`${API_BASE_URL}/job-applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create job application");
  return response.json();
}

export async function updateJobApplication(
  id: string,
  data: Partial<Omit<JobApplication, "id" | "createdAt" | "updatedAt">>
): Promise<JobApplication> {
  const response = await fetch(`${API_BASE_URL}/job-applications/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update job application");
  return response.json();
}

export async function deleteJobApplication(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/job-applications/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete job application");
}

// Board API
export async function getBoardData(): Promise<BoardData> {
  const response = await fetch(`${API_BASE_URL}/board`);
  if (!response.ok) throw new Error("Failed to fetch board data");
  return response.json();
}
