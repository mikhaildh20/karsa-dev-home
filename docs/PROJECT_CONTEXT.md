# Project Context — Karsa Home

## Scope

This context is for Karsa Home only. Karsa Home is the root landing page for the `karsa-dev.my.id` VPS workspace and acts as the public project directory/navigation page.

Keep this context separate from KVS / Kanban Verification System, Mike Portfolio, Hermes Dashboard, and backend demo projects. Only touch other projects when the user explicitly asks to link to them or update their displayed card on Karsa Home.

## Repository and Path

- Repository: `mikhaildh20/karsa-dev-home`
- Server path: `/opt/projects/karsa-home`
- Branch: `main`

## Runtime

- Runtime: Node.js + Express
- Internal bind: `127.0.0.1:3300`
- Systemd service: `karsa-home.service`
- Reverse proxy: Nginx
- Deployment style: systemd + Nginx, not PM2
- Public root domain: `https://karsa-dev.my.id`

## Database

- DBMS: PostgreSQL
- Database: `"KarsaHome"` — case-sensitive, quote it in psql/SQL when needed
- Main table: `mst_detail_settings`
- Schema shape:
  - `setting_key text primary key`
  - `setting_value text not null default ''`
  - `updated_at timestamptz not null default now()`

Content is dynamic. Prefer editing `mst_detail_settings` over hardcoding content in HTML/JS unless a structural change is needed.

## Main Routes

- `/` — dynamic Karsa Home page
- `/health` — health check
- `/api/settings` — current settings from PostgreSQL
- `/home-assets/...` — public home assets via Nginx/project asset route

## Dynamic Settings

Important keys currently used:

- `site_title`
- `logo_path`
- `logo_alt`
- `hero_badge`
- `hero_title`
- `hero_intro`
- `search_placeholder`
- `domain_label`
- `server_status_label`
- `footer_text`

Project cards use this pattern:

- `card_N_title`
- `card_N_body`
- `card_N_url`
- `card_N_image_path`
- `card_N_image_alt`

Where `N` is the display order. Cards are rendered dynamically from the DB and sorted by `N`.

Current known cards:

1. Portfolio → `https://portfolio.karsa-dev.my.id/`
2. Hermes Dashboard → `https://hermes-dashboard.karsa-dev.my.id/`
3. Kanban Verification System → `https://kvs-demo.karsa-dev.my.id/`

## UI/Content Direction

- Karsa Home is a clean dark themed dev-server homepage.
- It should feel like a project directory / workspace entry point.
- It currently uses search/filter for project cards.
- Do not re-add old CTA buttons like “Open Portfolio” or “Open Hermes Dashboard” unless user explicitly asks.
- Keep text in English for the site UI unless the user asks otherwise.
- Logo/signature asset should use `/home-assets/karsa_project.png` when available.
- Asset route uses dash: `/home-assets/...`, not `/home_assets/...`.

## Context Boundaries

When the user says switch to Karsa Home context, focus on:

- `/opt/projects/karsa-home`
- PostgreSQL database `"KarsaHome"`
- table `mst_detail_settings`
- root domain `https://karsa-dev.my.id`
- project cards and homepage content
- Nginx routing only as far as Karsa Home/root domain needs it

Do not modify KVS code, Portfolio code, or Hermes Dashboard unless explicitly asked. If the user asks to add access to another web app, usually update/add a `card_N_*` group in `"KarsaHome".mst_detail_settings`.

## Safe SQL Pattern

Use `sudo -u postgres psql -d "KarsaHome"` if the current user lacks permission.

Example upsert:

```sql
INSERT INTO mst_detail_settings (setting_key, setting_value, updated_at)
VALUES
('card_4_title', 'Example Project', now()),
('card_4_body', 'Short project description.', now()),
('card_4_url', 'https://example.karsa-dev.my.id/', now()),
('card_4_image_path', '/home-assets/karsa_project.png', now()),
('card_4_image_alt', 'Example Project preview', now())
ON CONFLICT (setting_key) DO UPDATE
SET setting_value = EXCLUDED.setting_value,
    updated_at = now();
```

## Verification Checklist

Before reporting Karsa Home changes as done:

1. `git status --short` reviewed.
2. If source changed, run `npm test` when meaningful.
3. `systemctl is-active karsa-home.service` is active.
4. `curl http://127.0.0.1:3300/health` returns ok.
5. `curl https://karsa-dev.my.id/` returns HTTP 200.
6. If card/content changed, verify the expected text/URL appears in rendered homepage HTML.
7. Do not commit real credentials, DB passwords, API keys, or tokens.

## Related Projects Linked From Home

- Portfolio context lives in `/opt/projects/mike-portfolio/docs/PROJECT_CONTEXT.md`.
- KVS context lives in `/opt/projects/kvs-demo-backend/docs/PROJECT_CONTEXT.md` and `/opt/projects/kvs-demo-frontend/docs/PROJECT_CONTEXT.md`.
- Hermes Dashboard has service/routing context, but do not expose credentials in docs or chat.
