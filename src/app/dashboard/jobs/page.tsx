import { JobList } from "@/components/job-list"

export default function Jobs() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Jobs</h1>
          <p className="text-muted-foreground mt-2">Manage all your job postings</p>
        </div>
      </div>

      <JobList />
    </div>
  )
}
