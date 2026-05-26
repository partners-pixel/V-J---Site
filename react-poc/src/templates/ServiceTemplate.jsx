import { useNavigate } from 'react-router-dom';
import PageHero from './PageHero.jsx';
import useDocTitle from '../lib/useDocTitle.js';

/* Reusable service-page template: .ph hero + sticky sub-nav + one or two
   service-card groups + "How it works" steps + engagement cards + CTA band.
   Used by the Audit and RERA pages (and any sibling service page). */

function EmTitle({ parts, className, style }) {
  const { pre = '', em = '', post = '' } = parts || {};
  return <h2 className={className} style={style}>{pre}{em && <em>{em}</em>}{post}</h2>;
}

export default function ServiceTemplate({ data }) {
  const navigate = useNavigate();
  const go = (slug) => navigate(slug === 'home' || slug === 'index' ? '/' : '/' + slug);
  const { hero, subnav = [], ids = {}, serviceGroups = [], how, engagement, cta } = data;
  useDocTitle(`${hero.title.pre}${hero.title.em}`.trim());

  return (
    <div>
      <PageHero {...hero} />

      <div className="subnav"><div className="subnav-inner">
        {subnav.map((s, i) => <a className={`sn${i === 0 ? ' active' : ''}`} href={s.href} key={s.href}>{s.label}</a>)}
      </div></div>

      <section id={ids.services} className="svc-sec scroll-sec">
        <div className="svc-sec-inner">
          {serviceGroups.map((g, gi) => (
            <div key={gi}>
              <div className="stag" style={gi > 0 ? { marginTop: '2.2rem' } : undefined}>{g.tag}</div>
              <EmTitle parts={g.title} className="ht" />
              <p className="ssub" style={g.subTight ? { marginBottom: 0 } : undefined}>{g.sub}</p>
              <div className="svc-cards-grid">
                {g.cards.map((c, i) => (
                  <div className="svc-mini-card" key={i}>
                    <div className="smc-icon">{c.icon}</div>
                    {c.to
                      ? <h3 style={{ cursor: 'pointer' }} onClick={() => go(c.to)}>{c.h3}</h3>
                      : <h3>{c.h3}</h3>}
                    <p>{c.p}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {how && (
        <section id={ids.how} className="hiw-sec scroll-sec">
          <div className="hiw-inner">
            <div className="stag">{how.tag}</div>
            <EmTitle parts={how.title} className="ht" />
            <p className="ssub">{how.sub}</p>
            <div className="steps-grid">
              {how.steps.map((s, i) => (
                <div className="step-card" key={i}><div className="step-num">{s.num}</div><h4>{s.h4}</h4><p>{s.p}</p></div>
              ))}
            </div>
          </div>
        </section>
      )}

      {engagement && (
        <section id={ids.engagement} className="eng-sec scroll-sec">
          <div className="eng-inner">
            <div className="stag">{engagement.tag}</div>
            <EmTitle parts={engagement.title} className="ht" />
            <p className="ssub">{engagement.sub}</p>
            <div className="eng-grid">
              {engagement.cards.map((c, i) => <div className="eng-card" key={i}><h3>{c.h3}</h3><p>{c.p}</p></div>)}
            </div>
          </div>
        </section>
      )}

      {cta && (
        <div id={ids.contact} className="ctab scroll-sec"><div className="ctabi">
          <div><EmTitle parts={cta.title} /><p>{cta.p}</p></div>
          <button className="bgs" onClick={() => go(cta.btn.to)}>{cta.btn.label}</button>
        </div></div>
      )}
    </div>
  );
}
