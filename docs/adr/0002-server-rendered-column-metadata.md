# Server-rendered column metadata

Column metadata is static configuration for the loan applications panel. It does not depend on the request URL or filters.

The home page is an async Server Component that reads `data/columns.json` through a shared `readColumns()` helper and passes the result as props. The route uses `export const revalidate = 3600` so the prerendered shell includes metadata and refreshes about once an hour.

`/api/columns` remains a public HTTP endpoint for external consumers and reuses the same helper. The panel UI does not fetch it from the browser.

Row data stays client-fetched from `/api/rows` because it depends on search params and must support reload / simulated error flows.
