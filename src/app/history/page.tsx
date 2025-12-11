"use client";

import Link from "next/link";
import { downloadRecordPdf } from "@/lib/pdf";
import { FORMS } from "@/lib/forms";
import { useRecordsStore } from "@/hooks/useRecordsStore";

export default function HistoryPage() {
  const { records, ready } = useRecordsStore();

  if (!ready) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Inspection History</h1>
        <p className="text-gray-400">Loading inspections…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Inspection History</h1>

      {records.length === 0 && (
        <p className="text-gray-400">No inspections saved yet.</p>
      )}

      <div className="space-y-4">
        {records.map((rec) => (
          <div
            key={rec.id}
            className="border border-slate-800 p-4 rounded bg-slate-900/40 hover:bg-slate-800 transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">{rec.formName}</h2>
                <p className="text-gray-400">
                  {new Date(rec.date).toLocaleString()}
                </p>
                <p className="text-gray-500 text-sm">
                  Inspector: {rec.inspector || "Unknown"}
                </p>
              </div>
              <div className="flex gap-3">
                <Link
                  href={`/history/${rec.id}`}
                  className="px-3 py-1 bg-blue-600 rounded text-white text-sm"
                >
                  View
                </Link>

                <button
                  onClick={() =>
                    downloadRecordPdf(rec, FORMS[rec.formId]?.questions)
                  }
                  className="px-3 py-1 bg-green-600 rounded text-white text-sm"
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
