"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  downloadRecordPdf,
  formatAnswerValue,
  formatQuestionLabel,
} from "@/lib/pdf";
import { deleteRecord } from "@/lib/records";
import { FORMS } from "@/lib/forms";
import { useToast } from "@/components/ToastProvider";
import { useRecordsStore } from "@/hooks/useRecordsStore";

export default function ViewHistoryRecord() {
  const params = useParams();
  const router = useRouter();
  const recordId = params.id as string;
  const { records, ready } = useRecordsStore();
  const record = records.find((r) => r.id === recordId);
  const showToast = useToast();

  if (!ready) {
    return (
      <div className="text-center text-gray-400 mt-10 text-lg">
        Loading record…
      </div>
    );
  }

  if (!record) {
    return (
      <div className="text-red-400 text-center mt-20 text-xl">
        Record not found
      </div>
    );
  }

  const handleDownload = () => {
    downloadRecordPdf(record, FORMS[record.formId]?.questions);
  };

  const handleDelete = () => {
    deleteRecord(record.id);
    showToast("Record deleted.", "success");
    router.push("/history");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{record.formName}</h1>
        <p className="text-gray-400">{new Date(record.date).toLocaleString()}</p>
        <p className="text-gray-400">Inspector: {record.inspector}</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-1">Overall Comments</h2>
        <p className="text-gray-200 bg-slate-900 p-3 rounded">
          {record.comments || "None"}
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-1">Answers</h2>
        <div className="space-y-3">
          {Object.entries(record.answers).map(([key, value]) => (
            <div
              key={key}
              className="border border-slate-800 rounded p-3 bg-slate-900/40"
            >
              <p className="text-gray-300 font-medium">
                {formatQuestionLabel(key)}
              </p>
              <p className="text-gray-100">{formatAnswerValue(value)}</p>
            </div>
          ))}
        </div>
      </div>

      {record.signature && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Digital Signature</h2>
          <Image
            src={record.signature}
            alt="signature"
            width={300}
            height={100}
            className="border rounded bg-white"
          />
        </div>
      )}

      {record.images.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Attached Photos</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {record.images.map((img, i) => (
              <Image
                key={i}
                src={img}
                alt="photo"
                width={300}
                height={200}
                className="rounded border"
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => router.push("/history")}
          className="px-3 py-1 rounded bg-blue-600 text-white"
        >
          Back
        </button>

        <button
          onClick={handleDownload}
          className="px-3 py-1 rounded bg-green-600 text-white"
        >
          Download
        </button>

        <button
          onClick={handleDelete}
          className="px-3 py-1 rounded bg-red-600 text-white"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
