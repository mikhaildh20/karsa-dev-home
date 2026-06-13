# Agent Notes — Karsa Home

Always read `docs/PROJECT_CONTEXT.md` before making Karsa Home changes.

This repo controls the root homepage/project directory for `karsa-dev.my.id`.
Keep this context separate from KVS, Portfolio, and Hermes Dashboard.

Rules:

- Prefer DB content edits in PostgreSQL `"KarsaHome".mst_detail_settings` for text, logo path, and project cards.
- Project cards use `card_N_title/body/url/image_path/image_alt` keys.
- Use `/home-assets/...`, not `/home_assets/...`.
- Keep site UI English unless the user asks otherwise.
- Do not re-add old direct CTA buttons unless explicitly requested; current UX uses project-card search/filter.
- Do not commit or print credentials/secrets.
- Verify root homepage and `/health` before reporting success.
