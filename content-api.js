/**
 * content-api.js — editable page content overrides.
 *
 * Lets the admin edit any page's HTML content. Overrides are stored in
 * admin-data/page-content.json keyed by slug; when an override exists the
 * site renders it in place of the default page.
 *
 *   GET    /api/page-content/:slug         override html (or null)   — public
 *   GET    /api/admin/page-source/:slug    html to edit (override or  — admin
 *                                          the page's current markup)
 *   PUT    /api/page-content/:slug         save override { html }     — admin
 *   DELETE /api/page-content/:slug         revert to default          — admin
 */
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'admin-data');
const FILE = path.join(DATA_DIR, 'page-content.json');
const PAGES_DIR = path.join(__dirname, 'pages');
const ADMIN_KEY = process.env.ADMIN_KEY || 'vjdesai-admin';

fs.mkdirSync(DATA_DIR, { recursive: true });

const readStore = () => { try { return JSON.parse(fs.readFileSync(FILE, 'utf8')); } catch { return {}; } };
const writeStore = (s) => fs.writeFileSync(FILE, JSON.stringify(s, null, 2));
const fileFor = (slug) => path.join(PAGES_DIR, `${slug === 'home' || slug === '' ? 'index' : slug}.html`);

// Extract the inner HTML of <main> from a full page document.
function extractMain(html) {
  const m = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  return m ? m[1].trim() : '';
}

const requireAdmin = (req, res, next) => {
  const key = req.get('x-admin-key') || req.body?.adminKey;
  if (key !== ADMIN_KEY) return res.status(401).json({ success: false, message: 'Unauthorized — invalid admin key.' });
  next();
};

export default function mountContent(app) {
  const r = express.Router();

  // Public: does this page have an override?
  r.get('/page-content/:slug', (req, res) => {
    const store = readStore();
    res.json({ success: true, html: store[req.params.slug]?.html ?? null });
  });

  // Admin: content to load into the editor (current override, else page markup)
  r.get('/admin/page-source/:slug', requireAdmin, (req, res) => {
    const slug = req.params.slug;
    const store = readStore();
    if (store[slug]?.html != null) return res.json({ success: true, html: store[slug].html, source: 'override' });
    try {
      const main = extractMain(fs.readFileSync(fileFor(slug), 'utf8'));
      return res.json({ success: true, html: main, source: 'page' });
    } catch {
      return res.json({ success: true, html: '', source: 'empty' });
    }
  });

  // Admin: save override
  r.put('/page-content/:slug', requireAdmin, (req, res) => {
    const html = (req.body?.html ?? '').toString();
    const store = readStore();
    store[req.params.slug] = { html, updatedAt: new Date().toISOString() };
    writeStore(store);
    res.json({ success: true });
  });

  // Admin: revert to default
  r.delete('/page-content/:slug', requireAdmin, (req, res) => {
    const store = readStore();
    delete store[req.params.slug];
    writeStore(store);
    res.json({ success: true });
  });

  app.use('/api', r);
}
