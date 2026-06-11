# Karsa Dev Home

Dynamic PlugPlay home page for `karsa-dev.my.id`.

## Runtime

- Node.js + Express
- PostgreSQL database: `KarsaHome`
- Settings table: `mst_detail_settings`
- Internal port: `3300`
- Systemd service: `karsa-home.service`

## Routes

- `/` — dynamic Karsa Dev home page
- `/health` — health check
- `/api/settings` — current settings from PostgreSQL

## Edit content

```sql
update mst_detail_settings
set setting_value = 'New headline'
where setting_key = 'hero_title';
```
