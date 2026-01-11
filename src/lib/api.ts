const API_BASE_URL = "/api";

export interface Column {
  id: string;
  name: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface JobApplication {
  id: string;
  companyName: string;
  jobTitle: string | null;
  currentColumn: string;
  office: string | null;
  compensation: string | null;
  companySize: string | null;
  notes: string | null;
  status: string | null;
  nextInterviewDate: string | null;
  nextInterviewType: string | null;
  vibeCheck: number | null;
  source: string | null;
  logo: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BoardData {
  columns: Column[];
  applications: Record<string, JobApplication[]>;
}

// Job Applications API
export async function getJobApplications(): Promise<JobApplication[]> {
  const response = await fetch(`${API_BASE_URL}/job-applications`);
  if (!response.ok) throw new Error("Failed to fetch job applications");
  return response.json();
}

export async function getJobApplicationsByStatus(
  status: string
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
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error ||
        `Failed to update job application: ${response.status} ${response.statusText}`
    );
  }
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

// Columns API
export async function getColumns(): Promise<Column[]> {
  const response = await fetch(`${API_BASE_URL}/columns`);
  if (!response.ok) throw new Error("Failed to fetch columns");
  return response.json();
}

export async function createColumn(data: { name: string }): Promise<Column> {
  const response = await fetch(`${API_BASE_URL}/columns`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create column");
  return response.json();
}
