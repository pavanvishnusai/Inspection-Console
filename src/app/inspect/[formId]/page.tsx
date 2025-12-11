"use client";

import { useEffect, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import InspectionClient from "@/components/InspectionClient";
import { FORMS } from "@/lib/forms";
import { findRecord } from "@/lib/records";
import { downloadRecordPdf } from "@/lib/pdf";
import { useToast } from "@/components/ToastProvider";

export default function InspectPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const formId = params.formId as string;
  const downloadId = searchParams.get("download");
  const showToast = useToast();

  const lastDownloadIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!downloadId || lastDownloadIdRef.current === downloadId) return;

    const record = findRecord(downloadId);
    lastDownloadIdRef.current = downloadId;

    if (!record) {
      router.replace(`/inspect/${formId}`);
      showToast("Saved record not found.", "error");
      return;
    }

    downloadRecordPdf(record, FORMS[record.formId]?.questions);
    router.replace(`/inspect/${record.formId}`);
  }, [downloadId, formId, router, showToast]);

  const form = FORMS[formId];

  if (!form) {
    return (
      <div className="p-6 text-center text-red-400 text-xl">
        Invalid form selected.
      </div>
    );
  }

  return (
    <div className="p-4">
      <InspectionClient formId={formId} />
    </div>
  );
}
