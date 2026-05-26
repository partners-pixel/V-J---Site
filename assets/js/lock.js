/* ====================================================================
   CONTENT LOCK  —  V J Desai & Co. LLP
   Lightweight deterrents against casual copying of site content.
   • Right-click context menu disabled
   • F12 / Ctrl+Shift+I/J/C blocked (open DevTools)
   • Ctrl+U (View Source), Ctrl+S (Save), Ctrl+P (Print) blocked
   • Ctrl+A (Select All), Ctrl+C (Copy), Ctrl+X (Cut) blocked
   • Drag-and-drop disabled
   • CSS already disables text selection on <body> (see base.css)

   ⚠ KNOWN LIMITATIONS — please read:
   These checks are CLIENT-SIDE only and trivially bypassed by anyone
   with intent (disable JS, use the View menu, browser extensions,
   curl/wget, etc.). They mostly inconvenience legitimate visitors
   (copy a phone number, share a URL, save a receipt). Keep the file
   here because you asked for it, but treat it as deterrent only, not
   security. Anything that needs real protection must live server-side.
   ==================================================================== */

(function () {
  'use strict';

  /* ─── 1. Disable right-click context menu ──────────────────────── */
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    return false;
  });

  /* ─── 2. Keyboard shortcut blocker ─────────────────────────────── */
  document.addEventListener('keydown', function (e) {
    var k = (e.key || '').toLowerCase();

    // F12 — DevTools
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault(); return false;
    }
    // Ctrl+Shift+I / J / C — DevTools panels
    if (e.ctrlKey && e.shiftKey && (k === 'i' || k === 'j' || k === 'c')) {
      e.preventDefault(); return false;
    }
    // Ctrl+U — View Source
    if (e.ctrlKey && k === 'u') { e.preventDefault(); return false; }
    // Ctrl+S — Save Page
    if (e.ctrlKey && k === 's') { e.preventDefault(); return false; }
    // Ctrl+P — Print
    if (e.ctrlKey && k === 'p') { e.preventDefault(); return false; }
    // Ctrl+A / Ctrl+C / Ctrl+X (Select All / Copy / Cut) are intentionally
    // allowed so all text is selectable and copyable.
  });

  /* ─── 3. Disable drag-and-drop ─────────────────────────────────── */
  document.addEventListener('dragstart', function (e) {
    e.preventDefault();
    return false;
  });

  /* ─── 4. Copy / cut are allowed — all text is selectable & copyable ── */

  /* ─── 5. Print-screen wipe (best-effort; OS-level not blockable) */
  document.addEventListener('keyup', function (e) {
    if (e.key === 'PrintScreen' || e.keyCode === 44) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText('').catch(function () { /* ignored */ });
      }
    }
  });

  /* ─── 6. DevTools-open detector ────────────────────────────────── */
  // The original used a `debugger;` timing check in a setInterval. That
  // approach freezes the page while DevTools is open (which is the
  // whole point), but it makes UX awful during legitimate inspection
  // and causes false positives on slow tabs. We keep it here, gated by
  // a flag so you can disable easily if needed.
  var ENABLE_DEVTOOLS_TRAP = true;

  if (ENABLE_DEVTOOLS_TRAP) {
    var devtools = { open: false };
    setInterval(function () {
      var start = Date.now();
      // eslint-disable-next-line no-debugger
      debugger;
      if (Date.now() - start > 100) {
        if (!devtools.open) {
          devtools.open = true;
          document.body.style.display = 'none';
          setTimeout(function () { document.body.style.display = ''; }, 0);
        }
      } else {
        devtools.open = false;
      }
    }, 500);
  }
})();
