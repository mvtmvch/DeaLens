import { describe, expect, it } from "vitest";
import { buildFactsReport } from "@/modules/reports/facts-report";
import {
  parseManualListing,
  parsePriceToGrosze,
} from "./manual-listing";

describe("parsePriceToGrosze", () => {
  it("parsuje liczby całkowite", () => {
    expect(parsePriceToGrosze("249")).toEqual({ ok: true, grosze: 24900 });
  });

  it("parsuje przecinek dziesiętny", () => {
    expect(parsePriceToGrosze("249,99")).toEqual({ ok: true, grosze: 24999 });
  });

  it("parsuje kropkę dziesiętną", () => {
    expect(parsePriceToGrosze("249.99")).toEqual({ ok: true, grosze: 24999 });
  });

  it("parsuje jedno miejsce dziesiętne jako dziesiątki groszy", () => {
    expect(parsePriceToGrosze("249,5")).toEqual({ ok: true, grosze: 24950 });
  });

  it("akceptuje spacje jako separatory pełnych grup tysięcy", () => {
    expect(parsePriceToGrosze("1 249")).toEqual({ ok: true, grosze: 124900 });
    expect(parsePriceToGrosze("1 249,99")).toEqual({ ok: true, grosze: 124999 });
    expect(parsePriceToGrosze("1 249.99")).toEqual({ ok: true, grosze: 124999 });
    expect(parsePriceToGrosze("1\u00a0249")).toEqual({ ok: true, grosze: 124900 });
    expect(parsePriceToGrosze("1\u00a0249,99")).toEqual({
      ok: true,
      grosze: 124999,
    });
    expect(parsePriceToGrosze("1 234 567")).toEqual({
      ok: true,
      grosze: 123456700,
    });
  });

  it("odrzuca białe znaki poza pozycją separatora tysięcy", () => {
    expect(parsePriceToGrosze("2 4 9")).toEqual({ ok: false, error: "format" });
    expect(parsePriceToGrosze("1 24")).toEqual({ ok: false, error: "format" });
    expect(parsePriceToGrosze("249, 99")).toEqual({
      ok: false,
      error: "format",
    });
    expect(parsePriceToGrosze("249 .99")).toEqual({
      ok: false,
      error: "format",
    });
    expect(parsePriceToGrosze("24\n9")).toEqual({ ok: false, error: "format" });
  });

  it("odrzuca zero i wartości ujemne", () => {
    expect(parsePriceToGrosze("0")).toEqual({ ok: false, error: "niedodatnia" });
    expect(parsePriceToGrosze("0,00")).toEqual({
      ok: false,
      error: "niedodatnia",
    });
    expect(parsePriceToGrosze("-5")).toEqual({ ok: false, error: "format" });
  });

  it("odrzuca wartości niejednoznaczne", () => {
    expect(parsePriceToGrosze("12.345")).toEqual({ ok: false, error: "format" });
    expect(parsePriceToGrosze("1,234.56")).toEqual({
      ok: false,
      error: "format",
    });
    expect(parsePriceToGrosze("12,34,56")).toEqual({
      ok: false,
      error: "format",
    });
  });

  it("odrzuca tekst niebędący liczbą", () => {
    expect(parsePriceToGrosze("")).toEqual({ ok: false, error: "format" });
    expect(parsePriceToGrosze("abc")).toEqual({ ok: false, error: "format" });
    expect(parsePriceToGrosze("249 zł")).toEqual({ ok: false, error: "format" });
  });
});

describe("parseManualListing", () => {
  const validInput = {
    category: "mysz",
    title: "Logitech G Pro X Superlight",
    description: "Mysz w bardzo dobrym stanie, komplet z pudełkiem.",
    price: "249,99",
    condition: "uzywany",
    connectivity: "bezprzewodowa",
    layout: "",
    switches: "",
    sourceUrl: "",
  };

  it("akceptuje poprawne dane i normalizuje cenę do groszy", () => {
    const result = parseManualListing(validInput);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.listing.price).toBe(24999);
      expect(result.listing.currency).toBe("PLN");
      expect(result.listing.layout).toBeUndefined();
      expect(result.listing.sourceUrl).toBeUndefined();
    }
  });

  it("wymaga kategorii, tytułu i ceny", () => {
    const result = parseManualListing({
      ...validInput,
      category: "",
      title: "",
      price: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors.category).toBeDefined();
      expect(result.fieldErrors.title).toBeDefined();
      expect(result.fieldErrors.price).toBeDefined();
    }
  });

  it("odrzuca cenę zero jako błąd walidacji", () => {
    const result = parseManualListing({ ...validInput, price: "0" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors.price).toBe("Cena musi być większa od zera.");
    }
  });

  it("odrzuca niejednoznaczny format ceny", () => {
    const result = parseManualListing({ ...validInput, price: "12.345" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors.price).toBe(
        "Podaj cenę jako liczbę, np. 249,99.",
      );
    }
  });

  it("traktuje puste pola opcjonalne jako niepodane", () => {
    const result = parseManualListing({
      ...validInput,
      description: "  ",
      condition: "",
      connectivity: "",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.listing.description).toBeUndefined();
      expect(result.listing.condition).toBeUndefined();
      expect(result.listing.connectivity).toBeUndefined();
    }
  });

  it("odrzuca nieznane wartości pól wyboru", () => {
    const result = parseManualListing({ ...validInput, condition: "inny" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors.condition).toBeDefined();
    }
  });

  it("akceptuje poprawny URL http i https", () => {
    for (const url of [
      "https://www.olx.pl/d/oferta/mysz-123",
      "http://example.com/oferta",
    ]) {
      const result = parseManualListing({ ...validInput, sourceUrl: url });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.listing.sourceUrl).toBe(url);
      }
    }
  });

  it("odrzuca wypełniony URL, który nie jest poprawnym http/https", () => {
    for (const url of [
      "nie-url",
      "www.olx.pl/oferta",
      "ftp://example.com/plik",
      "javascript:alert(1)",
    ]) {
      const result = parseManualListing({ ...validInput, sourceUrl: url });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.fieldErrors.sourceUrl).toBeDefined();
      }
    }
  });

  it("usuwa pola klawiatury po zmianie kategorii klawiatura → mysz", () => {
    const result = parseManualListing({
      ...validInput,
      category: "mysz",
      layout: "ISO PL",
      switches: "Cherry MX Red",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.listing.layout).toBeUndefined();
      expect(result.listing.switches).toBeUndefined();
      const factLabels = buildFactsReport(result.listing).facts.map(
        (fact) => fact.label,
      );
      expect(factLabels).not.toContain("Układ klawiszy");
      expect(factLabels).not.toContain("Przełączniki");
    }
  });

  it("zachowuje pola klawiatury dla kategorii klawiatura", () => {
    const result = parseManualListing({
      ...validInput,
      category: "klawiatura",
      layout: "ISO PL",
      switches: "Cherry MX Red",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.listing.layout).toBe("ISO PL");
      expect(result.listing.switches).toBe("Cherry MX Red");
    }
  });
});
