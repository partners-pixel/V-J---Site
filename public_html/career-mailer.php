<?php
/**
 * career-mailer.php — Career application handler for V J Desai & Co. LLP
 *
 * Receives the career form POST (fields + CV file), then emails the
 * application to info@vjdesai.com with the resume attached as a real
 * MIME attachment (original filename + format preserved).
 *
 * Uses PHP's built-in mail() — no SMTP credentials embedded, no third-party
 * service gating. Hostinger Business hosting has mail() pre-configured.
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
const TO_EMAIL    = 'info@vjdesai.com';
const FROM_EMAIL  = 'info@vjdesai.com';
const FROM_NAME   = 'V J Desai & Co. Career Form';
const MAX_BYTES   = 6 * 1024 * 1024;   // 6 MB, slightly above the client cap
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
/*  EMAIL BODY (HTML)                                                 */
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

/* ------------------------------------------------------------------ */
/*  MIME EMAIL                                                        */
/* ------------------------------------------------------------------ */
$subject = 'New Application: ' . $position . ' — ' . $fullName;
$encSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
$encFromName = '=?UTF-8?B?' . base64_encode(FROM_NAME) . '?=';
$encReplyName = '=?UTF-8?B?' . base64_encode($fullName) . '?=';

$mixedBoundary = 'mixed_' . md5(uniqid((string) mt_rand(), true));
$altBoundary   = 'alt_'   . md5(uniqid((string) mt_rand(), true));

$headers = [
    'From: ' . $encFromName . ' <' . FROM_EMAIL . '>',
    'Reply-To: ' . $encReplyName . ' <' . $email . '>',
    'MIME-Version: 1.0',
    'Content-Type: multipart/mixed; boundary="' . $mixedBoundary . '"',
    'X-Mailer: vjdesai-career-mailer',
];

$bodyParts = [];

// 1) The HTML alternative wrapper
$bodyParts[] = '--' . $mixedBoundary;
$bodyParts[] = 'Content-Type: multipart/alternative; boundary="' . $altBoundary . '"';
$bodyParts[] = '';

$bodyParts[] = '--' . $altBoundary;
$bodyParts[] = 'Content-Type: text/plain; charset=UTF-8';
$bodyParts[] = 'Content-Transfer-Encoding: 7bit';
$bodyParts[] = '';
$plain = "New Career Application\n\n";
foreach ($rows as $l => $v) $plain .= $l . ': ' . $v . "\n";
$bodyParts[] = $plain;
$bodyParts[] = '';

$bodyParts[] = '--' . $altBoundary;
$bodyParts[] = 'Content-Type: text/html; charset=UTF-8';
$bodyParts[] = 'Content-Transfer-Encoding: base64';
$bodyParts[] = '';
$bodyParts[] = chunk_split(base64_encode($htmlBody));

$bodyParts[] = '--' . $altBoundary . '--';
$bodyParts[] = '';

// 2) Attachment (if present)
if ($attachedOk && $cvBytes !== null) {
    $bodyParts[] = '--' . $mixedBoundary;
    $bodyParts[] = 'Content-Type: ' . $cvMime . '; name="' . $cvName . '"';
    $bodyParts[] = 'Content-Transfer-Encoding: base64';
    $bodyParts[] = 'Content-Disposition: attachment; filename="' . $cvName . '"';
    $bodyParts[] = '';
    $bodyParts[] = chunk_split(base64_encode($cvBytes));
}

$bodyParts[] = '--' . $mixedBoundary . '--';

$rawBody = implode("\r\n", $bodyParts);

/* ------------------------------------------------------------------ */
/*  SEND                                                              */
/* ------------------------------------------------------------------ */
$ok = @mail(TO_EMAIL, $encSubject, $rawBody, implode("\r\n", $headers));

if ($ok) {
    echo json_encode(['ok' => true, 'attached' => $attachedOk]);
} else {
    $err = error_get_last();
    error_log('career-mailer mail() failed: ' . ($err['message'] ?? 'unknown'));
    fail(502, 'Could not send your application. Please email info@vjdesai.com directly.');
}
