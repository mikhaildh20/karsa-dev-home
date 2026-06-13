# Karsa Dev Home

Dynamic root homepage and project directory for `karsa-dev.my.id`.

For agent/project-specific context, read:

```txt
docs/PROJECT_CONTEXT.md
```

## Runtime

- Node.js + Express
- PostgreSQL database: `"KarsaHome"`
- Settings table: `mst_detail_settings`
- Internal bind: `127.0.0.1:3300`
- Systemd service: `karsa-home.service`
- Reverse proxy: Nginx

## Routes

- `/` — dynamic Karsa Dev home page
- `/health` — health check
- `/api/settings` — current settings from PostgreSQL

## Edit content

Most content should be edited in PostgreSQL instead of hardcoded.

```sql
UPDATE mst_detail_settings
SET setting_value = 'New headline',
    updated_at = now()
WHERE setting_key = 'hero_title';
```

Project cards use this key pattern:

```txt
card_N_title
card_N_body
card_N_url
card_N_image_path
card_N_image_alt
```
