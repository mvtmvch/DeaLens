import { describe, expect, it } from "vitest";
import { FORM_FIELDS, formDataToFormValues } from "./types";

describe("formDataToFormValues", () => {
  it("mapuje wszystkie pola formularza", () => {
    const formData = new FormData();
    formData.set("category", "klawiatura");
    formData.set("title", "Keychron K8");
    formData.set("description", "Klawiatura w komplecie.");
    formData.set("price", "349,99");
    formData.set("condition", "uzywany");
    formData.set("connectivity", "przewodowa");
    formData.set("layout", "ISO PL");
    formData.set("switches", "Gateron Brown");
    formData.set("sourceUrl", "https://example.com/oferta");

    expect(formDataToFormValues(formData)).toEqual({
      category: "klawiatura",
      title: "Keychron K8",
      description: "Klawiatura w komplecie.",
      price: "349,99",
      condition: "uzywany",
      connectivity: "przewodowa",
      layout: "ISO PL",
      switches: "Gateron Brown",
      sourceUrl: "https://example.com/oferta",
    });
  });

  it("zachowuje puste pola opcjonalne jako puste stringi", () => {
    const formData = new FormData();
    formData.set("category", "mysz");
    formData.set("title", "Logitech G305");
    formData.set("price", "149");
    formData.set("description", "");
    formData.set("condition", "");

    const values = formDataToFormValues(formData);
    expect(values.category).toBe("mysz");
    expect(values.description).toBe("");
    expect(values.condition).toBe("");
    expect(values.connectivity).toBe("");
    expect(values.sourceUrl).toBe("");
  });

  it("nie pomija żadnego zadeklarowanego pola", () => {
    const values = formDataToFormValues(new FormData());
    expect(Object.keys(values).sort()).toEqual([...FORM_FIELDS].sort());
    for (const field of FORM_FIELDS) {
      expect(values[field]).toBe("");
    }
  });
});
