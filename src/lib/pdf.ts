import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { SavedRecord } from "./records";
import type { Question } from "./forms";

type AutoTableDoc = jsPDF & {
  lastAutoTable?: {
    finalY: number;
  };
};

export const formatQuestionLabel = (key: string) =>
  key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

export const formatAnswerValue = (
  value: boolean | string | number | null | undefined
) => {
  if (value === null || value === undefined || value === "") {
    return "—";
  }
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  return String(value);
};

export function downloadRecordPdf(
  record: SavedRecord,
  questions?: Question[]
) {
  const doc: AutoTableDoc = new jsPDF({ unit: "pt", format: "a4" }) as AutoTableDoc;
  const margin = 40;
  let y = margin;

  doc.setFontSize(20);
  doc.text(record.formName, margin, y);
  y += 24;

  doc.setFontSize(11);
  doc.text(`Inspector: ${record.inspector || "—"}`, margin, y);
  y += 14;

  doc.text(`Date: ${record.date || "—"}`, margin, y);
  y += 14;

  doc.text(`Summary: ${record.comments || "None"}`, margin, y);
  y += 20;

  const rows =
    questions && questions.length > 0
      ? questions.map((question) => [
          question.label,
          formatAnswerValue(record.answers[question.id]),
        ])
      : Object.entries(record.answers).map(([key, value]) => [
          formatQuestionLabel(key),
          formatAnswerValue(value),
        ]);

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Question", "Answer"]],
    body: rows,
    styles: { fontSize: 9, cellPadding: 4 },
    theme: "grid",
    headStyles: { fillColor: [30, 64, 175], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [245, 247, 250] },
  });

  y = (doc.lastAutoTable?.finalY ?? y) + 25;

  if (record.signature) {
    doc.setFontSize(13);
    doc.text("Digital Signature:", margin, y);
    y += 10;
    doc.addImage(record.signature, "PNG", margin, y, 220, 90);
    y += 110;
  }

  if (record.images?.length) {
    doc.setFontSize(13);
    doc.text("Attached Photos:", margin, y);
    y += 10;

    const imgW = 140;
    const imgH = 95;
    const gap = 12;
    let x = margin;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    record.images.forEach((img) => {
      if (x + imgW > pageWidth - margin) {
        x = margin;
        y += imgH + gap;
      }

      if (y + imgH > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }

      doc.addImage(img, "JPEG", x, y, imgW, imgH);
      x += imgW + gap;
    });
  }

  doc.save(`${record.formName}.pdf`);
}
