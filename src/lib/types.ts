export interface Job {
  id: string;
  user_id: string;
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  deadline: Date | string;
  created_at: Date | string;
  updated_at: Date | string;
  applicant_count: number;
}

export interface Applicant {
  id: string;
  jobId: string;
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
  resume: string; // URL to resume file
  coverLetter: string;
  status: "APPLIED" | "INTERVIEWING" | "HIRED" | "REJECTED" | "SHORTLISTED";
  aiScore: number; // 0-100 ranking score
  created_at: Date | string;
}

export interface Application {
  id: string;
  jobId: string;
  name: string;
  email: string;
  phoneNumber: string;
  resume: string; // URL or base64 of PDF
  coverLetter?: string;
  appliedAt: Date | string;
}

export type ApplicantStatus =
  | "APPLIED"
  | "INTERVIEWING"
  | "HIRED"
  | "REJECTED"
  | "SHORTLISTED";

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}
