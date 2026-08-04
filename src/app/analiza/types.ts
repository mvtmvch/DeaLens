import type { ManualListingFieldErrors } from "@/modules/listings/manual-listing";
import type { FactsReport } from "@/modules/reports/facts-report";

export const FORM_FIELDS = [
  "category",
  "title",
  "description",
  "price",
  "condition",
  "connectivity",
  "layout",
  "switches",
  "sourceUrl",
] as const;

export type FormField = (typeof FORM_FIELDS)[number];

export type FormValues = Record<FormField, string>;

export function formDataToFormValues(formData: FormData): FormValues {
  return Object.fromEntries(
    FORM_FIELDS.map((field) => {
      const value = formData.get(field);
      return [field, typeof value === "string" ? value : ""];
    }),
  ) as FormValues;
}

export type AnalysisState =
  | { status: "idle" }
  | { status: "error"; values: FormValues; fieldErrors: ManualListingFieldErrors }
  | { status: "success"; values: FormValues; report: FactsReport };
