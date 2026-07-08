<?php
/**
 * career-mailer.php — Career application handler (v2)
 *
 * Delivery strategy:
 *   1. Save the CV to /uploads/career/YYYY-MM/ on the vjdesai.com server
 *      with an unguessable filename. THIS IS THE PRIMARY DELIVERY.
 *   2. Send an email notification that features a large "Download Resume"
 *      button linking to that server-hosted file. The email ALSO tries to
 *      attach the file, but Hostinger's mail() → Office 365 pipeline is
 *      known to strip binary attachments in transit. The prominent
 *      download button ensures the recipient can always get the CV even
 *      if the attachment doesn't survive.
 *
 * Endpoint:  POST  /career-mailer.php
 * Body (multipart/form-data):
 *   fullName, email, phone, position, coverNote, cv (file), cv_link
 * Response:  JSON { ok, attached, saved, url?, message? }
 */

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

const TO_EMAIL    = 'info@vjdesai.com';
const TO_BCC      = 'partners@crownglobe.com';
const FROM_EMAIL  = 'noreply@vjdesai.com';
const FROM_NAME   = 'V J Desai & Co. Career Form';
const MAX_BYTES   = 6 * 1024 * 1024;
const ALLOWED_EXT = ['pdf', 'doc', 'docx'];
const STORAGE_REL      = 'uploads/career';
const STORAGE_URL_BASE = 'https://vjdesai.com/uploads/career';

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
function safe_basename($name) {
    $name = basename($name);
    $name = preg_replace('/[^A-Za-z0-9._\- ]+/u', '_', $name);
    if ($name === '' || $name === null) $name = 'cv.pdf';
    if (strlen($name) > 120) $name = substr($name, 0, 120);
    return $name;
}
function random_token($n = 12) {
    if (function_exists('random_bytes')) return bin2hex(random_bytes($n));
    return substr(md5(uniqid((string) mt_rand(), true)), 0, $n * 2);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail(405, 'Method not allowed.');

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

/* ---- Read uploaded CV ---- */
$attachedOk = false;
$cvBytes = null; $cvName = ''; $cvMime = 'application/octet-stream';
if (isset($_FILES['cv']) && $_FILES['cv']['error'] === UPLOAD_ERR_OK) {
    $tmp = $_FILES['cv']['tmp_name'];
    $size = (int) $_FILES['cv']['size'];
    $name = safe_basename($_FILES['cv']['name']);
    $ext  = strtolower(pathinfo($name, PATHINFO_EXTENSION));
    if ($size <= 0 || $size > MAX_BYTES) fail(413, 'File is empty or larger than 6 MB.');
    if (!in_array($ext, ALLOWED_EXT, true)) fail(415, 'Only .pdf, .doc, or .docx files are allowed.');
    $cvBytes = @file_get_contents($tmp);
    if ($cvBytes === false) fail(500, 'Could not read uploaded file.');
    $cvName = $name;
    if (function_exists('mime_content_type')) {
        $d = @mime_content_type($tmp);
        if (is_string($d) && $d !== '') $cvMime = $d;
    }
    if ($cvMime === 'application/octet-stream') {
        if ($ext === 'pdf')  $cvMime = 'application/pdf';
        if ($ext === 'doc')  $cvMime = 'application/msword';
        if ($ext === 'docx') $cvMime = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }
    $attachedOk = true;
}

/* ---- PRIMARY: save to server ---- */
$savedUrl = ''; $savedPath = '';
if ($attachedOk) {
    $month = date('Y-m');
    $dir = __DIR__ . '/' . STORAGE_REL . '/' . $month;
    if (!is_dir($dir)) @mkdir($dir, 0755, true);
    if (is_dir($dir) && is_writable($dir)) {
        $ts = date('Ymd-His');
        $token = random_token(8);
        $stored = $ts . '-' . $token . '-' . $cvName;
        $savedPath = $dir . '/' . $stored;
        if (@file_put_contents($savedPath, $cvBytes) !== false) {
            $savedUrl = STORAGE_URL_BASE . '/' . $month . '/' . rawurlencode($stored);
            $sidecar = $dir . '/' . $ts . '-' . $token . '-' . pathinfo($cvName, PATHINFO_FILENAME) . '.json';
            @file_put_contents($sidecar, json_encode([
                'fullName' => $fullName, 'email' => $email, 'phone' => $phone,
                'position' => $position, 'coverNote' => $coverNote, 'cv' => $stored,
                'submittedAt' => date('c'), 'ip' => $_SERVER['REMOTE_ADDR'] ?? '',
                'ua' => substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 200),
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
        }
    }
}

/* ---- Email content (HTML) ---- */
$timezone = new DateTimeZone('Asia/Kolkata');
$submittedAt = (new DateTime('now', $timezone))->format('l, j F Y \a\t g:i a');

$rows = [
    'Full Name'            => $fullName,
    'Email'                => $email,
    'Phone'                => $phone,
    'Position'             => $position,
    'Cover Note / Message' => $coverNote !== '' ? $coverNote : 'No cover note provided.',
    'CV File Name'         => $cvName !== '' ? $cvName : '(no file attached)',
    'Submission Date'      => $submittedAt,
    'Source'               => 'vjdesai.com/career',
];
$tableRows = '';
foreach ($rows as $label => $value) {
    $tableRows .= '<tr>'
        . '<td style="padding:8px 12px;border:1px solid #e2e8f0;background:#f8f9fa;font-weight:600;color:#374151;white-space:nowrap;vertical-align:top">'
        . html_escape($label) . '</td>'
        . '<td style="padding:8px 12px;border:1px solid #e2e8f0;color:#1a202c">'
        . nl2br(html_escape($value)) . '</td>'
        . '</tr>';
}

// PROMINENT download button — this is the primary way to get the CV.
$downloadBlock = '';
if ($savedUrl !== '') {
    $downloadBlock = '<div style="background:#F5F0E1;border:2px solid #C9A84C;border-radius:10px;padding:20px;margin:20px 0;text-align:center">'
        . '<p style="margin:0 0 12px;font-size:15px;color:#1C2437;font-weight:600">📄 Resume: ' . html_escape($cvName) . '</p>'
        . '<a href="' . html_escape($savedUrl) . '" '
        . 'style="display:inline-block;background:#1C2437;color:#ffffff;text-decoration:none;padding:14px 32px;'
        . 'border-radius:6px;font-size:16px;font-weight:700;letter-spacing:.02em">⬇ &nbsp;Download Resume</a>'
        . '<p style="margin:12px 0 0;font-size:12px;color:#6B7280">Or copy the link:<br>'
        . '<a href="' . html_escape($savedUrl) . '" style="color:#1A5276;word-break:break-all">' . html_escape($savedUrl) . '</a></p>'
        . '</div>';
}

$htmlBody = '<div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:20px">'
    . '<h2 style="color:#1C2437;border-bottom:3px solid #C9A84C;padding-bottom:8px;margin-top:0">New Career Application</h2>'
    . $downloadBlock
    . '<table style="border-collapse:collapse;width:100%;font-size:14px">' . $tableRows . '</table>'
    . '<p style="color:#6B7280;font-size:12px;margin-top:16px">Submitted via the career form on vjdesai.com. '
    . 'If a resume is expected but the download button is not visible above, check the sender permissions or the /uploads/career/ folder on the server.</p>'
    . '</div>';

$plain = "New Career Application\r\n\r\n";
if ($savedUrl !== '') $plain .= "📄 DOWNLOAD RESUME: " . $savedUrl . "\r\n\r\n";
foreach ($rows as $l => $v) $plain .= $l . ': ' . $v . "\r\n";

/* ---- Send via mail() with attachment (best-effort) ---- */
$encSubject   = '=?UTF-8?B?' . base64_encode('New Application: ' . $position . ' — ' . $fullName) . '?=';
$encFromName  = '=?UTF-8?B?' . base64_encode(FROM_NAME) . '?=';
$encReplyName = '=?UTF-8?B?' . base64_encode($fullName) . '?=';

$mixedBoundary = 'mixed_' . md5(uniqid((string) mt_rand(), true));
$altBoundary   = 'alt_'   . md5(uniqid((string) mt_rand(), true));

$headers = [
    'From: ' . $encFromName . ' <' . FROM_EMAIL . '>',
    'Reply-To: ' . $encReplyName . ' <' . $email . '>',
    'Bcc: ' . TO_BCC,
    'MIME-Version: 1.0',
    'Content-Type: multipart/mixed; boundary="' . $mixedBoundary . '"',
    'X-Mailer: vjdesai-career-mailer-v2',
];

$body = [];
$body[] = '--' . $mixedBoundary;
$body[] = 'Content-Type: multipart/alternative; boundary="' . $altBoundary . '"';
$body[] = '';
$body[] = '--' . $altBoundary;
$body[] = 'Content-Type: text/plain; charset=UTF-8';
$body[] = 'Content-Transfer-Encoding: 7bit';
$body[] = '';
$body[] = $plain;
$body[] = '--' . $altBoundary;
$body[] = 'Content-Type: text/html; charset=UTF-8';
$body[] = 'Content-Transfer-Encoding: base64';
$body[] = '';
$body[] = chunk_split(base64_encode($htmlBody));
$body[] = '--' . $altBoundary . '--';

if ($attachedOk && $cvBytes !== null) {
    $body[] = '--' . $mixedBoundary;
    $body[] = 'Content-Type: ' . $cvMime . '; name="' . $cvName . '"';
    $body[] = 'Content-Transfer-Encoding: base64';
    $body[] = 'Content-Disposition: attachment; filename="' . $cvName . '"';
    $body[] = '';
    $body[] = chunk_split(base64_encode($cvBytes));
}
$body[] = '--' . $mixedBoundary . '--';

$rawBody = implode("\r\n", $body);
$mailOk = @mail(TO_EMAIL, $encSubject, $rawBody, implode("\r\n", $headers));

$ok = ($savedUrl !== '') || $mailOk;
if (!$ok) fail(502, 'Could not save or send your application. Please email info@vjdesai.com directly.');

echo json_encode([
    'ok'       => true,
    'attached' => $attachedOk,
    'saved'    => $savedUrl !== '',
    'url'      => $savedUrl,
    'mail'     => (bool) $mailOk,
]);
