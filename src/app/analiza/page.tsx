import type { Metadata } from "next";
import Link from "next/link";
import { AnalysisForm } from "./analysis-form";

export const metadata: Metadata = {
  title: "Analiza oferty — DeaLens",
  description:
    "Ręcznie wprowadź dane oferty i otrzymaj uporządkowany raport faktów.",
};

export default function AnalysisPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-50">
      <div className="mx-auto flex max-w-2xl flex-col gap-8">
        <header>
          <Link href="/" className="text-sm text-sky-400 hover:text-sky-300">
            ← DeaLens
          </Link>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            Analiza oferty
          </h1>
          <p className="mt-2 text-slate-300">
            Wprowadź dane ogłoszenia ręcznie. Raport uporządkuje podane fakty,
            wskaże braki i podpowie pytania do sprzedającego.
          </p>
        </header>
        <AnalysisForm />
      </div>
    </main>
  );
}
