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
  applicant_count?: number;
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
  status: "applied" | "shortlisted" | "interviewing" | "hired" | "rejected";
  aiScore: number; // 0-100 ranking score
  createdAt: Date | string;
  updatedAt: Date | string;
}

export type ApplicantStatus =
  | "applied"
  | "shortlisted"
  | "interviewing"
  | "hired"
  | "rejected";

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}
