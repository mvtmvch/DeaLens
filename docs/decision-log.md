# Rejestr decyzji

## Zaakceptowane

- Nazwa produktu: `DeaLens`; nazwa pakietu npm: `dealens`.
- Etap 0 i manual-first walking skeleton mogą powstawać równolegle.
- Etap 0 blokuje automatyczny import URL i produkcyjny adapter marketplace.
- Pierwszy krok obejmuje wyłącznie scaffold Next.js z TypeScript, App Router, Tailwind CSS, ESLint i katalogiem `src`.

## Decyzje techniczne pierwszego kroku

- Jeden projekt Next.js zarządzany przez npm.
- Alias importów `@/*` wskazuje na `src/*`.
- Bez eksperymentalnych funkcji i dodatkowych zależności.

## Odłożone

Backend, baza danych, auth, AI, automatyzacja workflow, testy przeglądarkowe i model domenowy zostaną wybrane, gdy będą potrzebne w zaakceptowanym zadaniu.
