import { describe, expect, it } from "vitest";
import type { ManualListing } from "@/modules/listings/manual-listing";
import {
  buildFactsReport,
  formatPrice,
  REPORT_DISCLAIMER,
} from "./facts-report";

function listing(overrides: Partial<ManualListing> = {}): ManualListing {
  return {
    category: "mysz",
    title: "Logitech G Pro X Superlight",
    description:
      "Mysz w bardzo dobrym stanie, komplet z pudełkiem i oryginalnymi akcesoriami.",
    price: 24999,
    currency: "PLN",
    condition: "uzywany",
    connectivity: "bezprzewodowa",
    layout: undefined,
    switches: undefined,
    sourceUrl: undefined,
    ...overrides,
  };
}

describe("formatPrice", () => {
  it("formatuje grosze jako złote z przecinkiem", () => {
    expect(formatPrice(24999, "PLN")).toBe("249,99 PLN");
    expect(formatPrice(24900, "PLN")).toBe("249,00 PLN");
    expect(formatPrice(5, "PLN")).toBe("0,05 PLN");
  });
});

describe("buildFactsReport", () => {
  it("kompletna oferta myszy: pełna struktura raportu", () => {
    const input = listing({ sourceUrl: "https://example.com/oferta" });
    const report = buildFactsReport(input);
    expect(report).toEqual({
      facts: [
        { label: "Kategoria", value: "Mysz gamingowa" },
        { label: "Tytuł", value: "Logitech G Pro X Superlight" },
        { label: "Cena ofertowa", value: "249,99 PLN" },
        { label: "Stan", value: "Używany" },
        { label: "Łączność", value: "Bezprzewodowa" },
        {
          label: "Opis",
          value:
            "Mysz w bardzo dobrym stanie, komplet z pudełkiem i oryginalnymi akcesoriami.",
        },
        {
          label: "Źródło (podane przez użytkownika)",
          value: "https://example.com/oferta",
        },
      ],
      missing: [],
      questionsToSeller: [
        "Czy zestaw jest kompletny (pudełko, kable, akcesoria)?",
      ],
      disclaimer: REPORT_DISCLAIMER,
    });
    expect(buildFactsReport(input)).toEqual(report);
  });

  it("niepełna oferta klawiatury: pełna struktura raportu", () => {
    const report = buildFactsReport(
      listing({
        category: "klawiatura",
        title: "Klawiatura Keychron K8",
        description: "Klawiatura z pudełkiem i kablem, mało używana.",
        price: 34900,
        connectivity: undefined,
        layout: "ISO PL",
        switches: undefined,
      }),
    );
    expect(report).toEqual({
      facts: [
        { label: "Kategoria", value: "Klawiatura gamingowa" },
        { label: "Tytuł", value: "Klawiatura Keychron K8" },
        { label: "Cena ofertowa", value: "349,00 PLN" },
        { label: "Stan", value: "Używany" },
        { label: "Układ klawiszy", value: "ISO PL" },
        {
          label: "Opis",
          value: "Klawiatura z pudełkiem i kablem, mało używana.",
        },
      ],
      missing: [
        "Rodzaj łączności (przewodowa/bezprzewodowa).",
        "Typ przełączników.",
      ],
      questionsToSeller: [
        "Czy urządzenie jest przewodowe czy bezprzewodowe?",
        "Jakie przełączniki są zamontowane w klawiaturze?",
        "Czy zestaw jest kompletny (pudełko, kable, akcesoria)?",
      ],
      disclaimer: REPORT_DISCLAIMER,
    });
  });

  it("wskazuje braki i pytania przy niepełnych danych", () => {
    const report = buildFactsReport(
      listing({ description: undefined, condition: undefined }),
    );
    expect(report.missing).toContain("Opis oferty.");
    expect(report.missing).toContain("Stan sprzętu.");
    expect(report.questionsToSeller).toContain(
      "Jaki jest stan techniczny i wizualny sprzętu?",
    );
  });

  it("dla klawiatury wymaga layoutu i przełączników", () => {
    const report = buildFactsReport(
      listing({ category: "klawiatura", layout: undefined, switches: undefined }),
    );
    expect(report.missing).toContain("Układ klawiszy (layout).");
    expect(report.missing).toContain("Typ przełączników.");
  });

  it("zawsze pyta o kompletność zestawu, bez analizy treści", () => {
    for (const description of [
      "Sprzedam mysz, działa bez zarzutu.",
      "Komplet z pudełkiem i wszystkimi akcesoriami.",
    ]) {
      const report = buildFactsReport(listing({ description }));
      expect(report.questionsToSeller).toContain(
        "Czy zestaw jest kompletny (pudełko, kable, akcesoria)?",
      );
    }
  });

  it("przy stanie uszkodzonym zawsze pyta o uszkodzenie, także gdy opis je wyjaśnia", () => {
    for (const description of [
      "Sprzedam mysz, komplet z pudełkiem.",
      "Uszkodzony jest lewy przycisk — podwójne kliknięcia.",
    ]) {
      const report = buildFactsReport(
        listing({ condition: "uszkodzony", description }),
      );
      expect(report.questionsToSeller).toContain(
        "Na czym dokładnie polega uszkodzenie?",
      );
    }
  });

  it("nie wnioskuje o uszkodzeniu z tytułu ani opisu — liczy się pole stanu", () => {
    const report = buildFactsReport(
      listing({
        title: "Uszkodzona mysz Logitech",
        condition: "uzywany",
        description: "Mysz ma uszkodzony przycisk boczny, komplet z pudełkiem.",
      }),
    );
    expect(report.questionsToSeller).not.toContain(
      "Na czym dokładnie polega uszkodzenie?",
    );
  });
});
