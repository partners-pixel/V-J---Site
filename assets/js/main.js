/* ====================================================================
   MAIN UTILITIES  —  V J Desai & Co. LLP
   • Scroll-reveal animations (IntersectionObserver)
   • Generic FAQ toggle (used on /corp-tax, /kc pages — original markup
     used onclick="toggleFaq(this)"; this delegates the same behaviour)
   • Smooth-scroll on in-page anchor clicks (.subnav / .gst-subnav)
   • Sub-nav scroll-spy: highlights the .sn / .gsn matching the
     currently-visible section anchor
   ==================================================================== */

(function () {
  'use strict';

  /* ─── 1. SCROLL REVEAL ─────────────────────────────────────────── */
  // Targets every common "card" class from the original. Adds a one-time
  // fade-in-up when the element enters the viewport.
  var REVEAL_SELECTOR = [
    '.sc',          // home service cards
    '.tc',          // team cards
    '.mc',          // metric cards
    '.ic',          // industry cards
    '.cox',         // contact info cards
    '.pc',          // problem cards
    '.fi',          // feature items
    '.dc',          // detail cards
    '.kcc',         // KC content cards
    '.jc',          // job cards
    '.hcard',       // hero feature cards
    '.vi',          // value-list items
    '.step-card',
    '.eng-card',
    '.svc-mini-card',
    '.gst-svc-item',
    '.gst-eng-card',
    '.tcard',       // testimonial cards
    '.bcard',       // blog cards
    '.gal-item',
    '.ct-benefit',
    '.ct-case',
    '.pt-card',
    '.pt-panel',
    '.pt-ms',
    '.pt-roto-tile'
  ].join(',');

  function setupReveal() {
    if (!('IntersectionObserver' in window)) {
      // No IO support: just show everything
      document.querySelectorAll(REVEAL_SELECTOR).forEach(function (el) {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll(REVEAL_SELECTOR).forEach(function (el) {
      // Only set initial state once (idempotent for re-runs)
      if (el.dataset.revealReady !== '1') {
        el.style.opacity = '0';
        el.style.transform = 'translateY(16px)';
        el.style.transition = 'opacity .44s ease, transform .44s ease';
        el.dataset.revealReady = '1';
      }
      io.observe(el);
    });
  }

  /* ─── 1b. LEGACY SPA HANDLERS  (window.go / .tab / .snScroll …) ── */
  // The extracted page content carries inline onclick="go('slug')",
  // onclick="tab('audit','a1')", onclick="snScroll('gst','svc')", and
  // onclick="handleForm(this)". We expose minimal global shims so those
  // attributes keep working in the multi-page world.

  // Navigate between pages. 'home' maps to index.html; everything else
  // is "<slug>.html" — works from any pages/*.html since they are
  // siblings of each other.
  window.go = function (slug) {
    if (!slug) return;
    var file = (slug === 'home' ? 'index' : slug) + '.html';
    location.href = file;
  };

  // In-page tab switcher (preserved from the original SPA)
  var TABS = {
    gst:   ['g1','g2','g3','g4','g5','g6','g7','g8','g9'],
    dtax:  ['d1','d2','d3','d4'],
    audit: ['a1','a2','a3','a4','a5','c1','c2','c3','c4','c5','c6','c7'],
    rera:  ['r1','r2','r3','r4']
  };
  window.tab = function (page, id) {
    (TABS[page] || []).forEach(function (t) {
      var p = document.getElementById(page + '-' + t);
      if (p) p.classList.remove('active');
      var b = document.getElementById(page + '-btn-' + t);
      if (b) b.classList.remove('active');
    });
    var tp = document.getElementById(page + '-' + id);
    if (tp) tp.classList.add('active');
    var tb = document.getElementById(page + '-btn-' + id);
    if (tb) tb.classList.add('active');
  };

  // Sub-nav anchor scroller
  window.snScroll = function (page, section) {
    var keys = Object.keys(window._activeTab || {});
    var active = (window._activeTab && window._activeTab[page]) ||
                 (TABS[page] ? TABS[page][0] : '');
    var anchorId = page + '-' + section + (active ? '-' + active : '');
    var el = document.getElementById(anchorId) ||
             document.getElementById(page + '-' + section);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Mobile nav toggle (in case any extracted content calls mob())
  window.mob = function () {
    var navl = document.getElementById('navl');
    if (navl) navl.classList.toggle('open');
  };

  // Form submission stub used by old onclick="handleForm(this)" buttons
  window.handleForm = function (btn) {
    if (!btn) return;
    btn.textContent = '✓ Enquiry received. We will be in touch shortly';
    btn.style.background = '#2D6A4F';
    btn.disabled = true;
  };

  /* ─── 2. FAQ TOGGLE (delegated) ────────────────────────────────── */
  // Original markup: <div class="ct-faq-q" onclick="toggleFaq(this)">…</div>
  // Replace inline handlers with delegation. Also exposes window.toggleFaq
  // so any leftover inline handlers in copied content still work.
  function toggleFaq(qEl) {
    var item = qEl.closest('.ct-faq-item');
    if (item) item.classList.toggle('open');
  }
  window.toggleFaq = toggleFaq;

  document.addEventListener('click', function (e) {
    var q = e.target.closest('.ct-faq-q');
    if (q) toggleFaq(q);
  });

  /* ─── 3. SMOOTH SCROLL FOR IN-PAGE ANCHORS ─────────────────────── */
  // The page CSS already sets html { scroll-behavior:smooth } — this
  // handler just makes sure sub-nav clicks update aria + focus state.
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var hash = a.getAttribute('href');
    if (!hash || hash.length < 2) return;
    var target = document.querySelector(hash);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', hash);
  });

  /* ─── 4. SUB-NAV SCROLL SPY ────────────────────────────────────── */
  // Highlights the .sn / .gsn link whose target section is currently
  // closest to the top of the viewport.
  function setupScrollSpy() {
    var subnavs = document.querySelectorAll('.subnav, .gst-subnav');
    if (!subnavs.length || !('IntersectionObserver' in window)) return;

    subnavs.forEach(function (subnav) {
      var links = Array.from(subnav.querySelectorAll('a[href^="#"]'));
      if (!links.length) return;

      var targets = links
        .map(function (a) {
          var t = document.querySelector(a.getAttribute('href'));
          return t ? { link: a, section: t } : null;
        })
        .filter(Boolean);

      if (!targets.length) return;

      var activeClass = subnav.classList.contains('gst-subnav')
        ? 'active' : 'active';

      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            targets.forEach(function (t) {
              t.link.classList.toggle(
                activeClass, t.section === entry.target
              );
            });
          }
        });
      }, { rootMargin: '-130px 0px -60% 0px', threshold: 0 });

      targets.forEach(function (t) { spy.observe(t.section); });
    });
  }

  /* ─── INIT ─────────────────────────────────────────────────────── */
  function init() {
    setupReveal();
    setupScrollSpy();
  }

  // Run on initial load AND after includes load (in case nav/footer
  // injection adds reveal targets).
  document.addEventListener('includes:loaded', setupReveal);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
