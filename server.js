/**
 * server.js — V J Desai & Co. LLP
 *
 * Serves the static site and handles the consultation form over
 * authenticated SMTP using nodemailer.
 *
 *   1.  npm install
 *   2.  copy .env.example -> .env  and fill in the SMTP credentials
 *   3.  npm start   (or: npm run dev  for auto-reload)
 *
 * The contact form posts to  POST /api/contact
 */

import 'dotenv/config';
import express from 'express';
import nodemailer from 'nodemailer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const {
  SMTP_HOST,
  SMTP_PORT = '465',
  SMTP_SECURE = 'true',
  SMTP_USER,
  SMTP_PASS,
  FROM_EMAIL = SMTP_USER,
  FROM_NAME = 'V J Desai & Co. website',
  TO_EMAIL = SMTP_USER,
  PORT = '3000',
} = process.env;

const smtpConfigured = Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);

if (!smtpConfigured) {
  console.warn('⚠️  SMTP_HOST / SMTP_USER / SMTP_PASS are not set. ' +
    'Running in DEV MODE: enquiries will be logged to the console instead ' +
    'of emailed. Copy .env.example to .env and fill them in to send real email.');
}

// Reusable SMTP transport
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: String(SMTP_SECURE) === 'true', // true for 465 (SSL), false for 587 (STARTTLS)
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

const app = express();
app.use(express.urlencoded({ extended: true })); // form-encoded bodies (FormData)
app.use(express.json());

const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

app.post('/api/contact', async (req, res) => {
  const b = req.body || {};

  // Honeypot — bots fill the hidden _honey field; humans never see it.
  if (b._honey) return res.json({ success: true });

  const get = (k) => (b[k] ?? '').toString().trim();
  const firstName = get('First Name');
  const lastName  = get('Last Name');
  const email     = get('email');
  const phone     = get('Phone');
  const service   = get('Service Enquiry');
  const message   = get('Message');

  // Required fields
  if (!firstName || !lastName || !email || !phone || !service || !message) {
    return res.status(422).json({ success: false, message: 'Please fill in all required fields.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(422).json({ success: false, message: 'Please enter a valid email address.' });
  }

  const rows = {
    'First Name': firstName,
    'Last Name': lastName,
    'Email Address': email,
    'Phone Number': phone,
    'Company / Organisation': get('Company'),
    'Entity Type': get('Entity Type'),
    'Service Enquiry': service,
    'Preferred Mode of Contact': get('Preferred Mode of Contact'),
    'Message': message,
  };

  const tableRows = Object.entries(rows).map(([label, value]) =>
    `<tr>
       <td style="padding:8px 12px;border:1px solid #e2e8f0;background:#f8f9fa;font-weight:600;color:#374151;white-space:nowrap;vertical-align:top">${esc(label)}</td>
       <td style="padding:8px 12px;border:1px solid #e2e8f0;color:#1a202c">${esc(value || '—').replace(/\n/g, '<br>')}</td>
     </tr>`).join('');

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto">
      <h2 style="color:#1C2437;border-bottom:3px solid #C9A84C;padding-bottom:8px">New Consultation Enquiry</h2>
      <table style="border-collapse:collapse;width:100%;font-size:14px">${tableRows}</table>
      <p style="color:#6B7280;font-size:12px;margin-top:16px">Submitted via the contact form on vjdesai.com</p>
    </div>`;

  // DEV fallback — no SMTP configured: log the enquiry and report success so
  // the form is testable locally without mail credentials. (No email is sent.)
  if (!smtpConfigured) {
    console.log('\n📩  New enquiry (DEV MODE — not emailed):');
    console.table(rows);
    return res.json({ success: true, message: 'Enquiry received (dev mode — email not sent).' });
  }

  try {
    await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: TO_EMAIL,
      replyTo: `"${firstName} ${lastName}" <${email}>`,
      subject: 'New Consultation Enquiry — V J Desai & Co. website',
      html,
    });
    res.json({ success: true, message: 'Enquiry sent successfully.' });
  } catch (err) {
    console.error('SMTP send failed:', err.message);
    res.status(502).json({
      success: false,
      message: 'Could not send your enquiry. Please email info@vjdesai.com directly.',
    });
  }
});

// Serve the static site (index.html, pages/, assets/, components/ …)
app.use(express.static(__dirname));

app.listen(Number(PORT), () => {
  console.log(`▶  V J Desai site running at http://localhost:${PORT}`);
});
