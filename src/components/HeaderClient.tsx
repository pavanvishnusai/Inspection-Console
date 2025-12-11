"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HeaderClient() {
  const router = useRouter();

  return (
    <div className="flex items-center gap-3">

      <Link href="/">
        <button className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700 transition">
          Home
        </button>
      </Link>

      <button
        onClick={() => router.back()}
        className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700 transition"
      >
        Back
      </button>

      <Link href="/history">
        <button className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700 transition">
          History
        </button>
      </Link>

      <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/50 px-4 py-1.5 shadow-md shadow-black/30">
        <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
        <span className="text-xs font-medium text-slate-300">
          Inspector Mode
        </span>
      </div>
      
    </div>
  );
}
