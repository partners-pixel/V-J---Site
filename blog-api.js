/**
 * blog-api.js — simple file-backed blog with image upload.
 *
 * Storage (runtime, git-ignored):
 *   blog-data/posts.json        list of posts
 *   blog-data/uploads/<file>    uploaded cover images, served at /uploads/<file>
 *
 * Endpoints (mounted at /api/blog):
 *   GET    /            list posts (newest first)        — public
 *   GET    /:id         single post                      — public
 *   POST   /            create post (multipart, image)   — admin
 *   PUT    /:id         update post (multipart, image)   — admin
 *   DELETE /:id         delete post (+ its image)        — admin
 *
 * Admin requests must send the admin key via the `x-admin-key` header or an
 * `adminKey` form field. Set ADMIN_KEY in .env (defaults to a dev value).
 */
import express from 'express';
import multer from 'multer';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'blog-data');
const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');
const POSTS_FILE = path.join(DATA_DIR, 'posts.json');

const ADMIN_KEY = process.env.ADMIN_KEY || 'vjdesai-admin';
if (!process.env.ADMIN_KEY) {
  console.warn('⚠️  ADMIN_KEY not set — using dev default "vjdesai-admin". Set ADMIN_KEY in .env for the blog admin panel.');
}

// Ensure storage dirs exist.
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const readPosts = () => {
  try { return JSON.parse(fs.readFileSync(POSTS_FILE, 'utf8')); }
  catch { return []; }
};
const writePosts = (posts) => fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));

// Multer: store cover images on disk with a unique, safe name; images only, max 5 MB.
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = (path.extname(file.originalname) || '').toLowerCase().slice(0, 8);
    cb(null, `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, /^image\//.test(file.mimetype)),
});

const requireAdmin = (req, res, next) => {
  const key = req.get('x-admin-key') || req.body?.adminKey;
  if (key !== ADMIN_KEY) return res.status(401).json({ success: false, message: 'Unauthorized — invalid admin key.' });
  next();
};

const router = express.Router();

// Login — verify the admin key (key via x-admin-key header or { adminKey } body)
router.post('/login', (req, res) => {
  const key = req.get('x-admin-key') || req.body?.adminKey;
  if (key !== ADMIN_KEY) return res.status(401).json({ success: false, message: 'Invalid admin key.' });
  res.json({ success: true });
});

// List
router.get('/', (_req, res) => res.json({ success: true, posts: readPosts() }));

// Single
router.get('/:id', (req, res) => {
  const post = readPosts().find((p) => p.id === req.params.id);
  if (!post) return res.status(404).json({ success: false, message: 'Not found.' });
  res.json({ success: true, post });
});

// Create (admin) — multipart with optional "image" file
router.post('/', upload.single('image'), requireAdmin, (req, res) => {
  const b = req.body || {};
  const title = (b.title || '').trim();
  if (!title) return res.status(422).json({ success: false, message: 'Title is required.' });

  const post = {
    id: `${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
    title,
    category: (b.category || 'Blog').trim(),
    excerpt: (b.excerpt || '').trim(),
    content: (b.content || '').trim(),
    image: req.file ? `/uploads/${req.file.filename}` : null,
    date: new Date().toISOString(),
  };
  const posts = readPosts();
  posts.unshift(post);
  writePosts(posts);
  res.json({ success: true, post });
});

// Update (admin) — multipart; replaces the cover image only if a new one is sent
router.put('/:id', upload.single('image'), requireAdmin, (req, res) => {
  const posts = readPosts();
  const idx = posts.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Not found.' });

  const b = req.body || {};
  const title = (b.title ?? posts[idx].title).trim();
  if (!title) return res.status(422).json({ success: false, message: 'Title is required.' });

  const prev = posts[idx];
  let image = prev.image;
  if (req.file) {
    // New image uploaded — remove the old one.
    if (prev.image) {
      fs.rm(path.join(UPLOAD_DIR, path.basename(prev.image)), { force: true }, () => {});
    }
    image = `/uploads/${req.file.filename}`;
  } else if (b.removeImage === 'true') {
    if (prev.image) {
      fs.rm(path.join(UPLOAD_DIR, path.basename(prev.image)), { force: true }, () => {});
    }
    image = null;
  }

  posts[idx] = {
    ...prev,
    title,
    category: (b.category ?? prev.category).trim(),
    excerpt: (b.excerpt ?? prev.excerpt).trim(),
    content: (b.content ?? prev.content).trim(),
    image,
    updated: new Date().toISOString(),
  };
  writePosts(posts);
  res.json({ success: true, post: posts[idx] });
});

// Delete (admin)
router.delete('/:id', requireAdmin, (req, res) => {
  const posts = readPosts();
  const idx = posts.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Not found.' });
  const [removed] = posts.splice(idx, 1);
  if (removed.image) {
    fs.rm(path.join(UPLOAD_DIR, path.basename(removed.image)), { force: true }, () => {});
  }
  writePosts(posts);
  res.json({ success: true });
});

export default function mountBlog(app) {
  app.use('/uploads', express.static(UPLOAD_DIR));
  app.use('/api/blog', router);
}
