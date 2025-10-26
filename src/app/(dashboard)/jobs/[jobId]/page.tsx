import { JobDetail } from "@/components/job-detail";

export default function JobDetailPage({
  params,
}: {
  params: { jobId: string };
}) {
  return <JobDetail jobId={params.jobId} />;
}
