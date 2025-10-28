import { JobDetail } from "@/components/job-detail";

export default async function JobDetailPage({
  params,
}: {
  params: { jobId: string };
}) {
  return <JobDetail jobId={params.jobId} />;
}
