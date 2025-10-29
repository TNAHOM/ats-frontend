import PublicJobDetails from "@/components/PublicJobDetails";

export default async function PublicJobDetailPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;

  return <PublicJobDetails jobId={jobId} />;
}