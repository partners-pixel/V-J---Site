/* ====================================================================
   HTML INCLUDE LOADER  —  V J Desai & Co. LLP
   Fetches partial HTML files referenced by [data-include="path"]
   placeholders and inlines them into the document on page load.

   Pattern in each page:
     <div data-include="components/nav.html"></div>
     ...page content...
     <div data-include="components/footer.html"></div>

   Why this exists:
     • Lets every page reuse one nav.html and one footer.html
     • innerHTML-inserted <script> tags do NOT auto-execute by spec —
       we walk the loaded fragment and recreate any <script> elements
       so the inline init code (active-nav highlight, copyright year)
       runs properly.

   ⚠ file:// caveat — fetch() is blocked on the file:// protocol in
     Chrome/Edge. Open pages via a local server instead. From the
     project root:
         python -m http.server 5500
     or use the VS Code "Live Server" extension.
   ==================================================================== */

(function () {
  'use strict';

  // Promise-returning include for a single placeholder.
  async function loadOne(placeholder) {
    var url = placeholder.getAttribute('data-include');
    if (!url) return;

    try {
      var res = await fetch(url, { cache: 'no-cache' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      var html = await res.text();

      // Parse outside the live DOM so scripts don't pre-execute.
      var doc = new DOMParser().parseFromString(
        '<!doctype html><html><body>' + html + '</body></html>',
        'text/html'
      );

      var parent = placeholder.parentNode;
      var nodes = Array.from(doc.body.childNodes);

      nodes.forEach(function (node) {
        if (node.nodeType === 1 && node.tagName === 'SCRIPT') {
          // Recreate <script> so it executes
          var s = document.createElement('script');
          for (var i = 0; i < node.attributes.length; i++) {
            var a = node.attributes[i];
            s.setAttribute(a.name, a.value);
          }
          if (node.textContent) s.textContent = node.textContent;
          parent.insertBefore(s, placeholder);
        } else {
          parent.insertBefore(node, placeholder);
        }
      });

      parent.removeChild(placeholder);
    } catch (err) {
      console.error('[include] failed to load "' + url + '":', err);
      placeholder.innerHTML =
        '<div style="padding:1rem;background:#fee;border:1px solid #f88;' +
        'border-radius:6px;color:#900;font-family:monospace;font-size:.85rem">' +
        '⚠ include failed: ' + url + ' — are you running a local server? ' +
        'See the comment at the top of include.js.</div>';
    }
  }

  // Load every [data-include] in document order, then signal completion.
  async function loadAll() {
    var phs = Array.from(document.querySelectorAll('[data-include]'));
    for (var i = 0; i < phs.length; i++) {
      await loadOne(phs[i]);
    }
    document.dispatchEvent(new CustomEvent('includes:loaded'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAll);
  } else {
    loadAll();
  }
})();
