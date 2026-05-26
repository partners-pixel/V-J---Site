import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSection } from '../lib/legacy.js';
import useDocTitle from '../lib/useDocTitle.js';

/* Reusable "GST premium" template — real JSX for every structural section.
   Drive it with a data object (see src/data/*.js). Each page's bespoke
   process diagram is pulled straight from the source markup (process.fromSlug
   + selector) or supplied as a raw string (process.svg), so hand-built SVG
   art is never re-encoded by hand. */

// Renders a "Pre <em>Em</em> Post" heading from plain-string parts.
function EmTitle({ parts, className, style }) {
  const { pre = '', em = '', post = '' } = parts || {};
  return <h2 className={className} style={style}>{pre}{em && <em>{em}</em>}{post}</h2>;
}

export default function GstTemplate({ data }) {
  const navigate = useNavigate();
  const go = (slug) => navigate(slug === 'home' || slug === 'index' ? '/' : '/' + slug);
  // Inline onclick="go('x')" handlers inside pulled-in source sections need a global go().
  useEffect(() => {
    const fn = (s) => navigate(s === 'home' || s === 'index' ? '/' : '/' + s);
    window.go = fn;
    return () => { if (window.go === fn) delete window.go; };
  }, [navigate]);
  const {
    breadcrumb = [], eyebrow, heroTitle, heroTitleSize = 'clamp(2.4rem,3.8vw,3.4rem)', heroLead, heroParas = [], heroBtn, heroRight,
    subnav = [], ids = {}, servicesTag = 'Core Services', servicesTitle, servicesSub, servicesCols, services = [],
    process, engagement = [], cta, sections = [],
  } = data;
  const twoCol = Array.isArray(heroRight) && heroRight.length > 0;
  useDocTitle(`${heroTitle.first} ${heroTitle.em}`.trim());

  return (
    <div>
      {/* Breadcrumb */}
      <div className="ph" style={{ padding: '1.4rem 5vw', minHeight: 'auto', background: 'var(--navy-deep)' }}>
        <div className="phi">
          <div className="bc">
            {breadcrumb.map((b, i) => (
              <span key={i} style={{ display: 'contents' }}>
                {b.to ? <a onClick={() => go(b.to)} style={{ cursor: 'pointer' }}>{b.label}</a> : <span>{b.label}</span>}
                {i < breadcrumb.length - 1 && <span>/</span>}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="gst-hero">
        <div className="gst-hero-inner" style={twoCol ? { gridTemplateColumns: '1fr .9fr', gap: '5vw' } : { gridTemplateColumns: '1fr', maxWidth: 900 }}>
          <div>
            <div className="gst-hero-eyebrow">{eyebrow}</div>
            <h1 style={{ fontSize: heroTitleSize }}>{heroTitle.first}<br /><em>{heroTitle.em}</em></h1>
            <p className="gst-hero-lead">{heroLead}</p>
            {heroParas.map((p, i) => (
              <p key={i} style={{ fontSize: '.93rem', lineHeight: 1.88, color: 'var(--tdim)', marginBottom: i === heroParas.length - 1 ? '1.8rem' : '.9rem' }}>{p}</p>
            ))}
            {heroBtn && <button className="bgs" onClick={() => go(heroBtn.to)}>{heroBtn.label}</button>}
          </div>
          {twoCol && (
            <div className="gst-hero-right">
              {heroRight.map((s, i) => (
                <div className="gst-stat" key={i}><div className="gst-stat-num">{s.n}</div><div className="gst-stat-lbl">{s.l}</div></div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Sticky sub-nav */}
      <div className="gst-subnav">
        <div className="gst-subnav-inner">
          {subnav.map((s, i) => (
            <a className={`gsn${i === 0 ? ' active' : ''}`} href={s.href} key={s.href}>{s.label}</a>
          ))}
        </div>
      </div>

      {/* Core services */}
      <section id={ids.services} className="gst-services-wrap gst-scroll">
        <div style={{ maxWidth: 1440, margin: '0 auto' }}>
          <div className="stag">{servicesTag}</div>
          <EmTitle parts={servicesTitle} className="ht" />
          {servicesSub && <p className="ssub" style={{ marginBottom: '2.6rem' }}>{servicesSub}</p>}
          <div className="gst-svc-grid" style={servicesCols ? { gridTemplateColumns: `repeat(${servicesCols},1fr)` } : undefined}>
            {services.map((s, i) => (
              <div className="gst-svc-item" key={i}>
                <div className="gst-svc-ico">{s.icon}</div>
                <h3>{s.h3}</h3>
                <p>{s.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bespoke lower sections (process / engagement / contact) pulled from
          source markup, in order — keeps each page's hand-built designs exact. */}
      {sections.map((s, i) => (
        <div key={i} dangerouslySetInnerHTML={{ __html: getSection(s.fromSlug, s.selector) }} />
      ))}

      {/* Process — bespoke diagram pulled from source markup, or raw SVG */}
      {process && process.fromSlug && (
        <div dangerouslySetInnerHTML={{ __html: getSection(process.fromSlug, process.selector) }} />
      )}
      {process && process.svg && (
        <div id={ids.process} className="hex2-wrap gst-scroll">
          <div className="hex2-inner">
            <div className="hex2-header">
              <div className="stag" style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', color: 'var(--gold)', justifyContent: 'center', marginBottom: '.8rem' }}>Process</div>
              <EmTitle parts={process.title} className="ht" style={{ textAlign: 'center' }} />
              <p className="ssub" style={{ textAlign: 'center', margin: '.5rem auto 0', maxWidth: 560 }}>{process.sub}</p>
            </div>
            <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch', padding: '2rem 0', maxWidth: 1100, margin: '0 auto' }}
                 dangerouslySetInnerHTML={{ __html: process.svg }} />
          </div>
        </div>
      )}

      {/* Engagement models */}
      {engagement.length > 0 && (
        <div id={ids.engagement} className="gst-eng-wrap gst-scroll">
          <div className="gst-eng-inner">
            <div className="stag">Engagement Models</div>
            <EmTitle parts={{ pre: 'Choose Your ', em: 'Engagement Model' }} className="ht" />
            <div className="gst-eng-grid">
              {engagement.map((c, i) => (
                <div className="gst-eng-card" key={i} style={c.featured ? { borderColor: 'var(--gold)', boxShadow: '0 0 0 1px var(--gold)' } : undefined}>
                  <div className="gst-eng-top" style={c.featured ? { background: 'linear-gradient(135deg,var(--navy),rgba(201,168,76,.18))' } : undefined}>
                    <div className="gst-eng-letter">{c.letter}</div>
                    <div className="gst-eng-badge" style={c.featured ? { background: 'var(--gold)', color: 'var(--white)', borderColor: 'var(--gold)' } : undefined}>{c.badge}</div>
                    <h3>{c.h3}</h3>
                    <p>{c.p}</p>
                  </div>
                  <div className="gst-eng-divider"></div>
                  <div className="gst-eng-body">
                    <ul className="gst-eng-feat">{c.features.map((f, j) => <li key={j}>{f}</li>)}</ul>
                  </div>
                  <button className="bgs" onClick={() => go(c.btn?.to || 'contact')} style={{ margin: '0 1.8rem 1.8rem', width: 'calc(100% - 3.6rem)' }}>{c.btn?.label || 'Get a Proposal'}</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Final CTA */}
      {cta && (
        <div id={ids.contact} className="gst-cta-wrap gst-scroll">
          <div className="gst-cta-inner">
            <div className="gst-cta-left">
              <div className="stag" style={{ color: 'var(--gold)' }}>Contact</div>
              <h2>{cta.title.first}<br /><em>{cta.title.em}</em></h2>
              <p style={{ fontSize: '.93rem', lineHeight: 1.82, color: 'var(--tdim)', marginBottom: '1.6rem' }}>{cta.lead}</p>
              <p style={{ fontSize: '.8rem', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '.9rem' }}>We assist you with:</p>
              <ul className="gst-cta-list">{cta.list.map((l, i) => <li key={i}>{l}</li>)}</ul>
            </div>
            <div className="gst-cta-right">
              <h3>{cta.rightTitle}</h3>
              <p style={{ fontSize: '.86rem', lineHeight: 1.8, color: 'rgba(255,255,255,.55)', marginBottom: '1.8rem' }}>{cta.rightLead}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
                {cta.btns.map((b, i) => (
                  <button key={i} className={b.kind === 'outline' ? 'bdo' : 'bgs'} onClick={() => go(b.to || 'contact')}
                          style={{ justifyContent: 'center', padding: '.95rem', ...(b.kind === 'outline' ? { borderColor: 'rgba(255,255,255,.2)' } : {}) }}>{b.label}</button>
                ))}
              </div>
              {cta.related && (
                <div style={{ marginTop: '1.8rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,.08)' }}>
                  <div style={{ fontSize: '.68rem', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.35)', marginBottom: '.85rem' }}>Related Services</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                    {cta.related.map((r, i) => (
                      <a key={i} onClick={() => go(r.to)} style={{ fontSize: '.82rem', color: 'rgba(201,168,76,.8)', cursor: 'pointer' }}>{r.label}</a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
