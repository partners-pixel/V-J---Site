/* ====================================================================
   NAV BEHAVIOUR  —  V J Desai & Co. LLP
   • Mobile hamburger open/close (.ntog ↔ .navl.open)
   • Tap-to-open dropdowns on mobile (.ni.open > .dd)
   • Active page highlight (already handled inline by nav.html's
     bottom <script>, kept here as a re-runnable fallback for SPA-style
     navigation or partial reloads).

   The nav markup is loaded by include.js — so we wait for the
   `includes:loaded` event before binding handlers. We also bind on
   plain DOMContentLoaded as a safety net for pages that ship the nav
   inline rather than via fetch.
   ==================================================================== */

(function () {
  'use strict';

  function initNav() {
    var navl = document.getElementById('navl');
    var ntog = document.getElementById('ntog');
    if (!navl || !ntog) return; // nav not on this page

    // Idempotent: bail if we've already wired up this nav
    if (ntog.dataset.bound === '1') return;
    ntog.dataset.bound = '1';

    /* ─── 1. Mobile hamburger toggle ───────────────────────────── */
    ntog.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = navl.classList.toggle('open');
      ntog.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    /* ─── 2. Click-to-open dropdowns on mobile ─────────────────── */
    // Hover is fine on desktop (CSS handles it). On touch / small
    // screens, tapping the parent should open the dropdown.
    var items = navl.querySelectorAll('.ni');
    items.forEach(function (li) {
      var dd = li.querySelector('.dd');
      if (!dd) return; // no dropdown on this item

      var trigger = li.querySelector('.nl');
      if (!trigger) return;

      trigger.addEventListener('click', function (e) {
        // Only intercept on mobile (≤ 768px); above that, follow the link.
        if (window.matchMedia('(max-width:768px)').matches) {
          // First tap opens dropdown; second tap follows the link.
          if (!li.classList.contains('open')) {
            e.preventDefault();
            // Close siblings
            items.forEach(function (other) {
              if (other !== li) other.classList.remove('open');
            });
            li.classList.add('open');
          }
        }
      });
    });

    /* ─── 3. Close mobile menu when clicking outside ───────────── */
    document.addEventListener('click', function (e) {
      if (!navl.classList.contains('open')) return;
      if (navl.contains(e.target) || ntog.contains(e.target)) return;
      navl.classList.remove('open');
      ntog.setAttribute('aria-expanded', 'false');
      items.forEach(function (li) { li.classList.remove('open'); });
    });

    /* ─── 4. Close mobile menu on Esc ──────────────────────────── */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navl.classList.contains('open')) {
        navl.classList.remove('open');
        ntog.setAttribute('aria-expanded', 'false');
        items.forEach(function (li) { li.classList.remove('open'); });
        ntog.focus();
      }
    });

    /* ─── 5. Re-apply active highlight ─────────────────────────── */
    // nav.html includes its own inline script for this, which runs on
    // initial fetch. This block is a safety net in case the inline
    // script didn't execute (e.g. nav was injected differently).
    if (!navl.querySelector('.nl.active')) {
      var subToParent = {
        'why-choose-us':'about','team':'about',
        'gst-class':'gst','gst-audit':'gst','gst-dd':'gst','gst-lit':'gst','gst-opinion':'gst','gst-refund':'gst','gst-search':'gst','gst-ebill':'gst',
        'corp-tax':'dtax','income-tax-adv':'dtax','income-tax':'dtax','nri-tax':'dtax',
        'stat-audit':'audit','tax-audit':'audit','int-audit':'audit','comp-audit':'audit',
        'biz-setup':'audit','biz-val':'audit','company-law':'audit','exim':'audit','fema':'audit','mgmt-cfo':'audit',
        'rera-reg':'rera','rera-qud':'rera','rera-ext':'rera','rera-disp':'rera',
        'kc-gst':'kc','kc-rera':'kc','kc-dtax':'kc','kc-intl':'kc','kc-fema':'kc','kc-audit':'kc','kc-glossary':'kc','kc-checklist':'kc'
      };
      var file = (location.pathname.split('/').pop() || 'index.html')
        .replace(/\.html?$/i, '');
      if (!file) file = 'index';
      var topSlug = subToParent[file] || file;
      var li = navl.querySelector('.ni[data-page="' + topSlug + '"]');
      if (li) {
        var nl = li.querySelector('.nl');
        if (nl) nl.classList.add('active');
      }
    }
  }

  // Bind whenever the nav becomes available.
  document.addEventListener('includes:loaded', initNav);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNav);
  } else {
    initNav();
  }
})();
