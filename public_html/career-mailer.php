<?php
/**
 * career-mailer.php — Career application handler for V J Desai & Co. LLP
 *
 * Receives the career form POST (fields + CV file), then emails the
 * application to info@vjdesai.com via authenticated SMTP (Office 365)
 * with the resume attached as a real MIME attachment.
 *
 * Authenticated SMTP is used instead of PHP's mail() because mail() from
 * the Hostinger server is not authorised by SPF for vjdesai.com, so messages
 * land in junk/spam or never arrive at all. Office 365 SMTP delivers from
 * the mailbox's authoritative server and shows up cleanly in the inbox.
 *
 * Endpoint:  POST  /career-mailer.php
 * Body:      multipart/form-data with:
 *              - fullName, email, phone, position, coverNote
 *              - cv          (the file)
 *              - cv_link     (optional fallback Uploadcare URL)
 * Response:  JSON { ok: bool, message?: string, attached?: bool }
 */

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

/* ------------------------------------------------------------------ */
/*  CONFIG                                                            */
/* ------------------------------------------------------------------ */
const SMTP_HOST   = 'smtp.office365.com';
const SMTP_PORT   = 587;
const SMTP_USER   = 'info@vjdesai.com';
const SMTP_PASS   = 'NINE@0909';             // mailbox / app password
const TO_EMAIL    = 'info@vjdesai.com';
const FROM_EMAIL  = 'info@vjdesai.com';
const FROM_NAME   = 'V J Desai & Co. Career Form';
const MAX_BYTES   = 6 * 1024 * 1024;
const ALLOWED_EXT = ['pdf', 'doc', 'docx'];

/* ------------------------------------------------------------------ */
/*  HELPERS                                                           */
/* ------------------------------------------------------------------ */
function fail($code, $message) {
    http_response_code($code);
    echo json_encode(['ok' => false, 'message' => $message]);
    exit;
}
function field($key) {
    return isset($_POST[$key]) ? trim((string) $_POST[$key]) : '';
}
function html_escape($s) {
    return htmlspecialchars((string) $s, ENT_QUOTES, 'UTF-8');
}

/* ------------------------------------------------------------------ */
/*  REQUEST                                                           */
/* ------------------------------------------------------------------ */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    fail(405, 'Method not allowed.');
}

$fullName  = field('fullName');
$email     = field('email');
$phone     = field('phone');
$position  = field('position');
$coverNote = field('coverNote');
$cvLink    = field('cv_link');

if ($fullName === '' || $email === '' || $phone === '' || $position === '') {
    fail(422, 'Please fill in all required fields.');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    fail(422, 'Please enter a valid email address.');
}

/* ------------------------------------------------------------------ */
/*  FILE                                                              */
/* ------------------------------------------------------------------ */
$attachedOk = false;
$cvBytes = null;
$cvName  = '';
$cvMime  = 'application/octet-stream';

if (isset($_FILES['cv']) && $_FILES['cv']['error'] === UPLOAD_ERR_OK) {
    $tmp  = $_FILES['cv']['tmp_name'];
    $size = (int) $_FILES['cv']['size'];
    $name = basename($_FILES['cv']['name']);
    $ext  = strtolower(pathinfo($name, PATHINFO_EXTENSION));

    if ($size <= 0 || $size > MAX_BYTES) {
        fail(413, 'File is empty or larger than 6 MB.');
    }
    if (!in_array($ext, ALLOWED_EXT, true)) {
        fail(415, 'Only .pdf, .doc, or .docx files are allowed.');
    }
    $cvBytes = @file_get_contents($tmp);
    if ($cvBytes === false) {
        fail(500, 'Could not read uploaded file.');
    }
    $cvName = $name;
    if (function_exists('mime_content_type')) {
        $detected = @mime_content_type($tmp);
        if (is_string($detected) && $detected !== '') $cvMime = $detected;
    }
    if ($cvMime === 'application/octet-stream') {
        if ($ext === 'pdf')  $cvMime = 'application/pdf';
        if ($ext === 'doc')  $cvMime = 'application/msword';
        if ($ext === 'docx') $cvMime = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }
    $attachedOk = true;
}

/* ------------------------------------------------------------------ */
/*  EMAIL BODY                                                        */
/* ------------------------------------------------------------------ */
$timezone = new DateTimeZone('Asia/Kolkata');
$now      = new DateTime('now', $timezone);
$submittedAt = $now->format('l, j F Y \a\t g:i a');

$rows = [
    'Full Name'             => $fullName,
    'Email'                 => $email,
    'Phone'                 => $phone,
    'Position'              => $position,
    'Cover Note / Message'  => $coverNote !== '' ? $coverNote : 'No cover note provided.',
    'CV File Name'          => $cvName !== '' ? $cvName : '(no file attached)',
    'Submission Date'       => $submittedAt,
    'Source'                => 'vjdesai.com/career',
];
if ($cvLink !== '') {
    $rows['CV Download (backup link)'] = $cvLink;
}

$tableRows = '';
foreach ($rows as $label => $value) {
    $tableRows .= '<tr>'
        . '<td style="padding:8px 12px;border:1px solid #e2e8f0;background:#f8f9fa;font-weight:600;color:#374151;white-space:nowrap;vertical-align:top">'
        . html_escape($label) . '</td>'
        . '<td style="padding:8px 12px;border:1px solid #e2e8f0;color:#1a202c">'
        . nl2br(html_escape($value)) . '</td>'
        . '</tr>';
}

$htmlBody = '<div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto">'
    . '<h2 style="color:#1C2437;border-bottom:3px solid #C9A84C;padding-bottom:8px">New Career Application</h2>'
    . ($attachedOk
        ? '<p style="color:#1A5276;font-size:13px;margin:0 0 12px">📎 Resume is attached to this email (' . html_escape($cvName) . ')</p>'
        : '<p style="color:#9F2D2D;font-size:13px;margin:0 0 12px">⚠ No resume file was attached.' . ($cvLink !== '' ? ' Use the backup link below to download.' : '') . '</p>'
      )
    . '<table style="border-collapse:collapse;width:100%;font-size:14px">' . $tableRows . '</table>'
    . '<p style="color:#6B7280;font-size:12px;margin-top:16px">Submitted via the career form on vjdesai.com</p>'
    . '</div>';

$plain = "New Career Application\r\n\r\n";
foreach ($rows as $l => $v) $plain .= $l . ': ' . $v . "\r\n";

/* ------------------------------------------------------------------ */
/*  BUILD MIME MESSAGE                                                */
/* ------------------------------------------------------------------ */
$mixedBoundary = 'mixed_' . md5(uniqid((string) mt_rand(), true));
$altBoundary   = 'alt_'   . md5(uniqid((string) mt_rand(), true));

$encSubject   = '=?UTF-8?B?' . base64_encode('New Application: ' . $position . ' — ' . $fullName) . '?=';
$encFromName  = '=?UTF-8?B?' . base64_encode(FROM_NAME) . '?=';
$encReplyName = '=?UTF-8?B?' . base64_encode($fullName) . '?=';

$headerLines = [
    'Date: ' . date('r'),
    'From: ' . $encFromName . ' <' . FROM_EMAIL . '>',
    'To: <' . TO_EMAIL . '>',
    'Reply-To: ' . $encReplyName . ' <' . $email . '>',
    'Subject: ' . $encSubject,
    'MIME-Version: 1.0',
    'Content-Type: multipart/mixed; boundary="' . $mixedBoundary . '"',
    'X-Mailer: vjdesai-career-mailer',
];

$body = [];
$body[] = '';
// alt wrapper
$body[] = '--' . $mixedBoundary;
$body[] = 'Content-Type: multipart/alternative; boundary="' . $altBoundary . '"';
$body[] = '';
// text/plain
$body[] = '--' . $altBoundary;
$body[] = 'Content-Type: text/plain; charset=UTF-8';
$body[] = 'Content-Transfer-Encoding: 7bit';
$body[] = '';
$body[] = $plain;
// text/html
$body[] = '--' . $altBoundary;
$body[] = 'Content-Type: text/html; charset=UTF-8';
$body[] = 'Content-Transfer-Encoding: base64';
$body[] = '';
$body[] = chunk_split(base64_encode($htmlBody));
$body[] = '--' . $altBoundary . '--';
// attachment
if ($attachedOk && $cvBytes !== null) {
    $body[] = '--' . $mixedBoundary;
    $body[] = 'Content-Type: ' . $cvMime . '; name="' . $cvName . '"';
    $body[] = 'Content-Transfer-Encoding: base64';
    $body[] = 'Content-Disposition: attachment; filename="' . $cvName . '"';
    $body[] = '';
    $body[] = chunk_split(base64_encode($cvBytes));
}
$body[] = '--' . $mixedBoundary . '--';

$message = implode("\r\n", $headerLines) . "\r\n\r\n" . implode("\r\n", $body) . "\r\n";
// Dot-stuffing: SMTP DATA — any line starting with "." must be doubled.
$message = preg_replace('/^\./m', '..', $message);

/* ------------------------------------------------------------------ */
/*  SEND VIA AUTHENTICATED SMTP                                       */
/* ------------------------------------------------------------------ */
$smtpErr = smtp_send_raw(SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL, TO_EMAIL, $message);
if ($smtpErr === true) {
    echo json_encode(['ok' => true, 'attached' => $attachedOk]);
} else {
    error_log('career-mailer SMTP error: ' . $smtpErr);
    $debug = isset($_GET["debug"]) || isset($_POST["debug"]); fail(502, $debug ? ("SMTP: " . $smtpErr) : "Could not send your application. Please try again, or email info@vjdesai.com directly.");
}

/* ================================================================== */
/*  RAW SMTP (STARTTLS, AUTH LOGIN)                                   */
/* ================================================================== */
function smtp_send_raw($host, $port, $user, $pass, $from, $to, $dataBlob) {
    $fp = @stream_socket_client(
        "$host:$port", $errno, $errstr, 20,
        STREAM_CLIENT_CONNECT,
        stream_context_create(['ssl' => ['verify_peer' => true, 'verify_peer_name' => true]])
    );
    if (!$fp) return "connect failed: $errstr ($errno)";
    stream_set_timeout($fp, 30);

    $expect = function ($codes) use ($fp) {
        $codes = (array) $codes;
        $data = '';
        while (($line = fgets($fp, 1024)) !== false) {
            $data .= $line;
            if (isset($line[3]) && $line[3] === ' ') break;
        }
        $code = (int) substr($data, 0, 3);
        return [in_array($code, $codes, true), trim($data)];
    };
    $cmd = function ($line) use ($fp) { fwrite($fp, $line . "\r\n"); };

    list($ok, $err) = $expect(220);
    if (!$ok) { fclose($fp); return "no greeting: $err"; }

    $ehlo = gethostname() ?: 'localhost';
    $cmd("EHLO $ehlo");
    list($ok, $err) = $expect(250);
    if (!$ok) { fclose($fp); return "EHLO rejected: $err"; }

    $cmd('STARTTLS');
    list($ok, $err) = $expect(220);
    if (!$ok) { fclose($fp); return "STARTTLS rejected: $err"; }
    if (!stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
        fclose($fp);
        return 'TLS negotiation failed';
    }
    $cmd("EHLO $ehlo");
    list($ok, $err) = $expect(250);
    if (!$ok) { fclose($fp); return "EHLO after TLS rejected: $err"; }

    $cmd('AUTH LOGIN');
    list($ok, $err) = $expect(334);
    if (!$ok) { fclose($fp); return "AUTH not accepted: $err"; }
    $cmd(base64_encode($user));
    list($ok, $err) = $expect(334);
    if (!$ok) { fclose($fp); return "username rejected: $err"; }
    $cmd(base64_encode($pass));
    list($ok, $err) = $expect(235);
    if (!$ok) { fclose($fp); return "auth failed: $err"; }

    $cmd("MAIL FROM:<$from>");
    list($ok, $err) = $expect(250);
    if (!$ok) { fclose($fp); return "MAIL FROM rejected: $err"; }
    $cmd("RCPT TO:<$to>");
    list($ok, $err) = $expect([250, 251]);
    if (!$ok) { fclose($fp); return "RCPT TO rejected: $err"; }
    $cmd('DATA');
    list($ok, $err) = $expect(354);
    if (!$ok) { fclose($fp); return "DATA rejected: $err"; }

    fwrite($fp, $dataBlob);
    $cmd('.');
    list($ok, $err) = $expect(250);
    if (!$ok) { fclose($fp); return "message not accepted: $err"; }

    $cmd('QUIT');
    fclose($fp);
    return true;
}
