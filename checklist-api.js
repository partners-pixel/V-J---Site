/**
 * checklist-api.js — downloadable compliance checklists (file uploads).
 *
 * Storage (runtime, git-ignored):
 *   checklist-data/items.json        list of checklist entries
 *   checklist-data/files/<file>      uploaded documents, served at /checklist-files/<file>
 *
 * Endpoints (mounted at /api/checklist):
 *   GET    /            list checklists (newest first)    — public
 *   POST   /            create (multipart, file)          — admin
 *   DELETE /:id         delete (+ its file)               — admin
 *
 * Admin auth via the `x-admin-key` header (or `adminKey` form field), ADMIN_KEY in .env.
 */
import express from 'express';
import multer from 'multer';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'checklist-data');
const FILE_DIR = path.join(DATA_DIR, 'files');
const ITEMS_FILE = path.join(DATA_DIR, 'items.json');

const ADMIN_KEY = process.env.ADMIN_KEY || 'vjdesai-admin';

fs.mkdirSync(FILE_DIR, { recursive: true });

const readItems = () => { try { return JSON.parse(fs.readFileSync(ITEMS_FILE, 'utf8')); } catch { return []; } };
const writeItems = (items) => fs.writeFileSync(ITEMS_FILE, JSON.stringify(items, null, 2));

const ALLOWED = /\.(pdf|docx?|xlsx?|csv|pptx?|png|jpe?g)$/i;

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, FILE_DIR),
  filename: (_req, file, cb) => {
    const ext = (path.extname(file.originalname) || '').toLowerCase().slice(0, 8);
    cb(null, `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, ALLOWED.test(file.originalname)),
});

const requireAdmin = (req, res, next) => {
  const key = req.get('x-admin-key') || req.body?.adminKey;
  if (key !== ADMIN_KEY) return res.status(401).json({ success: false, message: 'Unauthorized — invalid admin key.' });
  next();
};

const router = express.Router();

// List (public)
router.get('/', (_req, res) => res.json({ success: true, items: readItems() }));

// Create (admin)
router.post('/', upload.single('file'), requireAdmin, (req, res) => {
  const b = req.body || {};
  const title = (b.title || '').trim();
  if (!title) return res.status(422).json({ success: false, message: 'Title is required.' });
  if (!req.file) return res.status(422).json({ success: false, message: 'A checklist file is required (PDF, Word, Excel, etc.).' });

  const item = {
    id: `${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
    title,
    category: (b.category || 'General').trim(),
    description: (b.description || '').trim(),
    file: `/checklist-files/${req.file.filename}`,
    fileName: req.file.originalname,
    size: req.file.size,
    date: new Date().toISOString(),
  };
  const items = readItems();
  items.unshift(item);
  writeItems(items);
  res.json({ success: true, item });
});

// Delete (admin)
router.delete('/:id', requireAdmin, (req, res) => {
  const items = readItems();
  const idx = items.findIndex((x) => x.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Not found.' });
  const [removed] = items.splice(idx, 1);
  if (removed.file) {
    fs.rm(path.join(FILE_DIR, path.basename(removed.file)), { force: true }, () => {});
  }
  writeItems(items);
  res.json({ success: true });
});

export default function mountChecklist(app) {
  app.use('/checklist-files', express.static(FILE_DIR));
  app.use('/api/checklist', router);
}
