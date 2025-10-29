import { Applicant } from "@/lib/types";
import { Badge } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface ApplicantCardProps {
  applicant: Applicant;
  jobId: string;
  onSelectApplicant?: (applicant: Applicant) => void;
  onStatusChange: (
    applicantId: string,
    status: string
  ) => Promise<Applicant | undefined>;
}

function ApplicantCard({
  applicant,
  jobId,
  onSelectApplicant,
  onStatusChange,
}: ApplicantCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await onStatusChange(applicant.id, newStatus);
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-bold text-lg">{applicant.name}</h3>
            <Badge className="gradient-brand text-white border-0">
              {applicant.aiScore}% Match
            </Badge>
          </div>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>Email: {applicant.email}</p>
            <p>Phone: {applicant.phoneNumber}</p>
            <p>
              Applied: {new Date(applicant.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelectApplicant?.(applicant)}
          >
            View Details
          </Button>
          <select
            value={applicant.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={isUpdating}
            className="px-2 py-1 rounded border border-border text-sm disabled:opacity-50"
          >
            <option value="applied">Applied</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="interviewing">Interviewing</option>
            <option value="hired">Hired</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>
    </Card>
  );
}

export default ApplicantCard;
