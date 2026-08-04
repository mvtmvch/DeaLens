# Zakres MVP

DeaLens ma pomagać w ocenie ofert używanego sprzętu przez uporządkowanie faktów, brakujących informacji i dowodów.

## Bieżący kierunek

- manual-first walking skeleton,
- rozwój Etapu 0 równolegle z funkcjami opartymi na ręcznym wejściu,
- prosty modularny monolit rozwijany dopiero wraz z potrzebami produktu.

## Zrealizowane

- Bezstanowa analiza manualna (`/analiza`): formularz oferty (myszy i klawiatury gamingowe), walidacja Zod, deterministyczny raport faktów — podane informacje, braki wynikające z niewypełnionych pól i pytania do sprzedającego. Raport nie ocenia ceny, opłacalności, autentyczności ani ryzyka oszustwa. Analizy nie są nigdzie zapisywane.

## Poza bieżącym zakresem

Automatyczny import URL, adaptery marketplace, scraping, AI, uwierzytelnianie, baza danych, upload zdjęć, scoring i porównania cen.

Analiza semantyczna tytułu i opisu ogłoszenia (w tym wykrywanie niespójności między deklarowanym stanem a treścią) jest celowo poza zakresem manual-first flow i zostanie zrealizowana przez osobny moduł AI. Obecny przepływ pozostaje deterministycznym fallbackiem opartym wyłącznie na jawnie wybranych polach.

Szerszy materiał analityczny pozostaje w `docs/original-plan.md`.
