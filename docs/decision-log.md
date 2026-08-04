# Rejestr decyzji

## Zaakceptowane

- Nazwa produktu: `DeaLens`; nazwa pakietu npm: `dealens`.
- Etap 0 i manual-first walking skeleton mogą powstawać równolegle.
- Etap 0 blokuje automatyczny import URL i produkcyjny adapter marketplace.
- Pierwszy krok obejmuje wyłącznie scaffold Next.js z TypeScript, App Router, Tailwind CSS, ESLint i katalogiem `src`.

- Pierwszy przepływ produktu (opcja A): bezstanowa analiza manual-first — formularz, walidacja i deterministyczny raport faktów, bez bazy danych i bez auth. Supabase odłożony do osobnego zadania.
- Dopuszczone zależności: `zod` (walidacja) i `vitest` (testy czystych funkcji w środowisku Node).
- Waluta na tym etapie stała: PLN, bez wyboru waluty.
- Cena jest wymagana, musi być większa od zera i jest normalizowana do liczby całkowitej w groszach; niejednoznaczny format to błąd walidacji.
- Raport deterministyczny opiera się wyłącznie na obecności i wartościach jawnie wybranych pól formularza. Heurystyki semantyczne oparte na słowach kluczowych zostały wycofane; analiza treści ogłoszenia (w tym wykrywanie niespójności) będzie zadaniem osobnego modułu AI.

## Decyzje techniczne pierwszego kroku

- Jeden projekt Next.js zarządzany przez npm.
- Alias importów `@/*` wskazuje na `src/*`.
- Bez eksperymentalnych funkcji.
- Formularz analizy obsługuje Server Action; brak publicznego API i połączeń z zewnętrznymi usługami.

## Odłożone

Backend, baza danych, auth, AI, upload zdjęć, automatyzacja workflow i testy przeglądarkowe zostaną wybrane, gdy będą potrzebne w zaakceptowanym zadaniu.
