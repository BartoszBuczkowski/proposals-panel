# Proposals panel

Small Next.js panel that lists **loan applications** from local JSON fixtures exposed as API routes. The table is driven by column metadata (labels, types, order, visibility, sort/filter flags, and row actions).

The repository is named `proposals-panel` for historical reasons; the domain term used throughout the code and docs is **Loan Application** (see [`CONTEXT.md`](CONTEXT.md)). Fixture labels arrive from the backend in Polish, while the UI chrome and documentation are English.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server on port 3000 |
| `npm run typecheck` | `tsc --noEmit` over the whole project |
| `npm test` | Vitest unit suite, single run |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run test:watch` | Vitest in watch mode |

## Assumptions

- **Fixtures are the backend.** [`data/columns.json`](data/columns.json) and [`data/rows.json`](data/rows.json) stand in for real services; both are read on the server and validated with Zod before use, exactly as a real payload would be.
- **`visible` defaults to `true`** when the backend omits it, so a new column shows up unless it is explicitly hidden.
- **Search covers `customerName` and `loanId` only.** The metadata marks several columns `filterable`, but the brief needs one search box, so the remaining flags stay unused rather than half-implemented.
- **Status options come from the metadata**, never from a hardcoded list in the UI — the filter dropdown is built from the `options` of the `status` column.
- **`?error=1` on `/api/rows` returns a 500**, which is how the error state is exercised from the UI.
- **Currency is rendered without a code.** Fixtures carry a bare `monthlyRate` number and no currency, so the cell formats the amount with a generic marker instead of inventing a currency.
- **Authorization is `row.permissions[column.key]`.** There is no session or user model; a row action is enabled only when the row carries the matching permission flag.
- **Sorting applies to the current page only.** Filtering and pagination are server-side in `/api/rows`, but sorting runs client-side through TanStack's sorted row model, so it reorders the 10 rows currently on screen rather than the whole result set. This is a deliberate scoping decision, not an oversight — see the next-steps section.

## Technical decisions

- **Column metadata is read on the server** via a shared `readColumns()` helper and passed into the panel as props. [`app/page.tsx`](app/page.tsx) sets `export const revalidate = 3600`, so the prerendered shell already contains the metadata and refreshes about once an hour. See [ADR 0002](docs/adr/0002-server-rendered-column-metadata.md).
- **Route handlers back both resources.** [`/api/columns`](app/api/columns/route.ts) stays a public HTTP endpoint over the same helper and responds with `Cache-Control: public, max-age=3600, stale-while-revalidate=86400`. [`/api/rows`](app/api/rows/route.ts) is the only endpoint the browser fetches, and it is fetched with `cache: "no-store"` in [`lib/api/use-fetch-validated.ts`](lib/api/use-fetch-validated.ts) because the response depends on the active filters.
- **TanStack Table v9** builds column definitions from metadata in [`build-columns.tsx`](features/loan-applications/functions/build-columns.tsx), so a backend change to columns reshapes the panel without touching table markup. See [ADR 0001](docs/adr/0001-metadata-driven-table.md).
- **One feature module** under [`features/loan-applications/`](features/loan-applications/): a rows-focused provider plus compound UI with explicit loading / error / empty / success views.
- **Filters live in the URL.** [`use-loan-applications-query.ts`](features/loan-applications/hooks/use-loan-applications-query.ts) parses search params through a Zod schema and writes them back with `router.replace`, which makes a filtered view shareable and reloadable.

## Metadata model

Fixtures live in [`data/columns.json`](data/columns.json) and [`data/rows.json`](data/rows.json).

**Column Metadata** fields used by the UI:

| Field | Role |
| --- | --- |
| `key` | Row field or permission key |
| `label` | Header text (may be localized by the backend) |
| `type` | `text` \| `badge` \| `currency` \| `date` \| `action` |
| `sortable` / `filterable` | Capability flags |
| `visible` | Optional; default `true` when omitted |
| `options` | Allowed values (status filter) |
| `action` | Action id for `type: "action"` columns |

Row action availability uses `row.permissions[column.key]`.

## Programming principles / Zasady programowania

### EN

**Composition instead of boolean mode props.** The panel does not take `isLoading` / `isEmpty` / `hasError` flags. Each lifecycle state is its own component, and the provider exposes a context shaped as `{ state, actions }` so siblings read what they need without prop drilling. Adding a new state means adding a component, not another branch inside an existing one.

```tsx
// features/loan-applications/loan-applications-panel.tsx
<LoanApplicationsProvider columns={columns}>
  <LoanApplicationsToolbar />
  <LoanApplicationsLoading />
  <LoanApplicationsError />
  <LoanApplicationsEmpty />
  <LoanApplicationsSuccess />
</LoanApplicationsProvider>
```

**Validate at the boundary and fail closed.** Every piece of external JSON — fixture reads, route handler query strings, browser responses — goes through a Zod schema from [`features/loan-applications/schema/`](features/loan-applications/schema/) before any domain code sees it. [`lib/api/fetch-validated.ts`](lib/api/fetch-validated.ts) throws on a bad payload rather than coercing it into a partial object, so a malformed response surfaces as the error state instead of a half-rendered table.

**Cache what rarely changes, never cache what the user filters.** Column metadata is static configuration, so it is read on the server and revalidated hourly. Row data depends on the active query and is fetched fresh every time.

```tsx
// app/page.tsx
export const revalidate = 3600

export default async function Home() {
  const columns = await readColumns()
  return <LoanApplicationsPanel columns={columns} />
}
```

**Colocation by business capability.** Everything the feature owns — components, hooks, pure functions, schemas, fixtures and `*.spec` files — lives under [`features/loan-applications/`](features/loan-applications/). Tests sit next to the code they cover, so deleting the feature deletes its tests with it and nothing is left stranded in a distant `__tests__` tree.

**Business logic out of components.** Components render; decisions live in [`functions/`](features/loan-applications/functions/) and [`hooks/`](features/loan-applications/hooks/). Filtering, query-param parsing, URL building and response-to-state mapping are plain functions, which is precisely why they are cheap to unit test without mounting React.

### PL

**Kompozycja zamiast propsów typu boolean.** Panel nie przyjmuje flag `isLoading` / `isEmpty` / `hasError`. Każdy stan cyklu życia to osobny komponent, a provider udostępnia kontekst w kształcie `{ state, actions }`, dzięki czemu komponenty siostrzane czytają to, czego potrzebują, bez przekazywania propsów przez kolejne poziomy. Dodanie nowego stanu oznacza dodanie komponentu, a nie kolejnego warunku wewnątrz istniejącego (przykład kodu powyżej: `loan-applications-panel.tsx`).

**Walidacja na granicy systemu i zasada fail closed.** Każdy fragment zewnętrznego JSON-a — odczyt fixture'ów, query string w route handlerze, odpowiedzi pobierane w przeglądarce — przechodzi przez schemat Zod z [`features/loan-applications/schema/`](features/loan-applications/schema/), zanim zobaczy go kod domenowy. [`lib/api/fetch-validated.ts`](lib/api/fetch-validated.ts) rzuca wyjątkiem przy niepoprawnym payloadzie, zamiast rzutować go na niekompletny obiekt, więc błędna odpowiedź kończy się widokiem błędu, a nie w połowie wyrenderowaną tabelą.

**Cache'uję to, co zmienia się rzadko; nigdy to, co użytkownik filtruje.** Metadane kolumn to statyczna konfiguracja, więc czytam je po stronie serwera i rewaliduję co godzinę (`revalidate = 3600` w `app/page.tsx`, przykład kodu powyżej). Dane wierszy zależą od aktywnego zapytania i są pobierane za każdym razem na świeżo.

**Kolokacja według zdolności biznesowej.** Wszystko, co należy do funkcjonalności — komponenty, hooki, czyste funkcje, schematy, fixture'y i pliki `*.spec` — leży w [`features/loan-applications/`](features/loan-applications/). Testy trzymam obok kodu, który sprawdzają, więc usunięcie funkcjonalności usuwa też jej testy i nic nie zostaje osierocone w odległym katalogu `__tests__`.

**Logika biznesowa poza komponentami.** Komponenty renderują; decyzje żyją w [`functions/`](features/loan-applications/functions/) i [`hooks/`](features/loan-applications/hooks/). Filtrowanie, parsowanie parametrów zapytania, budowanie URL-i i mapowanie odpowiedzi na stan to zwykłe funkcje — właśnie dlatego są tanie w testowaniu jednostkowym, bez montowania Reacta.

## What I would do next / Co zrobiłbym dalej

### EN

Given another 60-90 minutes, in this order:

1. **Integration tests for the panel.** The suite here is deliberately unit-only: pure functions, schemas and a single cell component. That was a conscious trade-off in favour of fast, stable feedback on the logic, and it leaves one real gap — nothing asserts that the pieces work together. I would mount `LoanApplicationsPanel` with a mocked `fetch` and cover loading, success, empty and error, plus the filter round-trip through the URL.
2. **Move sorting server-side** into [`app/api/rows/route.ts`](app/api/rows/route.ts) so it spans the whole result set instead of the current page, which removes the asymmetry named in the assumptions.
3. **Persist sort state in the URL** next to the existing filters in [`use-loan-applications-query.ts`](features/loan-applications/hooks/use-loan-applications-query.ts), so a sorted view is as shareable as a filtered one.
4. **A keyboard and screen-reader pass** over the sortable headers in [`loan-applications-table.tsx`](features/loan-applications/components/loan-applications-table.tsx): `aria-sort` on the header cells and an accessible name that announces the current direction.

### PL

Przy dodatkowych 60-90 minutach, w tej kolejności:

1. **Testy integracyjne panelu.** Obecny zestaw testów to świadomie wyłącznie testy jednostkowe: czyste funkcje, schematy i jeden komponent komórki. To był celowy kompromis na rzecz szybkiej i stabilnej informacji zwrotnej o logice, ale zostawia jedną realną lukę — nic nie sprawdza, czy elementy działają razem. Zamontowałbym `LoanApplicationsPanel` z zamockowanym `fetch` i pokrył stany ładowania, sukcesu, pustej listy i błędu oraz pełny obieg filtrowania przez URL.
2. **Przeniósłbym sortowanie na serwer** do [`app/api/rows/route.ts`](app/api/rows/route.ts), aby obejmowało cały zbiór wyników, a nie tylko bieżącą stronę — to usuwa asymetrię opisaną w sekcji założeń.
3. **Zapisywałbym stan sortowania w URL-u** obok istniejących filtrów w [`use-loan-applications-query.ts`](features/loan-applications/hooks/use-loan-applications-query.ts), żeby posortowany widok dało się udostępnić tak samo jak przefiltrowany.
4. **Przegląd dostępności** nagłówków sortowalnych w [`loan-applications-table.tsx`](features/loan-applications/components/loan-applications-table.tsx): obsługa klawiatury i czytników ekranu, `aria-sort` na komórkach nagłówka oraz nazwa dostępna komunikująca aktualny kierunek sortowania.

## Agent docs

- [`CONTEXT.md`](CONTEXT.md) — domain glossary
- [`.cursor/rules/`](.cursor/rules/) — project conventions
- [`docs/adr/`](docs/adr/) — architecture decisions
- [`AGENTS.md`](AGENTS.md) — Next.js + project pointers
