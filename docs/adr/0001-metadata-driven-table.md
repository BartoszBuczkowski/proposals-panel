# Metadata-driven table

The loan applications panel builds its table from Column Metadata (order, labels, types, sort/filter flags, visibility, actions) rather than a hardcoded column list in the UI.

TanStack Table column definitions are derived from that metadata so backend changes to columns can reshape the panel without rewriting the table markup.
