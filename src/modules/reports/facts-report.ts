import {
  CATEGORY_LABELS,
  CONDITION_LABELS,
  CONNECTIVITY_LABELS,
  type ManualListing,
} from "@/modules/listings/manual-listing";

/**
 * Raport jest deterministycznym walking skeletonem: opiera się wyłącznie na
 * obecności i wartościach jawnie wybranych pól formularza. Analiza
 * semantyczna tytułu i opisu (w tym wykrywanie niespójności) jest poza
 * zakresem i zostanie zrealizowana przez osobny moduł AI.
 */
export interface FactsReport {
  facts: { label: string; value: string }[];
  missing: string[];
  questionsToSeller: string[];
  disclaimer: string;
}

export const REPORT_DISCLAIMER =
  "Ten raport wyłącznie porządkuje podane informacje. Nie jest analizą ceny, " +
  "opłacalności, autentyczności ani ryzyka oszustwa.";

export function formatPrice(grosze: number, currency: string): string {
  const zlote = Math.floor(grosze / 100);
  const reszta = String(grosze % 100).padStart(2, "0");
  return `${zlote},${reszta} ${currency}`;
}

export function buildFactsReport(listing: ManualListing): FactsReport {
  const facts: FactsReport["facts"] = [
    { label: "Kategoria", value: CATEGORY_LABELS[listing.category] },
    { label: "Tytuł", value: listing.title },
    { label: "Cena ofertowa", value: formatPrice(listing.price, listing.currency) },
  ];
  if (listing.condition) {
    facts.push({ label: "Stan", value: CONDITION_LABELS[listing.condition] });
  }
  if (listing.connectivity) {
    facts.push({
      label: "Łączność",
      value: CONNECTIVITY_LABELS[listing.connectivity],
    });
  }
  if (listing.layout) {
    facts.push({ label: "Układ klawiszy", value: listing.layout });
  }
  if (listing.switches) {
    facts.push({ label: "Przełączniki", value: listing.switches });
  }
  if (listing.description) {
    facts.push({ label: "Opis", value: listing.description });
  }
  if (listing.sourceUrl) {
    facts.push({ label: "Źródło (podane przez użytkownika)", value: listing.sourceUrl });
  }

  const missing: string[] = [];
  const questionsToSeller: string[] = [];

  if (!listing.description) {
    missing.push("Opis oferty.");
    questionsToSeller.push(
      "Czy możesz opisać historię użytkowania i ewentualne wady sprzętu?",
    );
  }
  if (!listing.condition) {
    missing.push("Stan sprzętu.");
    questionsToSeller.push("Jaki jest stan techniczny i wizualny sprzętu?");
  }
  if (!listing.connectivity) {
    missing.push("Rodzaj łączności (przewodowa/bezprzewodowa).");
    questionsToSeller.push("Czy urządzenie jest przewodowe czy bezprzewodowe?");
  }
  if (listing.category === "klawiatura") {
    if (!listing.layout) {
      missing.push("Układ klawiszy (layout).");
      questionsToSeller.push("Jaki jest układ klawiszy (np. ISO PL, ANSI US)?");
    }
    if (!listing.switches) {
      missing.push("Typ przełączników.");
      questionsToSeller.push("Jakie przełączniki są zamontowane w klawiaturze?");
    }
  }

  // Jawna reguła oparta wyłącznie na wybranym polu stanu. Nie sprawdzamy,
  // czy odpowiedź znajduje się już w opisie — to zadanie przyszłego modułu AI.
  if (listing.condition === "uszkodzony") {
    questionsToSeller.push("Na czym dokładnie polega uszkodzenie?");
  }
  // Formularz nie zbiera informacji o kompletności zestawu, więc pytanie jest
  // zadawane zawsze, bez analizy treści ogłoszenia.
  questionsToSeller.push("Czy zestaw jest kompletny (pudełko, kable, akcesoria)?");

  return {
    facts,
    missing,
    questionsToSeller,
    disclaimer: REPORT_DISCLAIMER,
  };
}
