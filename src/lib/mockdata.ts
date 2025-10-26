import type { Job, Applicant } from "./types"

// Mock user ID (in real app, this comes from Clerk)
const MOCK_USER_ID = "user_123"

export const mockJobs: Job[] = [
  {
    id: "job_1",
    userId: MOCK_USER_ID,
    title: "Senior React Developer",
    description:
      "We are looking for an experienced React developer to join our growing team. You will work on building scalable web applications using modern technologies and best practices.",
    requirements: [
      "5+ years of React experience",
      "Strong TypeScript skills",
      "Experience with Next.js",
      "Knowledge of state management (Redux, Zustand)",
      "Experience with testing frameworks",
    ],
    responsibilities: [
      "Build scalable web applications",
      "Lead code reviews",
      "Mentor junior developers",
      "Collaborate with design and backend teams",
      "Optimize application performance",
    ],
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    applicantCount: 12,
  },
  {
    id: "job_2",
    userId: MOCK_USER_ID,
    title: "Full Stack Developer",
    description:
      "Join our team as a Full Stack Developer and work on both frontend and backend technologies. We use modern tech stack and follow agile methodologies.",
    requirements: [
      "3+ years of full stack development",
      "Proficiency in Node.js and React",
      "Database design experience",
      "REST API development",
      "Git version control",
    ],
    responsibilities: [
      "Develop full stack features",
      "Write clean, maintainable code",
      "Participate in code reviews",
      "Troubleshoot and debug applications",
      "Contribute to technical documentation",
    ],
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    applicantCount: 8,
  },
  {
    id: "job_3",
    userId: MOCK_USER_ID,
    title: "UI/UX Designer",
    description:
      "We are seeking a talented UI/UX Designer to create beautiful and intuitive user interfaces for our web and mobile applications.",
    requirements: [
      "3+ years of UI/UX design experience",
      "Proficiency in Figma or Adobe XD",
      "Understanding of design systems",
      "Knowledge of accessibility standards",
      "Portfolio demonstrating design work",
    ],
    responsibilities: [
      "Design user interfaces",
      "Create wireframes and prototypes",
      "Conduct user research",
      "Collaborate with developers",
      "Maintain design consistency",
    ],
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    applicantCount: 15,
  },
]

export const mockApplicants: Applicant[] = [
  {
    id: "app_1",
    jobId: "job_1",
    userId: "applicant_1",
    name: "John Smith",
    email: "john.smith@email.com",
    phoneNumber: "+1 (555) 123-4567",
    resume: "/placeholder.svg?height=400&width=300",
    coverLetter:
      "I am very interested in this Senior React Developer position. With 6 years of experience in React and a strong background in TypeScript, I believe I am a great fit for your team.",
    status: "applied",
    aiScore: 92,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "app_2",
    jobId: "job_1",
    userId: "applicant_2",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phoneNumber: "+1 (555) 234-5678",
    resume: "/placeholder.svg?height=400&width=300",
    coverLetter:
      "I have been working with React for 7 years and have led multiple successful projects. I am excited about the opportunity to contribute to your team.",
    status: "shortlisted",
    aiScore: 88,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: "app_3",
    jobId: "job_1",
    userId: "applicant_3",
    name: "Michael Chen",
    email: "m.chen@email.com",
    phoneNumber: "+1 (555) 345-6789",
    resume: "/placeholder.svg?height=400&width=300",
    coverLetter:
      "With 5 years of React experience and expertise in Next.js, I am confident I can make a significant contribution to your development team.",
    status: "interviewing",
    aiScore: 85,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: "app_4",
    jobId: "job_1",
    userId: "applicant_4",
    name: "Emily Davis",
    email: "emily.davis@email.com",
    phoneNumber: "+1 (555) 456-7890",
    resume: "/placeholder.svg?height=400&width=300",
    coverLetter:
      "I am a passionate developer with 6 years of React experience. I have successfully delivered multiple high-impact projects and am ready for new challenges.",
    status: "hired",
    aiScore: 95,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: "app_5",
    jobId: "job_1",
    userId: "applicant_5",
    name: "David Wilson",
    email: "d.wilson@email.com",
    phoneNumber: "+1 (555) 567-8901",
    resume: "/placeholder.svg?height=400&width=300",
    coverLetter:
      "I have 4 years of React experience and am eager to grow in a senior role. I am committed to writing clean, maintainable code.",
    status: "applied",
    aiScore: 72,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: "app_6",
    jobId: "job_1",
    userId: "applicant_6",
    name: "Jessica Martinez",
    email: "j.martinez@email.com",
    phoneNumber: "+1 (555) 678-9012",
    resume: "/placeholder.svg?height=400&width=300",
    coverLetter:
      "As a React developer with 5+ years of experience, I am excited about this opportunity to work with a talented team on challenging projects.",
    status: "rejected",
    aiScore: 45,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "app_7",
    jobId: "job_2",
    userId: "applicant_7",
    name: "Alex Thompson",
    email: "alex.t@email.com",
    phoneNumber: "+1 (555) 789-0123",
    resume: "/placeholder.svg?height=400&width=300",
    coverLetter:
      "I am a full stack developer with 4 years of experience in Node.js and React. I am looking for a role where I can contribute to meaningful projects.",
    status: "applied",
    aiScore: 80,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: "app_8",
    jobId: "job_2",
    userId: "applicant_8",
    name: "Lisa Anderson",
    email: "lisa.a@email.com",
    phoneNumber: "+1 (555) 890-1234",
    resume: "/placeholder.svg?height=400&width=300",
    coverLetter:
      "With 3 years of full stack development experience, I am confident in my ability to contribute to your team and grow professionally.",
    status: "shortlisted",
    aiScore: 78,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
]

// Helper function to get mock data with filtering
export function getMockJobs(userId: string): Job[] {
  return mockJobs.filter((job) => job.userId === userId)
}

export function getMockJobById(jobId: string): Job | undefined {
  return mockJobs.find((job) => job.id === jobId)
}

export function getMockApplicantsByJobId(jobId: string): Applicant[] {
  return mockApplicants.filter((app) => app.jobId === jobId)
}

export function getMockApplicantById(applicantId: string): Applicant | undefined {
  return mockApplicants.find((app) => app.id === applicantId)
}

export function updateMockApplicantStatus(applicantId: string, status: string): Applicant | undefined {
  const applicant = mockApplicants.find((app) => app.id === applicantId)
  if (applicant) {
    applicant.status = status as any
    applicant.updatedAt = new Date()
  }
  return applicant
}
