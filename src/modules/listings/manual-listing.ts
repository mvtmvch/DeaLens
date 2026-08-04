import { z } from "zod";

export const CURRENCY = "PLN" as const;

export const CATEGORY_LABELS = {
  mysz: "Mysz gamingowa",
  klawiatura: "Klawiatura gamingowa",
} as const;

export type Category = keyof typeof CATEGORY_LABELS;

export const CONDITION_LABELS = {
  nowy: "Nowy",
  "jak-nowy": "Jak nowy",
  uzywany: "Używany",
  uszkodzony: "Uszkodzony",
} as const;

export type Condition = keyof typeof CONDITION_LABELS;

export const CONNECTIVITY_LABELS = {
  przewodowa: "Przewodowa",
  bezprzewodowa: "Bezprzewodowa",
} as const;

export type Connectivity = keyof typeof CONNECTIVITY_LABELS;

export type PriceParseResult =
  | { ok: true; grosze: number }
  | { ok: false; error: "format" | "niedodatnia" };

/**
 * Formularz przekazuje cenę jako tekst. Akceptujemy przecinek albo kropkę
 * jako separator dziesiętny (maksymalnie 2 miejsca) oraz zwykłą lub
 * nierozdzielającą spację wyłącznie jako separator pełnych grup tysięcy
 * (np. "1 249,99"). Białe znaki w innych pozycjach oraz mieszane separatory
 * są niejednoznaczne i odrzucane.
 */
const PRICE_PATTERN =
  /^(?:\d+|\d{1,3}(?:[ \u00a0]\d{3})+)(?:[.,]\d{1,2})?$/;

export function parsePriceToGrosze(raw: string): PriceParseResult {
  const trimmed = raw.trim();
  if (!PRICE_PATTERN.test(trimmed)) {
    return { ok: false, error: "format" };
  }
  const cleaned = trimmed.replace(/[ \u00a0]/g, "");
  const [zlote, reszta = ""] = cleaned.split(/[.,]/);
  const grosze = Number(zlote) * 100 + Number(reszta.padEnd(2, "0"));
  if (!Number.isSafeInteger(grosze)) {
    return { ok: false, error: "format" };
  }
  if (grosze <= 0) {
    return { ok: false, error: "niedodatnia" };
  }
  return { ok: true, grosze };
}

const emptyToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

const optionalText = (maxLength: number) =>
  z.preprocess(
    emptyToUndefined,
    z.string().trim().max(maxLength, "Tekst jest zbyt długi.").optional(),
  );

export const manualListingSchema = z.object({
  category: z.enum(
    Object.keys(CATEGORY_LABELS) as [Category, ...Category[]],
    "Wybierz kategorię.",
  ),
  title: z
    .string("Tytuł jest wymagany.")
    .trim()
    .min(3, "Tytuł musi mieć co najmniej 3 znaki.")
    .max(200, "Tytuł jest zbyt długi."),
  description: optionalText(5000),
  price: z
    .string("Cena jest wymagana.")
    .trim()
    .min(1, "Cena jest wymagana.")
    .transform((value, ctx) => {
      const parsed = parsePriceToGrosze(value);
      if (!parsed.ok) {
        ctx.addIssue({
          code: "custom",
          message:
            parsed.error === "niedodatnia"
              ? "Cena musi być większa od zera."
              : "Podaj cenę jako liczbę, np. 249,99.",
        });
        return z.NEVER;
      }
      return parsed.grosze;
    }),
  condition: z.preprocess(
    emptyToUndefined,
    z
      .enum(
        Object.keys(CONDITION_LABELS) as [Condition, ...Condition[]],
        "Nieprawidłowa wartość stanu.",
      )
      .optional(),
  ),
  connectivity: z.preprocess(
    emptyToUndefined,
    z
      .enum(
        Object.keys(CONNECTIVITY_LABELS) as [Connectivity, ...Connectivity[]],
        "Nieprawidłowa wartość łączności.",
      )
      .optional(),
  ),
  layout: optionalText(100),
  switches: optionalText(100),
  sourceUrl: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .trim()
      .max(500, "Adres jest zbyt długi.")
      .refine((value) => {
        try {
          const protocol = new URL(value).protocol;
          return protocol === "http:" || protocol === "https:";
        } catch {
          return false;
        }
      }, "Podaj poprawny adres zaczynający się od http:// lub https://.")
      .optional(),
  ),
});

export type ManualListing = z.output<typeof manualListingSchema> & {
  currency: typeof CURRENCY;
};

export type ManualListingFieldErrors = Partial<
  Record<keyof z.input<typeof manualListingSchema>, string>
>;

export type ManualListingParseResult =
  | { success: true; listing: ManualListing }
  | { success: false; fieldErrors: ManualListingFieldErrors };

export function parseManualListing(
  raw: Record<string, unknown>,
): ManualListingParseResult {
  const result = manualListingSchema.safeParse(raw);
  if (!result.success) {
    const fieldErrors: ManualListingFieldErrors = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof ManualListingFieldErrors;
      if (field && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
    return { success: false, fieldErrors };
  }
  const data = result.data;
  const isKeyboard = data.category === "klawiatura";
  return {
    success: true,
    listing: {
      ...data,
      // Pola specyficzne dla klawiatur nie mogą przetrwać zmiany kategorii
      // na mysz (np. stare wartości formularza).
      layout: isKeyboard ? data.layout : undefined,
      switches: isKeyboard ? data.switches : undefined,
      currency: CURRENCY,
    },
  };
}
