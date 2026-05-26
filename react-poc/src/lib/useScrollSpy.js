import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/* Sticky sub-nav scroll-spy: highlights the sub-nav link whose section is in
   view. Works for both the real templates (.gst-subnav .gsn / .subnav .sn) and
   the injected legacy pages. Re-initialises on every route change. */
export default function useScrollSpy() {
  const { pathname } = useLocation();

  useEffect(() => {
    let observer;
    // Wait a tick so template / injected-legacy DOM has rendered.
    const timer = setTimeout(() => {
      const links = [...document.querySelectorAll('.gst-subnav a.gsn, .subnav a.sn')];
      if (!links.length) return;

      const byId = new Map();
      const targets = [];
      links.forEach((a) => {
        const href = a.getAttribute('href') || '';
        if (!href.startsWith('#')) return;
        const el = document.getElementById(href.slice(1));
        if (el) { byId.set(el.id, a); targets.push(el); }
      });
      if (!targets.length) return;

      const setActive = (a) => {
        links.forEach((l) => l.classList.remove('active'));
        a.classList.add('active');
      };

      observer = new IntersectionObserver(
        (entries) => {
          // Choose the top-most section currently intersecting the band.
          const visible = entries.filter((e) => e.isIntersecting)
            .sort((x, y) => x.target.getBoundingClientRect().top - y.target.getBoundingClientRect().top);
          if (visible[0]) setActive(byId.get(visible[0].target.id));
        },
        { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
      );
      targets.forEach((t) => observer.observe(t));
    }, 140);

    return () => { clearTimeout(timer); if (observer) observer.disconnect(); };
  }, [pathname]);
}
