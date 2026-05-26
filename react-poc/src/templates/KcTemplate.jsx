import { useNavigate } from 'react-router-dom';
import PageHero from './PageHero.jsx';
import useDocTitle from '../lib/useDocTitle.js';

/* Knowledge-center overview template: shared hero + topic grid + latest
   updates + a compliance-tools callout. */

function EmTitle({ parts, className, style }) {
  const { pre = '', em = '', post = '' } = parts || {};
  return <h2 className={className} style={style}>{pre}{em && <em>{em}</em>}{post}</h2>;
}

export default function KcTemplate({ data }) {
  const navigate = useNavigate();
  const go = (slug) => navigate(slug === 'home' || slug === 'index' ? '/' : '/' + slug);
  const { hero, subnav = [], topics, updates, tools } = data;
  useDocTitle(`${hero.title.pre}${hero.title.em}`.trim());

  return (
    <div>
      <PageHero {...hero} />

      {subnav.length > 0 && (
        <div className="subnav"><div className="subnav-inner">
          {subnav.map((s) => <a className="sn" href={s.href} key={s.href}>{s.label}</a>)}
        </div></div>
      )}

      <section id="kc-topics" className="s scroll-sec" style={{ background: 'var(--white)' }}><div className="si">
        <div className="stag">{topics.tag}</div>
        <EmTitle parts={topics.title} className="ht" style={{ marginBottom: '1.4rem' }} />
        <div className="dg" style={{ marginTop: '1.6rem' }}>
          {topics.cards.map((c, i) => (
            <div className="dc" style={{ cursor: 'pointer' }} onClick={() => go(c.to)} key={i}>
              <div className="dci">{c.icon}</div><h3>{c.h3}</h3><p>{c.p}</p>
            </div>
          ))}
        </div>
      </div></section>

      {updates && (
        <section id="kc-updates" className="s scroll-sec" style={{ background: 'var(--light)' }}><div className="si">
          <div className="stag">{updates.tag}</div>
          <EmTitle parts={updates.title} className="ht" style={{ marginBottom: '1.4rem' }} />
          <div className="kcg">
            {updates.cards.map((c, i) => (
              <div className="kcc" key={i}>
                <div className="kctr"><span className="kctag">{c.tag}</span><span className="kcdt">{c.date}</span></div>
                <div className="kcb"><h3>{c.h3}</h3><p>{c.p}</p><span className="kcr" onClick={() => go(c.to)}>Read More →</span></div>
              </div>
            ))}
          </div>
        </div></section>
      )}

      {tools && (
        <section id="kc-tools" className="s scroll-sec" style={{ background: 'var(--white)' }}><div className="si">
          <div style={{ background: 'var(--navy)', borderRadius: 10, padding: '2.6rem' }}>
            <div className="stag" style={{ color: 'var(--gold)' }}>{tools.tag}</div>
            <h3 style={{ fontFamily: "'EB Garamond',serif", fontSize: '1.45rem', color: 'var(--white)', marginBottom: '.85rem' }}>
              {tools.title.pre}<em style={{ color: 'var(--gold)' }}>{tools.title.em}</em>
            </h3>
            <p style={{ color: 'var(--tdim)', fontSize: '.88rem', lineHeight: 1.8, maxWidth: 680, marginBottom: '1.4rem' }}>{tools.lead}</p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {tools.btns.map((b, i) => (
                <button key={i} className={b.outline ? 'bdo' : 'bgs'} onClick={() => go(b.to)}>{b.label}</button>
              ))}
            </div>
          </div>
        </div></section>
      )}
    </div>
  );
}
