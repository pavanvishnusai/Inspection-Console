import Link from "next/link";
import { FORMS } from "@/lib/forms";

export default function HomePage() {
  const forms = Object.values(FORMS);

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-slate-100">
        Select an Inspection Form
      </h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {forms.map((form) => (
          <Link
            key={form.id}
            href={`/inspect/${form.id}`}
            className="group block rounded-xl border border-slate-800 bg-slate-900/40 p-5 shadow-lg shadow-black/20 ring-slate-500/40 transition hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-900/70 hover:shadow-xl hover:shadow-black/30"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-medium text-slate-100">
                {form.name}
              </h3>
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 transition group-hover:border-slate-500 group-hover:bg-slate-800">
                →
              </span>
            </div>
            <p className="text-sm text-slate-400">{form.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
