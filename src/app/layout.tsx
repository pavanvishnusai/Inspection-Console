import type { Metadata } from "next";
import "./globals.css";
import HeaderClient from "@/components/HeaderClient";
import { ToastProvider } from "@/components/ToastProvider";

export const metadata: Metadata = {
  title: "Inspection Console",
  description: "Quality inspection system built with Next.js & Tailwind CSS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <ToastProvider>
          <div className="mx-auto max-w-6xl px-6 py-8">
            <header className="mb-10 flex items-center justify-between">
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Inspection Console
                </h1>
                <p className="text-sm text-slate-400">
                  Run inspections, capture findings, export reports.
                </p>
              </div>

              <HeaderClient />
            </header>

            <main>{children}</main>

            <footer className="mt-12 border-t border-slate-800 pt-4 text-xs text-slate-500">
              Built with Next.js, TypeScript & Tailwind.
            </footer>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
