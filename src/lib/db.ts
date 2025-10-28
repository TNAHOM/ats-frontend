import {
  mockJobs,
  mockApplicants,
  getMockJobs,
  getMockJobById,
  getMockApplicantsByJobId,
  getMockApplicantById,
  updateMockApplicantStatus,
} from "./mockdata";

// Export mock data functions for API routes
export { getMockJobs, getMockJobById, getMockApplicantsByJobId, getMockApplicantById, updateMockApplicantStatus }

// Keep for backward compatibility
export const db = {
  jobs: new Map(mockJobs.map((job) => [job.id, job])),
  applicants: new Map(mockApplicants.map((app) => [app.id, app])),
}
