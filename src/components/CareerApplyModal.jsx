import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import emailjs from '@emailjs/browser';

const UPLOADCARE_KEY = import.meta.env.VITE_UPLOADCARE_PUBLIC_KEY;
const UPLOADCARE_ENDPOINT = 'https://upload.uploadcare.com/base/';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+()\d][\d\s\-().]{6,}$/;
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED_EXT = ['pdf', 'doc', 'docx'];
const ALLOWED_MIME = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const POSITIONS = [
  'CA Articleship Training',
  'Accounts Executive / Accountant',
  'Other',
];

const INITIAL = {
  fullName: '',
  email: '',
  phone: '',
  position: '',
  coverNote: '',
};

function formatBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

function fileExt(name) {
  return (name.split('.').pop() || '').toLowerCase();
}

// XHR-based upload so we can surface progress events. fetch() can't report
// upload progress in the browser.
function uploadToUploadcare(file, onProgress) {
  return new Promise((resolve, reject) => {
    const body = new FormData();
    body.append('file', file);
    body.append('UPLOADCARE_PUB_KEY', UPLOADCARE_KEY);
    body.append('UPLOADCARE_STORE', '1');

    const xhr = new XMLHttpRequest();
    xhr.open('POST', UPLOADCARE_ENDPOINT);
    xhr.responseType = 'json';

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && typeof onProgress === 'function') {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300 && xhr.response?.file) {
        resolve(xhr.response);
      } else {
        reject(new Error(
          `Uploadcare ${xhr.status}: ${typeof xhr.response === 'string' ? xhr.response : JSON.stringify(xhr.response)}`,
        ));
      }
    });
    xhr.addEventListener('error', () => reject(new Error('Network error during upload')));
    xhr.addEventListener('abort', () => reject(new Error('Upload aborted')));
    xhr.send(body);
  });
}

export default function CareerApplyModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState(INITIAL);
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [errors, setErrors] = useState({});
  // status: idle | uploading | sending | success | upload-error | email-error
  const [status, setStatus] = useState('idle');
  const [uploadPct, setUploadPct] = useState(0);
  const [feedback, setFeedback] = useState('');
  const fileInputRef = useRef(null);
  const firstFieldRef = useRef(null);

  const reset = useCallback(() => {
    setFormData(INITIAL);
    setFile(null);
    setFileError('');
    setErrors({});
    setStatus('idle');
    setUploadPct(0);
    setFeedback('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const closeAndMaybeReset = useCallback(() => {
    onClose?.();
    setTimeout(reset, 200);
  }, [onClose, reset]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') closeAndMaybeReset(); };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    setTimeout(() => firstFieldRef.current?.focus(), 0);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, closeAndMaybeReset]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleFile = (e) => {
    const f = e.target.files?.[0] || null;
    setFileError('');
    if (!f) { setFile(null); return; }
    const ext = fileExt(f.name);
    if (!ALLOWED_EXT.includes(ext) && !ALLOWED_MIME.includes(f.type)) {
      setFile(null);
      setFileError('Only .pdf, .doc, or .docx files are allowed.');
      e.target.value = '';
      return;
    }
    if (f.size > MAX_FILE_BYTES) {
      setFile(null);
      setFileError(`File is too large (${formatBytes(f.size)}). Maximum 5 MB.`);
      e.target.value = '';
      return;
    }
    setFile(f);
  };

  const validate = () => {
    const e = {};
    if (!formData.fullName.trim()) e.fullName = 'Full name is required.';
    if (!formData.email.trim()) e.email = 'Email is required.';
    else if (!EMAIL_RE.test(formData.email)) e.email = 'Enter a valid email address.';
    if (!formData.phone.trim()) e.phone = 'Phone number is required.';
    else if (!PHONE_RE.test(formData.phone)) e.phone = 'Enter a valid phone number.';
    if (!formData.position) e.position = 'Please select a position.';
    if (!file) e.file = 'Please attach your CV / Resume.';
    return e;
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setFeedback('');
    const v = validate();
    setErrors(v);
    if (v.file) setFileError(v.file);
    if (Object.keys(v).length) return;

    if (!UPLOADCARE_KEY) {
      setStatus('upload-error');
      setFeedback('Uploadcare is not configured. Please email your CV to info@vjdesai.com');
      return;
    }
    if (
      !import.meta.env.VITE_EMAILJS_SERVICE_ID ||
      !import.meta.env.VITE_EMAILJS_CAREER_TEMPLATE_ID ||
      !import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    ) {
      setStatus('email-error');
      setFeedback('Email service is not configured. Please email your CV to info@vjdesai.com');
      return;
    }

    // ── Stage 1: upload to Uploadcare ────────────────────────────
    let cvLink = '';
    let uploadUuid = '';
    try {
      setStatus('uploading');
      setUploadPct(0);
      const result = await uploadToUploadcare(file, setUploadPct);
      uploadUuid = result.file;
      cvLink = `https://ucarecdn.com/${uploadUuid}/`;
      console.log('[CareerApply] Uploadcare ok', { uuid: uploadUuid, cvLink });
    } catch (err) {
      console.error('[CareerApply] Uploadcare failed', err);
      setStatus('upload-error');
      setFeedback('CV upload failed. Please try again or email your CV directly to info@vjdesai.com');
      return;
    }

    // ── Stage 2: send EmailJS ────────────────────────────────────
    const templateParams = {
      full_name: formData.fullName,
      reply_to: formData.email,
      phone: formData.phone,
      position: formData.position,
      cover_note: formData.coverNote || 'No cover note provided.',
      cv_link: cvLink,
      cv_filename: file.name,
      submission_date: new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'full',
        timeStyle: 'short',
      }),
    };

    try {
      setStatus('sending');
      console.log('[CareerApply] EmailJS send →', templateParams);
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_CAREER_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      );
      // Only reaches here when BOTH Uploadcare upload AND EmailJS send succeed.
      setStatus('success');
      setFeedback('Application submitted successfully! We will contact you within 2 working days.');
      setFormData(INITIAL);
      setFile(null);
      setUploadPct(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error('[CareerApply] EmailJS failed', err);
      setStatus('email-error');
      // The CV did upload — give the candidate the link so they can quote it.
      setFeedback(
        `Your CV uploaded but the email notification failed. Please email info@vjdesai.com and quote this link: ${cvLink}`,
      );
    }
  }

  const busy = status === 'uploading' || status === 'sending';
  const submitLabel = (() => {
    if (status === 'uploading') return `Uploading CV… ${uploadPct}%`;
    if (status === 'sending') return 'Sending application…';
    return 'Submit Application →';
  })();

  return createPortal(
    <div
      className="cam-backdrop"
      onMouseDown={(e) => { if (e.target === e.currentTarget && !busy) closeAndMaybeReset(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cam-title"
    >
      <div className="cam-dialog" role="document">
        <header className="cam-head">
          <div>
            <div className="cam-eyebrow">✦ &nbsp;Apply to V J Desai &amp; Co. LLP</div>
            <h2 id="cam-title" className="cam-title">Send Us Your <em>CV / Resume</em></h2>
          </div>
          <button
            type="button"
            className="cam-close"
            onClick={closeAndMaybeReset}
            disabled={busy}
            aria-label="Close application form"
          >×</button>
        </header>

        <form className="cam-form" onSubmit={handleSubmit} noValidate>
          <div className="cam-row">
            <label className="cam-field">
              <span className="cam-label">Full Name <em>*</em></span>
              <input
                ref={firstFieldRef}
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                autoComplete="name"
                placeholder="Rajesh Mehta"
                required
                disabled={busy}
                aria-invalid={!!errors.fullName}
              />
              {errors.fullName && <span className="cam-err">{errors.fullName}</span>}
            </label>

            <label className="cam-field">
              <span className="cam-label">Email Address <em>*</em></span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                placeholder="you@example.com"
                required
                disabled={busy}
                aria-invalid={!!errors.email}
              />
              {errors.email && <span className="cam-err">{errors.email}</span>}
            </label>
          </div>

          <div className="cam-row">
            <label className="cam-field">
              <span className="cam-label">Phone Number <em>*</em></span>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                autoComplete="tel"
                placeholder="+91 98765 43210"
                inputMode="tel"
                required
                disabled={busy}
                aria-invalid={!!errors.phone}
              />
              {errors.phone && <span className="cam-err">{errors.phone}</span>}
            </label>

            <label className="cam-field">
              <span className="cam-label">Position Applying For <em>*</em></span>
              <select
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                disabled={busy}
                aria-invalid={!!errors.position}
              >
                <option value="">Select a position</option>
                {POSITIONS.map((p) => <option key={p}>{p}</option>)}
              </select>
              {errors.position && <span className="cam-err">{errors.position}</span>}
            </label>
          </div>

          <label className="cam-field">
            <span className="cam-label">Cover Note / Message</span>
            <textarea
              name="coverNote"
              value={formData.coverNote}
              onChange={handleChange}
              rows={4}
              disabled={busy}
              placeholder="Brief note about yourself, qualifications, or availability (optional)…"
            />
          </label>

          <div className="cam-field">
            <span className="cam-label">Upload CV / Resume <em>*</em></span>
            <div className={`cam-drop ${file ? 'has-file' : ''} ${fileError ? 'has-err' : ''}`}>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFile}
                disabled={busy}
              />
              <div className="cam-drop-body">
                {file ? (
                  <>
                    <div className="cam-drop-ico">📄</div>
                    <div>
                      <div className="cam-drop-name">{file.name}</div>
                      <div className="cam-drop-meta">{formatBytes(file.size)} · {fileExt(file.name).toUpperCase()}</div>
                    </div>
                    <button
                      type="button"
                      className="cam-drop-clear"
                      onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                      disabled={busy}
                      aria-label="Remove attached file"
                    >Remove</button>
                  </>
                ) : (
                  <>
                    <div className="cam-drop-ico">⬆</div>
                    <div>
                      <div className="cam-drop-name">Click to choose your CV</div>
                      <div className="cam-drop-meta">PDF, DOC, or DOCX · max 5 MB</div>
                    </div>
                  </>
                )}
              </div>
            </div>
            {fileError && <span className="cam-err">{fileError}</span>}
          </div>

          {status === 'uploading' && (
            <div className="cam-progress" aria-hidden="true">
              <div className="cam-progress-bar" style={{ width: `${uploadPct}%` }} />
            </div>
          )}

          <button type="submit" className="cam-submit" disabled={busy}>
            {busy && <span className="cam-spinner" aria-hidden="true" />}
            {submitLabel}
          </button>

          {feedback && (
            <div
              className={`cam-feedback ${status === 'success' ? 'is-success' : (status === 'upload-error' || status === 'email-error') ? 'is-error' : ''}`}
              role="status"
              aria-live="polite"
            >
              {feedback}
            </div>
          )}
        </form>
      </div>
    </div>,
    document.body,
  );
}
