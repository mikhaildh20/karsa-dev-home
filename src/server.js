import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '..', 'public');
const app = express();
const port = Number(process.env.PORT || 3300);
const pool = new Pool({ database: 'KarsaHome', host: '/var/run/postgresql' });

const defaults = {
  site_title: 'Karsa Dev — PlugPlay Server',
  hero_badge: 'Karsa Dev Server',
  hero_title: 'Build, deploy, and organize small IT projects from one VPS.',
  hero_intro: 'This is the home page for Karsa Dev, a plug-and-play server workspace for portfolio pages, dashboards, experiments, and web apps.',
  logo_path: '/home-assets/karsa_project.png',
  logo_alt: 'Karsa Dev logo',
  primary_cta_label: 'Open Portfolio',
  primary_cta_url: '/portfolio/',
  secondary_cta_label: 'Open Hermes Dashboard',
  secondary_cta_url: '/dashboard-agent/',
  domain_label: 'karsa-dev.my.id',
  server_status_label: 'PlugPlay routes are active',
  card_1_title: 'Portfolio',
  card_1_body: 'Personal portfolio site powered by Node.js, PostgreSQL, and path-based deployment.',
  card_1_url: '/portfolio/',
  card_2_title: 'Hermes Dashboard',
  card_2_body: 'Protected web dashboard for managing Hermes Agent configuration, sessions, tools, and gateway state.',
  card_2_url: '/dashboard-agent/',
  footer_text: 'Karsa Dev · Managed VPS workspace',
};

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

function safePath(value = '/') {
  const text = String(value || '/');
  return text.startsWith('/') || text.startsWith('https://') ? text : '/';
}

async function loadSettings() {
  const { rows } = await pool.query('select setting_key, setting_value from mst_detail_settings order by setting_key asc');
  const fromDb = Object.fromEntries(rows.map((row) => [row.setting_key, row.setting_value]));
  return { ...defaults, ...fromDb };
}

function page(raw) {
  const s = Object.fromEntries(Object.entries(raw).map(([key, value]) => [key, key.endsWith('_url') || key.endsWith('_path') ? safePath(value) : escapeHtml(value)]));
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${s.site_title}</title>
  <style>
    :root{color-scheme:dark;--bg:#070a12;--card:#101827;--text:#eef4ff;--muted:#9aa8bd;--line:rgba(255,255,255,.12);--blue:#65a8ff;--pink:#ff75b7}
    *{box-sizing:border-box} body{margin:0;font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;background:radial-gradient(circle at top left,rgba(101,168,255,.25),transparent 34%),radial-gradient(circle at 80% 10%,rgba(255,117,183,.18),transparent 30%),var(--bg);color:var(--text);min-height:100vh}
    main{width:min(1080px,92vw);margin:auto;padding:76px 0 36px}.badge,.pill{display:inline-flex;align-items:center;gap:10px;border:1px solid var(--line);border-radius:999px;padding:9px 14px;background:rgba(255,255,255,.06);color:var(--muted)}.dot{width:9px;height:9px;background:#4ade80;border-radius:50%;box-shadow:0 0 18px #4ade80}
    .logo{width:96px;height:96px;border-radius:28px;object-fit:cover;border:1px solid var(--line);background:rgba(255,255,255,.06);padding:10px;box-shadow:0 24px 80px rgba(0,0,0,.28)}
    h1{font-size:clamp(42px,7vw,84px);line-height:.96;letter-spacing:-.07em;margin:24px 0 20px;max-width:920px}.intro{font-size:20px;line-height:1.7;color:var(--muted);max-width:760px}.actions{display:flex;gap:14px;flex-wrap:wrap;margin:32px 0 48px}.btn{color:var(--text);text-decoration:none;border:1px solid var(--line);border-radius:16px;padding:14px 18px;background:rgba(255,255,255,.06);font-weight:700}.btn.primary{background:linear-gradient(135deg,var(--blue),var(--pink));color:#07111f;border:0}
    .grid{display:grid;grid-template-columns:repeat(2,1fr);gap:18px}.card{min-height:210px;text-decoration:none;color:inherit;background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.04));border:1px solid var(--line);border-radius:28px;padding:28px;transition:.2s}.card:hover{transform:translateY(-4px);border-color:rgba(101,168,255,.55)}.card h2{margin:0 0 12px;font-size:28px}.card p{color:var(--muted);line-height:1.65}.meta{display:flex;gap:10px;flex-wrap:wrap;margin-top:24px}footer{margin-top:54px;color:var(--muted)}
    @media(max-width:760px){.grid{grid-template-columns:1fr} main{padding-top:42px}.intro{font-size:17px}}
  </style>
</head>
<body>
  <main>
    <img class="logo" src="${s.logo_path}" alt="${s.logo_alt}" onerror="this.style.display='none'" />
    <br><br>
    <span class="badge"><span class="dot"></span>${s.hero_badge}</span>
    <h1>${s.hero_title}</h1>
    <p class="intro">${s.hero_intro}</p>
    <div class="actions"><a class="btn primary" href="${s.primary_cta_url}">${s.primary_cta_label}</a><a class="btn" href="${s.secondary_cta_url}">${s.secondary_cta_label}</a></div>
    <section class="grid"><a class="card" href="${s.card_1_url}"><h2>${s.card_1_title}</h2><p>${s.card_1_body}</p></a><a class="card" href="${s.card_2_url}"><h2>${s.card_2_title}</h2><p>${s.card_2_body}</p></a></section>
    <div class="meta"><span class="pill">${s.domain_label}</span><span class="pill">${s.server_status_label}</span><span class="pill">PostgreSQL: KarsaHome.mst_detail_settings</span></div>
    <footer>${s.footer_text}</footer>
  </main>
</body>
</html>`;
}

app.disable('x-powered-by');
app.use('/assets', express.static(path.join(publicDir, 'assets'), { maxAge: process.env.NODE_ENV === 'production' ? '1h' : 0 }));
app.get('/health', async (_req, res) => {
  try { await pool.query('select 1'); res.json({ ok: true, service: 'karsa-home', database: 'ok' }); }
  catch { res.status(200).json({ ok: true, service: 'karsa-home', database: 'error' }); }
});
app.get('/api/settings', async (_req, res) => {
  try { res.json({ ok: true, source: 'database', settings: await loadSettings() }); }
  catch { res.json({ ok: true, source: 'defaults', settings: defaults }); }
});
app.get('*', async (_req, res) => {
  try { res.type('html').send(page(await loadSettings())); }
  catch (error) { console.error(error.message); res.type('html').send(page(defaults)); }
});

app.listen(port, '127.0.0.1', () => console.log(`Karsa Home listening at http://127.0.0.1:${port}`));

