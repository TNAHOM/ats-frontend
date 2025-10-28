"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ApplicationForm } from "./application-form";

interface ApplicationModalProps {
  isOpen: boolean;
  jobId: string;
  jobTitle: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function ApplicationModal({
  isOpen,
  jobId,
  jobTitle,
  onClose,
  onSuccess,
}: ApplicationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Apply for Position</DialogTitle>
          <DialogDescription>{jobTitle}</DialogDescription>
        </DialogHeader>
        <ApplicationForm
          jobId={jobId}
          onSuccess={onSuccess}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
