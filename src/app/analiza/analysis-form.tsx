"use client";

import { useActionState } from "react";
import {
  CATEGORY_LABELS,
  CONDITION_LABELS,
  CONNECTIVITY_LABELS,
} from "@/modules/listings/manual-listing";
import type { FactsReport } from "@/modules/reports/facts-report";
import { analyzeListing } from "./actions";
import type { AnalysisState, FormField } from "./types";

const initialState: AnalysisState = { status: "idle" };

const inputClass =
  "w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-50 " +
  "placeholder:text-slate-500 focus:border-sky-400 focus:outline-none";

export function AnalysisForm() {
  const [state, formAction, isPending] = useActionState(
    analyzeListing,
    initialState,
  );

  const values = state.status === "idle" ? undefined : state.values;
  const errors = state.status === "error" ? state.fieldErrors : undefined;

  const fieldError = (field: FormField) =>
    errors?.[field] ? (
      <p className="mt-1 text-sm text-red-400">{errors[field]}</p>
    ) : null;

  return (
    <div className="flex flex-col gap-10">
      <form action={formAction} className="flex flex-col gap-5">
        <div>
          <label htmlFor="category" className="mb-1 block text-sm font-medium">
            Kategoria *
          </label>
          <select
            id="category"
            name="category"
            defaultValue={values?.category ?? ""}
            className={inputClass}
          >
            <option value="">— wybierz —</option>
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {fieldError("category")}
        </div>

        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-medium">
            Tytuł oferty *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            defaultValue={values?.title ?? ""}
            placeholder="np. Logitech G Pro X Superlight, stan bardzo dobry"
            className={inputClass}
          />
          {fieldError("title")}
        </div>

        <div>
          <label htmlFor="price" className="mb-1 block text-sm font-medium">
            Cena (PLN) *
          </label>
          <input
            id="price"
            name="price"
            type="text"
            inputMode="decimal"
            defaultValue={values?.price ?? ""}
            placeholder="np. 249,99"
            className={inputClass}
          />
          {fieldError("price")}
        </div>

        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-medium">
            Opis oferty
          </label>
          <textarea
            id="description"
            name="description"
            rows={6}
            defaultValue={values?.description ?? ""}
            placeholder="Wklej treść ogłoszenia lub opisz sprzęt własnymi słowami."
            className={inputClass}
          />
          {fieldError("description")}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="condition" className="mb-1 block text-sm font-medium">
              Stan
            </label>
            <select
              id="condition"
              name="condition"
              defaultValue={values?.condition ?? ""}
              className={inputClass}
            >
              <option value="">— nie podano —</option>
              {Object.entries(CONDITION_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {fieldError("condition")}
          </div>

          <div>
            <label
              htmlFor="connectivity"
              className="mb-1 block text-sm font-medium"
            >
              Łączność
            </label>
            <select
              id="connectivity"
              name="connectivity"
              defaultValue={values?.connectivity ?? ""}
              className={inputClass}
            >
              <option value="">— nie podano —</option>
              {Object.entries(CONNECTIVITY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {fieldError("connectivity")}
          </div>

          <div>
            <label htmlFor="layout" className="mb-1 block text-sm font-medium">
              Układ klawiszy (klawiatury)
            </label>
            <input
              id="layout"
              name="layout"
              type="text"
              defaultValue={values?.layout ?? ""}
              placeholder="np. ISO PL"
              className={inputClass}
            />
            {fieldError("layout")}
          </div>

          <div>
            <label htmlFor="switches" className="mb-1 block text-sm font-medium">
              Przełączniki (klawiatury)
            </label>
            <input
              id="switches"
              name="switches"
              type="text"
              defaultValue={values?.switches ?? ""}
              placeholder="np. Cherry MX Red"
              className={inputClass}
            />
            {fieldError("switches")}
          </div>
        </div>

        <div>
          <label htmlFor="sourceUrl" className="mb-1 block text-sm font-medium">
            Link do ogłoszenia (opcjonalnie, zapisywany tylko jako tekst)
          </label>
          <input
            id="sourceUrl"
            name="sourceUrl"
            type="text"
            defaultValue={values?.sourceUrl ?? ""}
            placeholder="https://…"
            className={inputClass}
          />
          {fieldError("sourceUrl")}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="mt-2 self-start rounded-full bg-sky-500 px-6 py-2.5 font-medium text-white transition-colors hover:bg-sky-400 disabled:opacity-60"
        >
          {isPending ? "Analizuję…" : "Zbuduj raport faktów"}
        </button>
      </form>

      {state.status === "success" && <ReportView report={state.report} />}
    </div>
  );
}

function ReportView({ report }: { report: FactsReport }) {
  return (
    <section
      aria-label="Raport faktów"
      className="flex flex-col gap-6 rounded-xl border border-slate-800 bg-slate-900/60 p-6"
    >
      <h2 className="text-2xl font-semibold">Raport faktów</h2>

      <div>
        <h3 className="mb-2 font-medium text-sky-400">Podane informacje</h3>
        <dl className="flex flex-col gap-1.5">
          {report.facts.map((fact) => (
            <div key={fact.label} className="flex gap-2">
              <dt className="shrink-0 text-slate-400">{fact.label}:</dt>
              <dd className="whitespace-pre-wrap break-words">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <ReportList
        title="Brakujące informacje"
        items={report.missing}
        emptyText="Wszystkie pola formularza zostały wypełnione."
      />
      <ReportList
        title="Pytania do sprzedającego"
        items={report.questionsToSeller}
        emptyText="Brak sugerowanych pytań."
      />

      <p className="border-t border-slate-800 pt-4 text-sm text-slate-400">
        {report.disclaimer}
      </p>
    </section>
  );
}

function ReportList({
  title,
  items,
  emptyText,
}: {
  title: string;
  items: string[];
  emptyText: string;
}) {
  return (
    <div>
      <h3 className="mb-2 font-medium text-sky-400">{title}</h3>
      {items.length === 0 ? (
        <p className="text-slate-400">{emptyText}</p>
      ) : (
        <ul className="list-disc space-y-1 pl-5">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
