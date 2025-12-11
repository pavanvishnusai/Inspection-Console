"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useRecordsStore } from "@/hooks/useRecordsStore";

export default function SuccessPage() {
  const router = useRouter();
  const params = useSearchParams();
  const recordId = params.get("id");
  const { records, ready } = useRecordsStore();
  const record = ready && recordId ? records.find((r) => r.id === recordId) : null;

  if (!ready) {
    return (
      <div className="text-center text-gray-400 mt-20 text-xl">
        Loading inspection…
      </div>
    );
  }

  if (!record) {
    return (
      <div className="text-center text-red-400 mt-20 text-xl">
        Invalid or missing record.
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto text-center space-y-6 py-12">
      <h1 className="text-3xl font-bold text-emerald-400">
        Inspection Submitted Successfully!
      </h1>

      <p className="text-gray-300">
        Your <strong>{record.formName}</strong> inspection was saved on:
        <br />
        <span className="text-gray-100">
          {new Date(record.date).toLocaleString()}
        </span>
      </p>

      <div className="flex flex-col gap-4 mt-8">
        <button
          onClick={() => router.push(`/history/${record.id}`)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
        >
          View Submitted Details
        </button>

        <button
          onClick={() =>
            router.push(`/inspect/${record.formId}?download=${record.id}`)
          }
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
        >
          Download PDF
        </button>

        <button
          onClick={() => router.push("/history")}
          className="bg-slate-700 hover:bg-slate-800 px-4 py-2 rounded text-white"
        >
          Go to History
        </button>

        <button
          onClick={() => router.push("/")}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-white"
        >
          Start New Inspection
        </button>
      </div>
    </div>
  );
}
