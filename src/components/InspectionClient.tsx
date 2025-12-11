"use client";

import { useState, useRef, type ChangeEvent } from "react";
import SignatureCanvas from "react-signature-canvas";
import { FORMS, type Question, type FormDefinition } from "@/lib/forms";
import { useRouter } from "next/navigation";
import { saveRecord, type SavedRecord } from "@/lib/records";
import { downloadRecordPdf } from "@/lib/pdf";
import { useToast } from "@/components/ToastProvider";

type AnswerValue = SavedRecord["answers"][string];
type AnswerMap = Record<string, AnswerValue>;

const initializeAnswers = (definition?: FormDefinition): AnswerMap => {
  const initial: AnswerMap = {};
  definition?.questions.forEach((q) => {
    if (q.type === "boolean") initial[q.id] = false;
    else initial[q.id] = "";
  });
  return initial;
};

export default function InspectionClient({ formId }: { formId: string }) {
  const router = useRouter();
  const form = (FORMS as Record<string, FormDefinition | undefined>)[formId];
  const showToast = useToast();

  const [inspector, setInspector] = useState("");
  const [comments, setComments] = useState("");
  const [date, setDate] = useState("");

  const [answers, setAnswers] = useState<AnswerMap>(() =>
    initializeAnswers(form)
  );

  const updateAnswer = (id: string, val: AnswerValue) =>
    setAnswers((prev) => ({ ...prev, [id]: val }));

  const sigPad = useRef<SignatureCanvas | null>(null);
  const [signature, setSignature] = useState("");

  const saveSignature = () => {
    if (!sigPad.current) return;
    const png = sigPad.current.getTrimmedCanvas().toDataURL("image/png");
    setSignature(png);
  };

  const clearSignature = () => {
    sigPad.current?.clear();
    setSignature("");
  };

  const [images, setImages] = useState<string[]>([]);
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const updated = [...images];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        updated.push(reader.result as string);
        setImages([...updated]);
      };
      reader.readAsDataURL(file);
    });
  };

  if (!form) {
    return <div className="p-4 text-red-400">Invalid form</div>;
  }

  const buildRecord = (id: string): SavedRecord => ({
    id,
    formId: form.id,
    formName: form.name,
    inspector,
    date: date || new Date().toISOString(),
    comments,
    answers,
    signature: signature || null,
    images,
  });

  const handleDownloadPdf = () => {
    const record = buildRecord(crypto.randomUUID());
    downloadRecordPdf(record, form.questions);
  };

  const handleSaveRecord = () => {
    const record = buildRecord(crypto.randomUUID());
    saveRecord(record);
    showToast("Inspection saved to history.", "success");
    router.push(`/inspect/success?id=${record.id}`);
  };

  const checklist = form.questions.filter((q) => q.type === "boolean");
  const details = form.questions.filter((q) => q.type !== "boolean");

  const renderField = (q: Question) => {
    const value = answers[q.id];

    switch (q.type) {
      case "text":
        return (
          <input
            className="border p-2 rounded w-full text-black"
            value={value as string}
            onChange={(e) => updateAnswer(q.id, e.target.value)}
          />
        );

      case "textarea":
        return (
          <textarea
            className="border p-2 rounded w-full text-black"
            rows={3}
            value={value as string}
            onChange={(e) => updateAnswer(q.id, e.target.value)}
          />
        );

      case "number":
        return (
          <input
            type="number"
            className="border p-2 rounded w-full text-black"
            value={value === "" ? "" : String(value)}
            onChange={(e) =>
              updateAnswer(
                q.id,
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
          />
        );

      case "select":
        return (
          <select
            className="border p-2 rounded w-full text-black"
            value={value as string}
            onChange={(e) => updateAnswer(q.id, e.target.value)}
          >
            <option value="">Select…</option>
            {q.options?.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-10 text-white">
      <h1 className="text-3xl font-bold">{form.name}</h1>
      <p className="text-gray-400">{form.description}</p>

      <div className="space-y-3">
        <input
          className="border p-2 rounded w-full text-black"
          placeholder="Inspector Name"
          value={inspector}
          onChange={(e) => setInspector(e.target.value)}
        />

        <input
          type="date"
          className="border p-2 rounded w-full text-black"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <textarea
          className="border p-2 rounded w-full text-black"
          placeholder="Overall comments..."
          rows={3}
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
      </div>

      {checklist.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold">Checklist</h2>
          <div className="space-y-2">
            {checklist.map((q) => (
              <label key={q.id} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={Boolean(answers[q.id])}
                  onChange={(e) => updateAnswer(q.id, e.target.checked)}
                />
                {q.label}
              </label>
            ))}
          </div>
        </div>
      )}

      {details.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold">Additional Details</h2>
          <div className="space-y-4">
            {details.map((q) => (
              <div key={q.id}>
                <div className="text-sm text-gray-300 mb-1">{q.label}</div>
                {renderField(q)}
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold">Digital Signature</h2>
        <SignatureCanvas
          ref={sigPad}
          penColor="black"
          backgroundColor="white"
          canvasProps={{
            width: 400,
            height: 150,
            className: "border rounded bg-white",
          }}
        />
        <div className="flex gap-3 mt-2">
          <button
            className="bg-blue-600 px-4 py-2 rounded"
            onClick={saveSignature}
          >
            Save Signature
          </button>
          <button
            className="bg-red-500 px-4 py-2 rounded"
            onClick={clearSignature}
          >
            Clear
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Attach Photos</h2>
        <input type="file" multiple onChange={handleImageUpload} />
      </div>

      <div className="flex gap-4">
        <button className="bg-green-600 px-4 py-2 rounded" onClick={handleDownloadPdf}>
          Download PDF
        </button>

        <button
          className="bg-yellow-500 px-4 py-2 rounded text-black font-medium"
          onClick={handleSaveRecord}
        >
          Save Inspection
        </button>
      </div>
    </div>
  );
}
