"use server";

import { parseManualListing } from "@/modules/listings/manual-listing";
import { buildFactsReport } from "@/modules/reports/facts-report";
import { formDataToFormValues, type AnalysisState } from "./types";

export async function analyzeListing(
  _previous: AnalysisState,
  formData: FormData,
): Promise<AnalysisState> {
  const values = formDataToFormValues(formData);

  const parsed = parseManualListing(values);
  if (!parsed.success) {
    return { status: "error", values, fieldErrors: parsed.fieldErrors };
  }
  return { status: "success", values, report: buildFactsReport(parsed.listing) };
}
