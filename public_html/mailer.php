<?php
/**
 * mailer.php — Consultation form handler for V J Desai & Co. LLP
 *
 * Receives the contact form POST, validates it, and delivers the enquiry
 * over authenticated SMTP. No external library or Composer required.
 *
 * ─────────────────────────────────────────────────────────────────────────
 *  SETUP: fill in the SMTP password below, then upload this file to the
 *  site root (same level as index.html). The contact form falls back to this
 *  handler when /api/contact is not available.
 * ─────────────────────────────────────────────────────────────────────────
 */

/* ===== SMTP CONFIGURATION — EDIT THESE ===================================== */
$SMTP_HOST   = 'smtp.office365.com';   // Office 365 SMTP submission endpoint
$SMTP_PORT   = 587;                    // 587 = STARTTLS
$SMTP_SECURE = 'tls';                  // 'tls' for port 587, 'ssl' for port 465
$SMTP_USER   = 'info@vjdesai.com';     // full mailbox login
$SMTP_PASS   = 'CHANGE_ME';            // mailbox password / app password — DO NOT commit the real one to git

$FROM_EMAIL  = 'info@vjdesai.com';     // must match (or be allowed by) the SMTP account above
$FROM_NAME   = 'V J Desai & Co. website';
$TO_EMAIL    = 'info@vjdesai.com';     // where enquiries are delivered
/* ========================================================================== */

header('Content-Type: application/json; charset=utf-8');

// Allow same-origin AJAX (and a normal POST as fallback)
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

// Honeypot — bots fill the hidden _honey field; real visitors never see it.
if (!empty($_POST['_honey'])) {
    echo json_encode(['success' => true]); // pretend success, drop silently
    exit;
}

/* ---- Collect & sanitise fields ------------------------------------------- */
function field($key) {
    return isset($_POST[$key]) ? trim((string) $_POST[$key]) : '';
}

$firstName = field('First Name');
$lastName  = field('Last Name');
$email     = field('email');
$phone     = field('Phone');
$company   = field('Company');
$entity    = field('Entity Type');
$service   = field('Service Enquiry');
$message   = field('Message');
$mode      = field('Preferred Mode of Contact');

// Required fields
if ($firstName === '' || $lastName === '' || $email === '' || $phone === '' || $service === '' || $message === '') {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Please fill in all required fields.']);
    exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
    exit;
}

/* ---- Build the email body ------------------------------------------------ */
$rows = [
    'First Name'                => $firstName,
    'Last Name'                 => $lastName,
    'Email Address'             => $email,
    'Phone Number'              => $phone,
    'Company / Organisation'    => $company,
    'Entity Type'               => $entity,
    'Service Enquiry'           => $service,
    'Preferred Mode of Contact' => $mode,
    'Message'                   => $message,
];

$tableRows = '';
foreach ($rows as $label => $value) {
    if ($value === '') $value = '—';
    $tableRows .= '<tr>'
        . '<td style="padding:8px 12px;border:1px solid #e2e8f0;background:#f8f9fa;font-weight:600;color:#374151;white-space:nowrap;vertical-align:top">'
        . htmlspecialchars($label, ENT_QUOTES, 'UTF-8') . '</td>'
        . '<td style="padding:8px 12px;border:1px solid #e2e8f0;color:#1a202c">'
        . nl2br(htmlspecialchars($value, ENT_QUOTES, 'UTF-8')) . '</td>'
        . '</tr>';
}

$subject = 'New Consultation Enquiry — V J Desai & Co. website';
$htmlBody = '<div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto">'
    . '<h2 style="color:#1C2437;border-bottom:3px solid #C9A84C;padding-bottom:8px">New Consultation Enquiry</h2>'
    . '<table style="border-collapse:collapse;width:100%;font-size:14px">' . $tableRows . '</table>'
    . '<p style="color:#6B7280;font-size:12px;margin-top:16px">Submitted via the contact form on vjdesai.com</p>'
    . '</div>';

/* ---- Send over SMTP ------------------------------------------------------ */
$result = smtp_send(
    $SMTP_HOST, $SMTP_PORT, $SMTP_SECURE, $SMTP_USER, $SMTP_PASS,
    $FROM_EMAIL, $FROM_NAME, $TO_EMAIL, $email, $firstName . ' ' . $lastName,
    $subject, $htmlBody
);

if ($result === true) {
    echo json_encode(['success' => true, 'message' => 'Enquiry sent successfully.']);
} else {
    http_response_code(502);
    error_log('mailer.php SMTP error: ' . $result);
    echo json_encode(['success' => false, 'message' => 'Could not send your enquiry. Please email info@vjdesai.com directly.']);
}

/* ========================================================================== */
/*  Minimal authenticated SMTP client (AUTH LOGIN, SSL/STARTTLS)              */
/* ========================================================================== */
function smtp_send($host, $port, $secure, $user, $pass,
                   $fromEmail, $fromName, $to, $replyTo, $replyName,
                   $subject, $htmlBody) {

    $secure = strtolower($secure);
    $transport = ($secure === 'ssl') ? "ssl://$host" : $host;

    $fp = @stream_socket_client(
        "$transport:$port", $errno, $errstr, 20,
        STREAM_CLIENT_CONNECT,
        stream_context_create(['ssl' => ['verify_peer' => true, 'verify_peer_name' => true]])
    );
    if (!$fp) return "connect failed: $errstr ($errno)";

    stream_set_timeout($fp, 20);

    $expect = function ($codes) use ($fp) {
        $codes = (array) $codes;
        $data = '';
        // Read full multi-line reply (lines with "250-" continue, "250 " ends)
        while (($line = fgets($fp, 515)) !== false) {
            $data .= $line;
            if (isset($line[3]) && $line[3] === ' ') break;
        }
        $code = (int) substr($data, 0, 3);
        if (!in_array($code, $codes, true)) {
            return [false, trim($data)];
        }
        return [true, trim($data)];
    };
    $cmd = function ($line) use ($fp) {
        fwrite($fp, $line . "\r\n");
    };

    // Greeting
    list($ok, $err) = $expect(220);
    if (!$ok) { fclose($fp); return "no greeting: $err"; }

    $ehlo = (gethostname() ?: 'localhost');
    $cmd("EHLO $ehlo");
    list($ok, $err) = $expect(250);
    if (!$ok) { fclose($fp); return "EHLO rejected: $err"; }

    // STARTTLS upgrade for port 587
    if ($secure === 'tls') {
        $cmd('STARTTLS');
        list($ok, $err) = $expect(220);
        if (!$ok) { fclose($fp); return "STARTTLS rejected: $err"; }
        if (!stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
            fclose($fp); return 'TLS negotiation failed';
        }
        $cmd("EHLO $ehlo");
        list($ok, $err) = $expect(250);
        if (!$ok) { fclose($fp); return "EHLO after TLS rejected: $err"; }
    }

    // AUTH LOGIN
    $cmd('AUTH LOGIN');
    list($ok, $err) = $expect(334);
    if (!$ok) { fclose($fp); return "AUTH not accepted: $err"; }
    $cmd(base64_encode($user));
    list($ok, $err) = $expect(334);
    if (!$ok) { fclose($fp); return "username rejected: $err"; }
    $cmd(base64_encode($pass));
    list($ok, $err) = $expect(235);
    if (!$ok) { fclose($fp); return "authentication failed: $err"; }

    // Envelope
    $cmd("MAIL FROM:<$fromEmail>");
    list($ok, $err) = $expect(250);
    if (!$ok) { fclose($fp); return "MAIL FROM rejected: $err"; }
    $cmd("RCPT TO:<$to>");
    list($ok, $err) = $expect([250, 251]);
    if (!$ok) { fclose($fp); return "RCPT TO rejected: $err"; }
    $cmd('DATA');
    list($ok, $err) = $expect(354);
    if (!$ok) { fclose($fp); return "DATA rejected: $err"; }

    // Headers + body
    $boundary = '=_' . md5(uniqid((string) mt_rand(), true));
    $date = date('r');
    $encFromName = '=?UTF-8?B?' . base64_encode($fromName) . '?=';
    $encReplyName = '=?UTF-8?B?' . base64_encode($replyName) . '?=';
    $encSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

    $headers = [
        "Date: $date",
        "From: $encFromName <$fromEmail>",
        "To: <$to>",
        "Reply-To: $encReplyName <$replyTo>",
        "Subject: $encSubject",
        'MIME-Version: 1.0',
        "Content-Type: text/html; charset=UTF-8",
        'Content-Transfer-Encoding: base64',
    ];

    $body = rtrim(chunk_split(base64_encode($htmlBody)));

    // Dot-stuffing: any line beginning with "." must be doubled.
    $message = implode("\r\n", $headers) . "\r\n\r\n" . $body . "\r\n";
    $message = preg_replace('/^\./m', '..', $message);

    fwrite($fp, $message);
    $cmd('.');
    list($ok, $err) = $expect(250);
    if (!$ok) { fclose($fp); return "message not accepted: $err"; }

    $cmd('QUIT');
    fclose($fp);
    return true;
}
