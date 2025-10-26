# Resume Screening Platform - Architecture Guide

## Project Structure

This document outlines the modular and reusable architecture of the resume screening platform.

### Directory Structure

\`\`\`
src/
├── app/
│   ├── (auth)/                 # Authentication routes (Clerk)
│   ├── (dashboard)/            # Protected dashboard routes
│   │   ├── jobs/
│   │   │   ├── page.tsx        # Jobs listing page
│   │   │   ├── create/         # Job creation page
│   │   │   ├── [jobId]/        # Job detail page
│   │   │   └── [jobId]/applicants/  # Applicants page
│   │   └── dashboard/          # Dashboard home
│   ├── api/                    # API routes
│   │   └── jobs/               # Job-related endpoints
│   ├── layout.tsx              # Root layout with Clerk provider
│   └── globals.css             # Global styles with design tokens
│
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── navbar.tsx              # Navigation bar with profile dropdown
│   ├── job-creation-form.tsx   # Job creation form
│   ├── job-list.tsx            # Jobs listing component
│   ├── job-detail.tsx          # Job detail display
│   ├── applicants-list.tsx     # Applicants list with tabs & filters
│   └── applicant-detail-sidebar.tsx  # Applicant detail sidebar
│
├── hooks/
│   ├── use-jobs.ts             # Hook for fetching all jobs
│   ├── use-job-detail.ts       # Hook for fetching single job
│   └── use-applicants.ts       # Hook for fetching applicants
│
├── lib/
│   ├── types.ts                # Centralized TypeScript types
│   ├── schemas.ts              # Zod validation schemas
│   ├── mockdata.ts             # Mock data mimicking API responses
│   ├── db.ts                   # Database utilities (exports mock data functions)
│   └── utils.ts                # Utility functions
│
└── middleware.ts               # Clerk authentication middleware
\`\`\`

## Key Architectural Decisions

### 1. Mock Data Pattern

Instead of connecting to a real database, we use a `mockdata.ts` file that contains realistic dummy data. This allows:

- **Easy Testing**: Test the UI without backend dependencies
- **API Simulation**: Mock data mimics real API responses
- **Easy Migration**: Replace mock data functions with real API calls when ready

**Files:**
- `lib/mockdata.ts` - Contains all mock data and helper functions
- `lib/db.ts` - Exports mock data functions for API routes

### 2. Centralized Types

All TypeScript interfaces are defined in `lib/types.ts`:

\`\`\`typescript
export interface Job { ... }
export interface Applicant { ... }
export type ApplicantStatus = "applied" | "shortlisted" | "interviewing" | "hired" | "rejected"
\`\`\`

**Benefits:**
- Single source of truth for types
- Easy to maintain and update
- Prevents type duplication across files

### 3. Custom Hooks for Data Fetching

Reusable hooks handle all data fetching logic:

- `useJobs()` - Fetch all jobs for current user
- `useJobDetail(jobId)` - Fetch single job details
- `useApplicants(jobId)` - Fetch applicants with sorting and filtering

**Benefits:**
- Separation of concerns
- Reusable across components
- Centralized error handling
- Easy to test

### 4. Modular Components

Components are broken down into smaller, reusable pieces:

**Example: ApplicantDetailSidebar**
\`\`\`tsx
<ApplicantDetailSidebar>
  ├── ApplicantHeader
  ├── ContactCard
  ├── ResumeCard
  ├── CoverLetterCard
  └── ApplicationDateCard
\`\`\`

**Benefits:**
- Each component has single responsibility
- Easy to test and maintain
- Reusable across different pages
- Better code organization

### 5. API Routes with Mock Data

API routes use mock data functions:

\`\`\`typescript
// app/api/jobs/route.ts
export async function GET(request: NextRequest) {
  const { userId } = await auth()
  const userJobs = getMockJobs(userId)
  return NextResponse.json(userJobs)
}
\`\`\`

**Benefits:**
- Consistent API interface
- Easy to replace with real backend
- Centralized business logic
- Type-safe responses

## Data Flow

### Fetching Jobs

\`\`\`
Page Component
    ↓
useJobs() Hook
    ↓
fetch("/api/jobs")
    ↓
API Route Handler
    ↓
getMockJobs(userId)
    ↓
mockdata.ts
    ↓
Return filtered jobs
\`\`\`

### Updating Applicant Status

\`\`\`
ApplicantCard Component
    ↓
updateApplicantStatus()
    ↓
fetch("/api/jobs/{jobId}/applicants/{applicantId}", PATCH)
    ↓
API Route Handler
    ↓
updateMockApplicantStatus()
    ↓
mockdata.ts
    ↓
Return updated applicant
\`\`\`

## Integration with Your APIs

When you're ready to connect your own APIs:

1. **Update Mock Data Functions**: Replace `getMockJobs()` with actual API calls
2. **Update API Routes**: Point to your backend endpoints
3. **Keep Hooks Unchanged**: The component layer remains the same

Example:
\`\`\`typescript
// Before (mock data)
export function getMockJobs(userId: string): Job[] {
  return mockJobs.filter((job) => job.userId === userId)
}

// After (real API)
export async function getMockJobs(userId: string): Job[] {
  const response = await fetch(`https://your-api.com/jobs?userId=${userId}`)
  return response.json()
}
\`\`\`

## Design System

### Colors
- **Primary Gradient**: `#804981` → `#F3806E` (purple to coral)
- **Background**: `rgba(250, 250, 250, 1)` (light off-white)
- **Neutrals**: Grays for text and borders

### Typography
- **Headings**: Geist Sans (bold weights)
- **Body**: Geist Sans (regular weight)

### Components
- All UI components from shadcn/ui
- Custom styling via Tailwind CSS
- Design tokens in `globals.css`

## Authentication

- **Provider**: Clerk
- **Protected Routes**: Middleware in `middleware.ts`
- **User Context**: Available via `auth()` from `@clerk/nextjs/server`

## Best Practices

1. **Always use hooks** for data fetching instead of direct fetch calls
2. **Keep components small** and focused on single responsibility
3. **Use TypeScript** for type safety
4. **Centralize types** in `lib/types.ts`
5. **Mock data** for development and testing
6. **Validate input** with Zod schemas
7. **Handle errors** gracefully in hooks and components

## Testing

To test the platform:

1. Create a job via the job creation form
2. View the job in the jobs list
3. Click "View Applicants" to see mock applicants
4. Click "View Details" on an applicant to see the sidebar
5. Update applicant status using the dropdown
6. Filter applicants by score or search by name/email
