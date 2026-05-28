import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getLegacyPage } from '../content/legacyPages.js';
import { routeBySlug } from '../data/routes.js';
import RoutePlaceholder from './RoutePlaceholder.jsx';

const revealSelector = [
  '.sc',
  '.tc',
  '.mc',
  '.ic',
  '.cox',
  '.pc',
  '.fi',
  '.dc',
  '.kcc',
  '.jc',
  '.hcard',
  '.vi',
  '.step-card',
  '.eng-card',
  '.svc-mini-card',
  '.gst-svc-item',
  '.gst-eng-card',
  '.tcard',
  '.bcard',
  '.gal-item',
  '.ct-benefit',
  '.ct-case',
  '.pt-card',
  '.pt-panel',
  '.pt-ms',
  '.pt-roto-tile',
].join(',');

const tabGroups = {
  gst: ['g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9'],
  dtax: ['d1', 'd2', 'd3', 'd4'],
  audit: ['a1', 'a2', 'a3', 'a4', 'a5', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7'],
  rera: ['r1', 'r2', 'r3', 'r4'],
};

function routePathForSlug(slug) {
  const normalized = slug === 'home' ? 'index' : slug;
  return routeBySlug[normalized]?.path || `/${normalized}`;
}

function contentSlugForRoute(route) {
  return route.path === '/' || route.slug === 'index' ? 'home' : route.slug;
}

async function getContentOverride(route) {
  try {
    const response = await fetch(`/api/page-content/${contentSlugForRoute(route)}`);
    if (!response.ok) return null;
    const data = await response.json();
    const html = typeof data.html === 'string' ? data.html : '';
    return html.trim() ? html : null;
  } catch {
    return null;
  }
}

function setMeta(name, content) {
  if (!content) return;
  let meta = document.querySelector(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', name);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

function setupReveal(root) {
  const targets = Array.from(root.querySelectorAll(revealSelector));

  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return () => {};
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  targets.forEach((el) => {
    if (el.dataset.revealReady !== '1') {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity .44s ease, transform .44s ease';
      el.dataset.revealReady = '1';
    }
    observer.observe(el);
  });

  return () => observer.disconnect();
}

function setupScrollSpy(root) {
  if (!('IntersectionObserver' in window)) return () => {};

  const observers = [];
  root.querySelectorAll('.subnav, .gst-subnav').forEach((subnav) => {
    const targets = Array.from(subnav.querySelectorAll('a[href^="#"]'))
      .map((link) => {
        const section = root.querySelector(link.getAttribute('href'));
        return section ? { link, section } : null;
      })
      .filter(Boolean);

    if (!targets.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          targets.forEach(({ link, section }) => {
            link.classList.toggle('active', section === entry.target);
          });
        }
      });
    }, { rootMargin: '-130px 0px -60% 0px', threshold: 0 });

    targets.forEach(({ section }) => observer.observe(section));
    observers.push(observer);
  });

  return () => observers.forEach((observer) => observer.disconnect());
}

function setupAnchorScroll(root) {
  const onClick = (event) => {
    const anchor = event.target.closest('a[href^="#"]');
    if (!anchor || !root.contains(anchor)) return;

    const hash = anchor.getAttribute('href');
    if (!hash || hash.length < 2) return;

    const target = root.querySelector(hash);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', hash);
  };

  root.addEventListener('click', onClick);
  return () => root.removeEventListener('click', onClick);
}

function parseResponse(response) {
  return response.text().then((text) => {
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = null;
    }
    return { ok: response.ok, status: response.status, data };
  });
}

function serviceMissing(response) {
  return response.status === 404 || response.status === 405 || !response.data;
}

function setupContactForm(root) {
  const form = root.querySelector('#consult-form');
  if (!form) return () => {};

  const button = form.querySelector('.cou-sub');
  const message = root.querySelector('#consult-msg');
  if (!button || !message) return () => {};

  const originalText = button.textContent;

  const showError = (text) => {
    button.disabled = false;
    button.textContent = originalText;
    message.textContent = text;
    message.style.color = '#C0392B';
    message.style.display = 'block';
  };

  const postForm = (action) => fetch(action, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: new URLSearchParams(new FormData(form)),
  }).then(parseResponse);

  const handleResponse = (response) => {
    button.textContent = originalText;

    if (response.data?.success === true) {
      form.reset();
      button.disabled = true;
      button.textContent = 'Enquiry Received';
      button.style.background = '#1E8449';
      message.textContent = 'Your data was sent successfully, we will respond within 1 business day.';
      message.style.color = '#1E8449';
      message.style.display = 'block';
      return;
    }

    if (response.data?.message) {
      showError(response.data.message);
      return;
    }

    if (serviceMissing(response)) {
      showError('Form service not reachable. Please email info@vjdesai.com directly.');
      return;
    }

    showError('Sorry, something went wrong. Please email info@vjdesai.com directly.');
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    button.disabled = true;
    button.textContent = 'Sending...';
    message.style.display = 'none';

    const fallbackAction = form.getAttribute('data-fallback-action');

    postForm(form.action)
      .then((response) => {
        if (fallbackAction && serviceMissing(response)) {
          return postForm(fallbackAction);
        }
        return response;
      })
      .then(handleResponse)
      .catch(() => {
        if (!fallbackAction) {
          showError('Network error. Please check your connection or email info@vjdesai.com directly.');
          return;
        }

        postForm(fallbackAction)
          .then(handleResponse)
          .catch(() => {
            showError('Network error. Please check your connection or email info@vjdesai.com directly.');
          });
      });
  };

  form.addEventListener('submit', onSubmit);
  return () => form.removeEventListener('submit', onSubmit);
}

function useLegacyBehaviors(rootRef, page, route, navigate) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !page) return undefined;

    document.body.dataset.page = page.bodyPage || route.slug;
    document.title = page.title || `${route.title} | V J Desai & Co. LLP`;
    setMeta('description', page.description);

    const previousGlobals = {
      go: window.go,
      toggleFaq: window.toggleFaq,
      tab: window.tab,
      snScroll: window.snScroll,
      mob: window.mob,
      handleForm: window.handleForm,
    };

    window.go = (slug) => {
      if (!slug) return;
      navigate(routePathForSlug(slug));
    };

    window.toggleFaq = (question) => {
      question?.closest('.ct-faq-item')?.classList.toggle('open');
    };

    window.tab = (pageName, id) => {
      (tabGroups[pageName] || []).forEach((tabId) => {
        document.getElementById(`${pageName}-${tabId}`)?.classList.remove('active');
        document.getElementById(`${pageName}-btn-${tabId}`)?.classList.remove('active');
      });
      document.getElementById(`${pageName}-${id}`)?.classList.add('active');
      document.getElementById(`${pageName}-btn-${id}`)?.classList.add('active');
    };

    window.snScroll = (pageName, section) => {
      const firstTab = tabGroups[pageName]?.[0] || '';
      const target =
        document.getElementById(`${pageName}-${section}-${firstTab}`) ||
        document.getElementById(`${pageName}-${section}`);
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    window.mob = () => {
      document.getElementById('navl')?.classList.toggle('open');
    };

    window.handleForm = (button) => {
      if (!button) return;
      button.textContent = 'Enquiry received. We will be in touch shortly';
      button.style.background = '#2D6A4F';
      button.disabled = true;
    };

    const cleanups = [
      setupReveal(root),
      setupScrollSpy(root),
      setupAnchorScroll(root),
      setupContactForm(root),
    ];

    return () => {
      cleanups.forEach((cleanup) => cleanup?.());
      Object.entries(previousGlobals).forEach(([key, value]) => {
        if (value === undefined) {
          delete window[key];
        } else {
          window[key] = value;
        }
      });
    };
  }, [navigate, page, rootRef, route]);
}

export default function MigratedHtmlPage({ route }) {
  const rootRef = useRef(null);
  const navigate = useNavigate();
  const [page, setPage] = useState(undefined);

  useEffect(() => {
    let isCurrent = true;
    setPage(undefined);

    Promise.all([
      getLegacyPage(route.legacyFile),
      getContentOverride(route),
    ]).then(([loadedPage, overrideHtml]) => {
      if (isCurrent) {
        setPage(overrideHtml ? { ...(loadedPage || {}), html: overrideHtml } : loadedPage);
      }
    });

    return () => {
      isCurrent = false;
    };
  }, [route.legacyFile, route.path, route.slug]);

  useLegacyBehaviors(rootRef, page, route, navigate);

  if (page === undefined) {
    return null;
  }

  if (!page?.html) {
    return <RoutePlaceholder route={route} />;
  }

  return (
    <div
      ref={rootRef}
      className="legacy-page-content"
      dangerouslySetInnerHTML={{ __html: page.html }}
    />
  );
}
