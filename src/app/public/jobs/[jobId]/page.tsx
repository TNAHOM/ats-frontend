import PublicJobDetails from "@/components/PublicJobDetails";

export default function PublicJobDetailPage({
  params,
}: {
  params: { jobId: string };
}) {
  return <PublicJobDetails jobId={params.jobId} />;
}