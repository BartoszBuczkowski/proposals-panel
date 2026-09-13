# Proposals panel

Small Next.js panel that lists **loan applications** from local JSON fixtures exposed as API routes. The table is driven by column metadata (labels, types, order, visibility, sort/filter flags, and row actions).

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm test
npm run build
```

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

Row action availability uses `row.permissions[column.key]`. Fixture labels may be non-English; UI chrome and docs are English.

## Technical decisions

- **Route Handlers** (`/api/columns`, `/api/rows`) read fixtures and validate with Zod before responding. Pass `?error=1` on `/api/rows` to exercise the error state.
- **TanStack Table v9** builds column defs from metadata (see [ADR 0001](docs/adr/0001-metadata-driven-table.md)).
- **Feature module** under `features/loan-applications/` with provider + compound UI and explicit loading / error / empty / success views.
- **Currency** cells show a formatted number with a generic currency marker (fixtures do not include a currency code).
- **Search** matches `customerName` and `loanId`; status uses the status column `options`.

## Agent docs

- [`CONTEXT.md`](CONTEXT.md) — domain glossary
- [`.cursor/rules/`](.cursor/rules/) — project conventions
- [`docs/adr/`](docs/adr/) — architecture decisions
- [`AGENTS.md`](AGENTS.md) — Next.js + project pointers
