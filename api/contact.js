import nodemailer from 'nodemailer';

const {
  SMTP_HOST = 'smtp.office365.com',
  SMTP_PORT = '587',
  SMTP_SECURE = 'false',
  SMTP_USER = 'info@vjdesai.com',
  SMTP_PASS,
  FROM_EMAIL = 'info@vjdesai.com',
  FROM_NAME = 'V J Desai & Co. website',
  TO_EMAIL = 'info@vjdesai.com',
} = process.env;

const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    return Object.fromEntries(new URLSearchParams(req.body));
  }

  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return {};

  const contentType = String(req.headers['content-type'] || '');
  if (contentType.includes('application/json')) {
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }

  return Object.fromEntries(new URLSearchParams(raw));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return json(res, 405, { success: false, message: 'Method not allowed.' });
  }

  const b = await readBody(req);
  if (b._honey) return json(res, 200, { success: true });

  const get = (k) => (b[k] ?? '').toString().trim();
  const firstName = get('First Name');
  const lastName = get('Last Name');
  const email = get('email');
  const phone = get('Phone');
  const service = get('Service Enquiry');
  const message = get('Message');

  if (!firstName || !lastName || !email || !phone || !service || !message) {
    return json(res, 422, { success: false, message: 'Please fill in all required fields.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(res, 422, { success: false, message: 'Please enter a valid email address.' });
  }
  if (!SMTP_PASS) {
    return json(res, 500, { success: false, message: 'Email service is not configured.' });
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
       <td style="padding:8px 12px;border:1px solid #e2e8f0;color:#1a202c">${esc(value || '-').replace(/\n/g, '<br>')}</td>
     </tr>`).join('');

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto">
      <h2 style="color:#1C2437;border-bottom:3px solid #C9A84C;padding-bottom:8px">New Consultation Enquiry</h2>
      <table style="border-collapse:collapse;width:100%;font-size:14px">${tableRows}</table>
      <p style="color:#6B7280;font-size:12px;margin-top:16px">Submitted via the contact form on vjdesai.com</p>
    </div>`;

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: String(SMTP_SECURE) === 'true',
    requireTLS: String(SMTP_PORT) === '587',
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  try {
    await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: TO_EMAIL,
      replyTo: `"${firstName} ${lastName}" <${email}>`,
      subject: 'New Consultation Enquiry - V J Desai & Co. website',
      html,
    });
    return json(res, 200, { success: true, message: 'Enquiry sent successfully.' });
  } catch (err) {
    console.error('SMTP send failed:', {
      code: err.code,
      command: err.command,
      responseCode: err.responseCode,
      message: err.message,
    });
    return json(res, 502, {
      success: false,
      message: 'Could not send your enquiry. Please email info@vjdesai.com directly.',
    });
  }
}
