import { useState } from 'react';
import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+()\d][\d\s\-().]{6,}$/;
const MIN_MESSAGE = 20;

const INITIAL = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  entityType: '',
  serviceEnquiry: '',
  message: '',
  contactMode: '',
};

function Spinner() {
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-block',
        width: 14,
        height: 14,
        marginRight: 8,
        border: '2px solid rgba(255,255,255,.4)',
        borderTopColor: '#fff',
        borderRadius: '50%',
        animation: 'cf-spin .7s linear infinite',
        verticalAlign: '-2px',
      }}
    />
  );
}

export default function ContactForm() {
  const [formData, setFormData] = useState(INITIAL);
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState('idle');
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  function validate(d) {
    const e = {};
    if (!d.firstName.trim()) e.firstName = 'First name is required.';
    if (!d.lastName.trim()) e.lastName = 'Last name is required.';
    if (!d.email.trim()) e.email = 'Email is required.';
    else if (!EMAIL_RE.test(d.email)) e.email = 'Enter a valid email address.';
    if (!d.phone.trim()) e.phone = 'Phone number is required.';
    else if (!PHONE_RE.test(d.phone)) e.phone = 'Enter a valid phone number.';
    if (!d.serviceEnquiry.trim()) e.serviceEnquiry = 'Please select a service area.';
    if (!d.message.trim()) e.message = 'Please add a message.';
    else if (d.message.trim().length < MIN_MESSAGE) {
      e.message = `Message must be at least ${MIN_MESSAGE} characters.`;
    }
    return e;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFeedback('');

    if (honeypot) return;

    const v = validate(formData);
    setErrors(v);
    if (Object.keys(v).length) return;

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      setStatus('error');
      setFeedback('Form is not configured. Please email info@vjdesai.com directly.');
      return;
    }

    const templateParams = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      reply_to: formData.email,
      phone: formData.phone,
      company: formData.company || 'Not provided',
      entity_type: formData.entityType || 'Not specified',
      service_enquiry: formData.serviceEnquiry,
      message: formData.message,
      contact_mode: formData.contactMode || 'Not specified',
      submission_date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    };

    setStatus('sending');
    console.log('[ContactForm] EmailJS config', {
      serviceId: SERVICE_ID,
      templateId: TEMPLATE_ID,
      publicKey: PUBLIC_KEY,
    });
    console.log('[ContactForm] templateParams →', templateParams);

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, { publicKey: PUBLIC_KEY });
      setStatus('success');
      setFeedback("Thank you! We'll be in touch soon.");
      setFormData(INITIAL);
    } catch (err) {
      console.error('[ContactForm] EmailJS error', err);
      setStatus('error');
      setFeedback('Something went wrong. Please try again.');
    }
  }

  const sending = status === 'sending';

  return (
    <div className="cf-wrap">
      <style>{`@keyframes cf-spin{to{transform:rotate(360deg)}}`}</style>

      <form className="cf-form" onSubmit={handleSubmit} noValidate>
        {/* Honeypot: bots fill this, humans don't */}
        <input
          type="text"
          name="_honey"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          style={{ display: 'none' }}
        />

        <div className="cf-row">
          <label className="cf-field">
            <span className="cf-label">First Name <em>*</em></span>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              autoComplete="given-name"
              placeholder="Rajesh"
              required
              disabled={sending}
              aria-invalid={!!errors.firstName}
            />
            {errors.firstName && <span className="cf-err">{errors.firstName}</span>}
          </label>

          <label className="cf-field">
            <span className="cf-label">Last Name <em>*</em></span>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              autoComplete="family-name"
              placeholder="Mehta"
              required
              disabled={sending}
              aria-invalid={!!errors.lastName}
            />
            {errors.lastName && <span className="cf-err">{errors.lastName}</span>}
          </label>
        </div>

        <div className="cf-row">
          <label className="cf-field">
            <span className="cf-label">Email Address <em>*</em></span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              placeholder="you@company.com"
              required
              disabled={sending}
              aria-invalid={!!errors.email}
            />
            {errors.email && <span className="cf-err">{errors.email}</span>}
          </label>

          <label className="cf-field">
            <span className="cf-label">Phone Number <em>*</em></span>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              autoComplete="tel"
              placeholder="+91 98765 43210"
              inputMode="tel"
              required
              disabled={sending}
              aria-invalid={!!errors.phone}
            />
            {errors.phone && <span className="cf-err">{errors.phone}</span>}
          </label>
        </div>

        <div className="cf-row">
          <label className="cf-field">
            <span className="cf-label">Company / Organisation</span>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              autoComplete="organization"
              placeholder="Your Company Pvt. Ltd."
              disabled={sending}
            />
          </label>

          <label className="cf-field">
            <span className="cf-label">Entity Type</span>
            <select
              name="entityType"
              value={formData.entityType}
              onChange={handleChange}
              disabled={sending}
            >
              <option value="">Select entity type</option>
              <option>Private Limited Company</option>
              <option>LLP / Partnership Firm</option>
              <option>Proprietorship</option>
              <option>HUF</option>
              <option>Trust / NGO / Section 8</option>
              <option>Individual / Salaried</option>
              <option>NRI / Foreign Entity</option>
              <option>Real Estate Developer (RERA)</option>
            </select>
          </label>
        </div>

        <label className="cf-field">
          <span className="cf-label">Service Enquiry <em>*</em></span>
          <select
            name="serviceEnquiry"
            value={formData.serviceEnquiry}
            onChange={handleChange}
            required
            disabled={sending}
            aria-invalid={!!errors.serviceEnquiry}
          >
            <option value="">Select a service area</option>
            <optgroup label="GST / Indirect Tax">
              <option>GST Registration &amp; Compliance</option>
              <option>GST Audit</option>
              <option>GST Litigation &amp; Appeals</option>
              <option>GST Refund</option>
              <option>E-Way Bill / E-Invoice Consultancy</option>
            </optgroup>
            <optgroup label="Direct Tax">
              <option>Corporate Income Tax</option>
              <option>Income Tax Returns</option>
              <option>NRI Taxation &amp; DTAA</option>
              <option>TDS Compliance</option>
              <option>Capital Gains Advisory</option>
            </optgroup>
            <optgroup label="Audit &amp; Assurance">
              <option>Statutory Audit</option>
              <option>Tax Audit (3CD)</option>
              <option>Internal Audit</option>
            </optgroup>
            <optgroup label="Corporate &amp; Advisory">
              <option>Business Setup / Incorporation</option>
              <option>Business Valuation</option>
              <option>FEMA &amp; RBI Compliance</option>
              <option>CFO / Management Consultancy</option>
            </optgroup>
            <optgroup label="RERA">
              <option>RERA Project Registration</option>
              <option>RERA Quarterly Disclosure</option>
              <option>RERA Dispute Support</option>
            </optgroup>
            <option>Other / Not Sure</option>
          </select>
          {errors.serviceEnquiry && <span className="cf-err">{errors.serviceEnquiry}</span>}
        </label>

        <label className="cf-field">
          <span className="cf-label">How Can We Help You? <em>*</em></span>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={6}
            minLength={MIN_MESSAGE}
            required
            disabled={sending}
            aria-invalid={!!errors.message}
            placeholder="Briefly describe your requirement or the compliance matter you need help with. The more detail you share, the better prepared we can be for your first consultation."
          />
          {errors.message && <span className="cf-err">{errors.message}</span>}
        </label>

        <label className="cf-field">
          <span className="cf-label">Preferred Mode of Contact</span>
          <select
            name="contactMode"
            value={formData.contactMode}
            onChange={handleChange}
            disabled={sending}
          >
            <option value="">Select preference</option>
            <option>Phone Call</option>
            <option>Email</option>
            <option>WhatsApp</option>
            <option>In-Person Meeting at Office</option>
            <option>Video Call</option>
          </select>
        </label>

        <button type="submit" className="cf-submit" disabled={sending}>
          {sending && <Spinner />}
          {sending ? 'Sending…' : 'Submit Enquiry →'}
        </button>

        {feedback && (
          <div
            className={`cf-feedback ${status === 'success' ? 'is-success' : status === 'error' ? 'is-error' : ''}`}
            role="status"
            aria-live="polite"
          >
            {feedback}
          </div>
        )}
      </form>
    </div>
  );
}
