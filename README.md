## Inspection Console

A small inspection console built with Next.js, React, TypeScript, and Tailwind. Inspectors can pick a mock form, fill it out with different field types, capture signatures/photos, save the results in browser storage, and download a PDF report.

### Install & Run
```bash
npm install
npm run dev
```
Visit http://localhost:3000 and choose any inspection form.

### Scripts
- `npm run dev` – start the local dev server
- `npm run lint` – run ESLint (should pass before deploying)
- `npm run build` – production build

### Features
- Forms are defined once in `src/lib/forms.ts` and rendered dynamically.
- `/inspect/[formId]` supports boolean, number, select, text, textarea inputs plus signature and photo uploads.
- Records save to `localStorage`; history lives at `/history` and `/history/[id]`.
- Shared helpers in `src/lib/pdf.ts` generate formatted PDF reports.
- Toast notifications confirm saves, deletes, and download issues.

All data stays in the browser; clearing storage removes saved inspections.
