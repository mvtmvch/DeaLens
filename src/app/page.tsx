import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-50">
      <section className="max-w-xl text-center">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-sky-400">
          DeaLens
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Oceń ofertę na podstawie faktów.
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-300">
          Wprowadź dane ogłoszenia i otrzymaj uporządkowany raport faktów,
          braków i pytań do sprzedającego.
        </p>
        <Link
          href="/analiza"
          className="mt-8 inline-block rounded-full bg-sky-500 px-6 py-2.5 font-medium text-white transition-colors hover:bg-sky-400"
        >
          Przeanalizuj ofertę
        </Link>
      </section>
    </main>
  );
}
