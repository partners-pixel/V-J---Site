/**
 * admin-api.js — website admin: login, enquiries (contact submissions), reviews.
 *
 * Storage (runtime, git-ignored): admin-data/enquiries.json, admin-data/reviews.json
 *
 * Endpoints:
 *   POST   /api/admin/login            verify admin key
 *   GET    /api/admin/enquiries        list contact submissions   (admin)
 *   DELETE /api/admin/enquiries/:id    delete an enquiry          (admin)
 *   GET    /api/reviews                list reviews/testimonials  (public)
 *   POST   /api/reviews                create a review            (admin)
 *   PUT    /api/reviews/:id            update a review            (admin)
 *   DELETE /api/reviews/:id            delete a review            (admin)
 *
 * Admin auth via the `x-admin-key` header (or `adminKey` body), ADMIN_KEY in .env.
 */
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'admin-data');
const ENQ_FILE = path.join(DATA_DIR, 'enquiries.json');
const REV_FILE = path.join(DATA_DIR, 'reviews.json');
const ADMIN_KEY = process.env.ADMIN_KEY || 'vjdesai-admin';

fs.mkdirSync(DATA_DIR, { recursive: true });

const read = (f) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return []; } };
const write = (f, d) => fs.writeFileSync(f, JSON.stringify(d, null, 2));
const id = () => `${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;

// Seed reviews with the genuine Google reviews on first run.
const SEED_REVIEWS = [
  { name: 'Adam Dayma', role: 'Google Review · 2 months ago', rating: 5, text: 'This CA firm is exceptional in handling income tax, GST, matters. ITR filing was completed smoothly without any confusion. Very professional approach. Their GST return filing process is smooth and always on time. We never have to worry about deadlines anymore. Timely reminders and proper documentation support make GST filing stress-free.' },
  { name: 'Shailesh Jogani', role: 'Google Review · 2 months ago', rating: 5, text: 'This CA firm is exceptional in handling income tax, GST, matters. They provide accurate advice, ensure timely compliance, and are always available to answer questions. Their professionalism and dedication to client satisfaction are commendable. A great choice for anyone needing comprehensive financial services.' },
  { name: 'Jay Bhanderi', role: 'Google Review · 3 months ago', rating: 5, text: 'This chartered accountancy firm demonstrates exceptional proficiency in managing income tax, Goods and Services Tax (GST), and Real Estate (Regulation and Development) Act (RERA) matters. They consistently deliver precise counsel, ensure adherence to regulatory timelines, and maintain continuous accessibility for client inquiries.' },
  { name: 'Hareshbhai Dhami', role: 'Google Review · 2 months ago', rating: 5, text: "Whether it's filing income tax returns, managing GST compliance, or handling RERA requirements, this firm excels in every aspect. Their team is highly responsive and ensures everything is handled seamlessly. They've made complex processes easy for me, and I couldn't be happier with their services." },
  { name: 'Harsh Nagar', role: 'Google Review · 3 months ago', rating: 5, text: 'Excellent CA firm with a highly professional and responsive team. They provide clear guidance on tax, GST, audits, and financial matters. Their attention to detail, transparency, and timely service make the entire process smooth and stress-free. Highly recommended for reliable and expert accounting support.' },
  { name: 'Rasul Dayma', role: 'Google Review · a year ago', rating: 5, text: 'This CA firm consistently exceeded expectations with their professionalism, thoroughness, and dedication to understanding our business needs. They provided clear, timely advice on complex financial matters, always going the extra mile to ensure we were well-informed and compliant. Highly Recommended firm.' },
  { name: 'Siddharth Savaliya', role: 'Google Review · a year ago', rating: 5, text: "This firm is a one-stop solution for all tax and regulatory needs. From income tax filing to GST compliance and RERA registrations, they handle everything with utmost professionalism. The team is knowledgeable, approachable, and ensures timely submissions. I'm impressed with their attention to detail and proactive approach." },
  { name: 'Vatsal Shingala', role: 'Google Review · a year ago', rating: 5, text: 'Working with V J Desai & Co., Chartered Accountants, has greatly improved our business over the last three years. Their expertise in Income Tax, GST, and TDS filings has made managing our financial obligations much easier. The knowledgeable team keeps up with changing regulations, helping us remain compliant.' },
  { name: 'Adnan Shaikh', role: 'Google Review · 2 months ago', rating: 5, text: 'This CA firm is exceptional in handling income tax, GST, matters. ITR filing was completed smoothly without any confusion. Very professional approach. Their GST return filing process is smooth and always on time. We never have to worry about deadlines anymore.' },
];
if (!fs.existsSync(REV_FILE)) write(REV_FILE, SEED_REVIEWS.map((r) => ({ id: id(), date: new Date().toISOString(), ...r })));

const requireAdmin = (req, res, next) => {
  const key = req.get('x-admin-key') || req.body?.adminKey;
  if (key !== ADMIN_KEY) return res.status(401).json({ success: false, message: 'Unauthorized — invalid admin key.' });
  next();
};

// Called by the contact handler to persist a submission.
export function saveEnquiry(rec) {
  const list = read(ENQ_FILE);
  list.unshift({ id: id(), date: new Date().toISOString(), ...rec });
  write(ENQ_FILE, list);
}

export default function mountAdmin(app) {
  const r = express.Router();

  r.post('/admin/login', (req, res) => {
    const key = req.get('x-admin-key') || req.body?.adminKey;
    if (key !== ADMIN_KEY) return res.status(401).json({ success: false, message: 'Invalid admin key.' });
    res.json({ success: true });
  });

  // Enquiries
  r.get('/admin/enquiries', requireAdmin, (_req, res) => res.json({ success: true, enquiries: read(ENQ_FILE) }));
  r.delete('/admin/enquiries/:id', requireAdmin, (req, res) => {
    const list = read(ENQ_FILE).filter((e) => e.id !== req.params.id);
    write(ENQ_FILE, list);
    res.json({ success: true });
  });

  // Reviews
  r.get('/reviews', (_req, res) => res.json({ success: true, reviews: read(REV_FILE) }));
  r.post('/reviews', requireAdmin, (req, res) => {
    const b = req.body || {};
    if (!(b.name || '').trim() || !(b.text || '').trim()) return res.status(422).json({ success: false, message: 'Name and review text are required.' });
    const review = { id: id(), date: new Date().toISOString(), name: b.name.trim(), role: (b.role || 'Google Review').trim(), rating: Number(b.rating) || 5, text: b.text.trim() };
    const list = read(REV_FILE); list.unshift(review); write(REV_FILE, list);
    res.json({ success: true, review });
  });
  r.put('/reviews/:id', requireAdmin, (req, res) => {
    const b = req.body || {};
    const list = read(REV_FILE);
    const i = list.findIndex((x) => x.id === req.params.id);
    if (i === -1) return res.status(404).json({ success: false, message: 'Not found.' });
    list[i] = { ...list[i], name: (b.name ?? list[i].name).trim(), role: (b.role ?? list[i].role).trim(), rating: Number(b.rating) || list[i].rating, text: (b.text ?? list[i].text).trim() };
    write(REV_FILE, list);
    res.json({ success: true, review: list[i] });
  });
  r.delete('/reviews/:id', requireAdmin, (req, res) => {
    write(REV_FILE, read(REV_FILE).filter((x) => x.id !== req.params.id));
    res.json({ success: true });
  });

  app.use('/api', r);
}
