# Project Context — Karsa Home

## Purpose

Karsa Home is the public root homepage/project directory for `karsa-dev.my.id`.

Use this context only for the homepage, public project cards, home assets, and root-domain routing. Do not mix it with KVS, Portfolio, or Hermes Dashboard internals unless the user explicitly asks to link/display them from Karsa Home.

## Repo / Path

- Repo: `mikhaildh20/karsa-dev-home`
- Path: `/opt/projects/karsa-home`
- Branch: `main`

## Runtime

- App: Node.js + Express
- Service: `karsa-home.service`
- Internal bind: `127.0.0.1:3300`
- Public URL: `https://karsa-dev.my.id`
- Reverse proxy: Nginx
- Deployment pattern: systemd + Nginx, not PM2

## Database

- DBMS: PostgreSQL
- Database: `"KarsaHome"` — quote it because it is case-sensitive
- Main table: `mst_detail_settings`
- Prefer DB edits for content/card changes instead of hardcoding.

Table shape:

```txt
setting_key text primary key
setting_value text not null default ''
updated_at timestamptz not null default now()
```

## Routes

- `/` — dynamic homepage
- `/health` — health check
- `/api/settings` — settings JSON
- `/home-assets/...` — public home assets

Asset route uses dash: `/home-assets/...`, not `/home_assets/...`.

## Dynamic Card Pattern

Project cards are DB-driven:

```txt
card_N_title
card_N_body
card_N_url
card_N_image_path
card_N_image_alt
```

Current public cards:

1. Portfolio
   - URL: `https://portfolio.karsa-dev.my.id/`
   - Image: `/home-assets/portfolio-preview.svg`
2. Kanban Verification System
   - URL: `https://kvs-demo.karsa-dev.my.id/`
   - Image: `/home-assets/kvs-preview.svg`

Hermes Dashboard is intentionally private and must not be shown as a public Karsa Home card.

## Hermes Dashboard Boundary

- No public Karsa Home card.
- No public `/dashboard-agent` route.
- No public proxy to dashboard.
- Access is through SSH tunnel to local port `127.0.0.1:9119` only.
- Do not expose credentials or dashboard URLs publicly.

## UI Direction

- Dark, clean dev workspace homepage.
- English site copy unless the user asks otherwise.
- Project-card search/filter is the current UX.
- Do not re-add direct CTA buttons like “Open Portfolio” / “Open Hermes Dashboard” unless requested.
- Logo/signature asset: `/home-assets/karsa_project.png` when available.

## Safe SQL Pattern

Use:

```bash
sudo -u postgres psql -d "KarsaHome"
```

Upsert example:

```sql
INSERT INTO mst_detail_settings (setting_key, setting_value, updated_at)
VALUES
('card_3_title', 'Example Project', now()),
('card_3_body', 'Short project description.', now()),
('card_3_url', 'https://example.karsa-dev.my.id/', now()),
('card_3_image_path', '/home-assets/karsa_project.png', now()),
('card_3_image_alt', 'Example Project preview', now())
ON CONFLICT (setting_key) DO UPDATE
SET setting_value = EXCLUDED.setting_value,
    updated_at = now();
```

## Verification Checklist

Before reporting Karsa Home work as done:

1. `npm test` if source changed.
2. `nginx -t` if Nginx changed.
3. `systemctl is-active karsa-home.service`.
4. `curl http://127.0.0.1:3300/health` returns ok.
5. `curl https://karsa-dev.my.id/` returns HTTP 200.
6. If cards changed, verify rendered homepage contains expected text/URLs/images and does not contain removed cards.
7. Confirm no real credentials/secrets are committed or printed.

## Related Contexts

- Portfolio: `/opt/projects/mike-portfolio/docs/PROJECT_CONTEXT.md`
- KVS backend: `/opt/projects/kvs-demo-backend/docs/PROJECT_CONTEXT.md`
- KVS frontend: `/opt/projects/kvs-demo-frontend/docs/PROJECT_CONTEXT.md`
