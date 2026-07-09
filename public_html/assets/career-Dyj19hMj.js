const e=`\uFEFF<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate"/>
  <meta http-equiv="Pragma" content="no-cache"/>
  <meta http-equiv="Expires" content="0"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Career | V J Desai &amp; Co. LLP</title>

  <meta name="description" content="Career services, V J Desai &amp; Co. LLP, Chartered Accountants. ICAI registered, est. 1993, Ahmedabad."/>
  <meta name="robots" content="noindex, nofollow"/>

  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600&amp;family=Inter:wght@300;400;500;600&amp;display=swap" rel="stylesheet"/>

  <link rel="stylesheet" href="../assets/css/variables.css?v=2"/>
  <link rel="stylesheet" href="../assets/css/base.css?v=3"/>
  <link rel="stylesheet" href="../assets/css/nav.css?v=6"/>
  <link rel="stylesheet" href="../assets/css/footer.css?v=6"/>
  <link rel="stylesheet" href="../assets/css/components.css?v=6"/>
</head>
<body data-page="career">

<!-- SHARED NAV (loaded by include.js) -->
<div data-include="../components/nav.html?v=7"></div>

<!-- PAGE CONTENT -->
<main>

<div id="page-career">
<style>
/* ══════════════════════════════════════
   CAREER PAGE, FULLY SCOPED STYLES
══════════════════════════════════════ */
#page-career .car-hero-stats{display:flex;flex-wrap:wrap;gap:2rem;margin-top:2.4rem;padding-top:2rem;border-top:1px solid rgba(201,168,76,.2)}
#page-career .chs-num{font-family:'EB Garamond',serif;font-size:2rem;font-weight:700;color:var(--gold);line-height:1}
#page-career .chs-label{font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.45);margin-top:.25rem}
#page-career .car-hero-badges{display:flex;flex-wrap:wrap;gap:.6rem;margin-top:1.6rem}
#page-career .car-hero-badge{display:inline-flex;align-items:center;gap:.4rem;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.13);color:rgba(255,255,255,.75);font-size:.75rem;font-weight:500;padding:.3rem .85rem;border-radius:20px}
#page-career .car-hero-badge .chbgold{color:var(--gold)}
#page-career .car-hero-cta{display:flex;flex-wrap:wrap;gap:.85rem;margin-top:2rem}
#page-career .cbtn-primary{display:inline-flex;align-items:center;gap:.45rem;background:var(--gold);color:var(--navy-deep);font-size:.87rem;font-weight:700;padding:.75rem 1.8rem;border-radius:5px;transition:var(--t);cursor:pointer;border:none;font-family:'Inter',sans-serif}
#page-career .cbtn-primary:hover{background:var(--gold-lt);transform:translateY(-1px)}
#page-career .cbtn-outline{display:inline-flex;align-items:center;gap:.45rem;background:transparent;color:rgba(255,255,255,.82);border:1px solid rgba(255,255,255,.25);font-size:.87rem;font-weight:500;padding:.75rem 1.6rem;border-radius:5px;transition:var(--t);cursor:pointer;font-family:'Inter',sans-serif}
#page-career .cbtn-outline:hover{border-color:var(--gold);color:var(--gold)}
#page-career .cqcard{background:rgba(255,255,255,.06);border:1px solid rgba(201,168,76,.18);border-radius:10px;padding:1.4rem 1.6rem;margin-bottom:1rem}
#page-career .cqcard h4{font-family:'EB Garamond',serif;font-size:1.05rem;font-weight:700;color:var(--white);margin-bottom:.5rem}
#page-career .cqcard p{font-size:.82rem;color:rgba(255,255,255,.55);line-height:1.65}
#page-career .cqcard-meta{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.8rem}
#page-career .cqctag{font-size:.68rem;background:rgba(201,168,76,.15);color:var(--gold);border:1px solid rgba(201,168,76,.25);border-radius:3px;padding:.14rem .55rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase}
#page-career .cqapply{margin-top:.9rem;display:inline-flex;align-items:center;gap:.3rem;font-size:.78rem;font-weight:600;color:var(--gold);cursor:pointer;background:none;border:none;font-family:'Inter',sans-serif;transition:var(--t);padding:0}
#page-career .cqapply:hover{color:var(--gold-lt)}

/* Sub-nav */
#page-career .car-subnav{background:var(--white);border-bottom:1.5px solid var(--light);position:sticky;top:96px;z-index:400;box-shadow:0 1px 8px rgba(0,0,0,.04)}
#page-career .car-subnav-inner{max-width:1440px;margin:0 auto;padding:0 5vw;display:flex;align-items:center;overflow-x:auto;scrollbar-width:none}
#page-career .car-subnav-inner::-webkit-scrollbar{display:none}
#page-career .csn{display:inline-flex;align-items:center;padding:.82rem 1.1rem;font-size:.84rem;font-weight:500;color:var(--tmid);cursor:pointer;white-space:nowrap;border-bottom:2.5px solid transparent;margin-bottom:-1.5px;transition:var(--t);text-decoration:none;font-family:'Inter',sans-serif}
#page-career .csn:hover{color:var(--tdark)}
#page-career .csn.csn-active{color:var(--gold);border-bottom-color:var(--gold);font-weight:600}

/* Sections */
#page-career .car-sec{padding:80px 5vw;background:var(--white)}
#page-career .car-sec-alt{padding:80px 5vw;background:var(--light)}
#page-career .car-sec-inner{max-width:1440px;margin:0 auto}
#page-career .car-sec-head{text-align:center;margin-bottom:2.5rem}

/* Why Join Us */
#page-career .car-why-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.4rem;margin-top:2rem}
#page-career .cwcard{background:var(--white);border:1px solid rgba(0,0,0,.07);border-radius:10px;padding:1.8rem 1.6rem;border-top:3px solid var(--gold);transition:var(--t)}
#page-career .cwcard:hover{transform:translateY(-3px);box-shadow:0 10px 30px rgba(0,0,0,.09)}
#page-career .cwicon{width:44px;height:44px;background:var(--gold-bg);border:1px solid var(--bdr);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;margin-bottom:1rem}
#page-career .cwcard h3{font-family:'EB Garamond',serif;font-size:1.08rem;font-weight:700;color:var(--tdark);margin-bottom:.5rem}
#page-career .cwcard p{font-size:.85rem;color:var(--tmute);line-height:1.7}

/* Culture */
#page-career .car-culture-grid{display:grid;grid-template-columns:1fr 1fr;gap:4vw;align-items:start;margin-top:2rem}
#page-career .ccitem{display:flex;align-items:flex-start;gap:1rem;background:var(--white);border-radius:8px;padding:1.2rem 1.4rem;border:1px solid rgba(0,0,0,.06);border-left:3px solid var(--gold);margin-bottom:1rem}
#page-career .ccicon{width:36px;height:36px;background:var(--gold-bg);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0}
#page-career .ccitem h4{font-size:.88rem;font-weight:600;color:var(--tdark);margin-bottom:.22rem}
#page-career .ccitem p{font-size:.82rem;color:var(--tmute);line-height:1.6}
#page-career .car-quote{background:var(--navy);border-radius:10px;padding:2rem 2.2rem;border-left:4px solid var(--gold);margin-bottom:1.2rem}
#page-career .car-quote blockquote{font-family:'EB Garamond',serif;font-size:1.05rem;font-style:italic;line-height:1.7;color:var(--tlt);margin-bottom:.8rem}
#page-career .car-quote cite{font-size:.75rem;color:var(--gold);font-style:normal;font-weight:600;letter-spacing:.06em;text-transform:uppercase}
#page-career .car-metrics{display:grid;grid-template-columns:repeat(2,1fr);gap:1rem;margin-bottom:1.2rem}
#page-career .cmetric{background:var(--white);border-radius:8px;padding:1.2rem;border:1px solid rgba(0,0,0,.07);text-align:center}
#page-career .cmet-num{font-family:'EB Garamond',serif;font-size:1.7rem;font-weight:700;color:var(--navy);line-height:1}
#page-career .cmet-label{font-size:.74rem;color:var(--tmute);margin-top:.3rem;letter-spacing:.04em}
#page-career .car-domains{background:var(--navy);border-radius:10px;padding:1.5rem 1.8rem}
#page-career .car-domain-title{font-size:.68rem;font-weight:700;letter-spacing:.13em;text-transform:uppercase;color:var(--gold);margin-bottom:.9rem}
#page-career .car-domain-tags{display:flex;flex-wrap:wrap;gap:.45rem}
#page-career .cdtag{font-size:.76rem;background:rgba(255,255,255,.07);color:rgba(255,255,255,.7);border:1px solid rgba(255,255,255,.1);border-radius:4px;padding:.2rem .65rem}

/* Job Cards */
#page-career .car-jobs-wrap{display:flex;flex-direction:column;gap:2rem;margin-top:2rem}
#page-career .jc2{border-radius:12px;border:1px solid rgba(0,0,0,.08);overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.07)}
#page-career .jc2-head{padding:2rem 2.4rem 1.6rem;background:var(--white);border-bottom:1px solid var(--light)}
#page-career .jc2-head-row{display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:1.2rem}
#page-career .jc2-badge{display:inline-flex;align-items:center;gap:.35rem;font-size:.62rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;border-radius:4px;padding:.2rem .72rem;margin-bottom:.65rem}
#page-career .jbadge-blue{background:rgba(26,82,118,.1);color:#1A5276;border:1px solid rgba(26,82,118,.2)}
#page-career .jbadge-teal{background:rgba(0,112,112,.1);color:#007070;border:1px solid rgba(0,112,112,.2)}
#page-career .jc2-title{font-family:'EB Garamond',serif;font-size:1.5rem;font-weight:700;color:var(--tdark);margin-bottom:.28rem;line-height:1.2}
#page-career .jc2-sub{font-size:.85rem;color:var(--tmute);margin-bottom:.9rem}
#page-career .jc2-pills{display:flex;flex-wrap:wrap;gap:.5rem}
#page-career .jc2-pill{display:inline-flex;align-items:center;gap:.3rem;font-size:.74rem;color:var(--tmid);background:var(--light);border:1px solid rgba(0,0,0,.07);border-radius:20px;padding:.2rem .75rem}
#page-career .jc2-apply{display:inline-flex;align-items:center;gap:.4rem;font-size:.82rem;font-weight:700;padding:.65rem 1.5rem;border-radius:6px;transition:var(--t);cursor:pointer;white-space:nowrap;font-family:'Inter',sans-serif;border:none}
#page-career .ja-navy{background:var(--navy);color:var(--white)}
#page-career .ja-navy:hover{background:var(--navy-hover);transform:translateY(-1px);box-shadow:0 4px 14px rgba(0,0,0,.18)}
#page-career .ja-gold{background:var(--gold);color:var(--navy-deep)}
#page-career .ja-gold:hover{background:var(--gold-lt);transform:translateY(-1px)}
#page-career .jc2-body{padding:2rem 2.4rem;background:var(--off);display:grid;grid-template-columns:1fr 1fr;gap:2rem}
#page-career .jc2-full{grid-column:1/-1}
#page-career .jc2-label{font-size:.67rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);border-bottom:1px solid var(--bdr);padding-bottom:.45rem;margin-bottom:.9rem}
#page-career .jc2-body p{font-size:.86rem;color:var(--tmid);line-height:1.75}
#page-career .jlist{display:flex;flex-direction:column;gap:.55rem;margin:0;padding:0;list-style:none}
#page-career .jlist li{display:flex;align-items:flex-start;gap:.6rem;font-size:.85rem;color:var(--tmid);line-height:1.65}
#page-career .jlist li::before{content:'▸';color:var(--gold);font-size:.75rem;margin-top:.18rem;flex-shrink:0}
#page-career .jlist li strong{color:var(--tdark);font-weight:600}
#page-career .jskills{display:flex;flex-wrap:wrap;gap:.45rem;margin-top:.2rem}
#page-career .jskill{font-size:.75rem;background:var(--white);border:1px solid var(--bdr);color:var(--tmid);border-radius:4px;padding:.18rem .65rem}
#page-career .jc2-foot{padding:1.1rem 2.4rem;background:var(--light);border-top:1px solid rgba(0,0,0,.06);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.8rem}
#page-career .jc2-foot-note{font-size:.75rem;color:var(--tmute)}

/* Process Steps */
#page-career .car-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:1.3rem;margin-top:2rem}
#page-career .cstep{background:var(--white);border-radius:10px;padding:1.8rem 1.5rem;border:1px solid rgba(0,0,0,.07);border-top:3px solid var(--gold);transition:var(--t)}
#page-career .cstep:hover{transform:translateY(-3px);box-shadow:0 10px 30px rgba(0,0,0,.09)}
#page-career .cstep-num{font-family:'EB Garamond',serif;font-size:2.2rem;font-weight:700;color:rgba(201,168,76,.2);line-height:1;margin-bottom:.7rem}
#page-career .cstep h4{font-family:'EB Garamond',serif;font-size:1.05rem;font-weight:700;color:var(--tdark);margin-bottom:.4rem}
#page-career .cstep p{font-size:.84rem;color:var(--tmute);line-height:1.68}

/* Benefits */
#page-career .car-benefits-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.4rem;margin-top:2rem}
#page-career .cben{background:var(--light);border-radius:10px;padding:2rem 1.6rem;border:1px solid rgba(0,0,0,.06);border-left:4px solid var(--gold);transition:var(--t)}
#page-career .cben:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.08)}
#page-career .cben-icon{font-size:1.6rem;margin-bottom:.8rem}
#page-career .cben h3{font-family:'EB Garamond',serif;font-size:1.05rem;font-weight:700;color:var(--tdark);margin-bottom:.6rem}
#page-career .cben ul{display:flex;flex-direction:column;gap:.35rem;list-style:none;padding:0}
#page-career .cben ul li{display:flex;align-items:flex-start;gap:.45rem;font-size:.82rem;color:var(--tmid);line-height:1.55}
#page-career .cben ul li::before{content:'✓';color:var(--gold);font-weight:700;flex-shrink:0;font-size:.8rem}

/* CTA */
#page-career .car-cta-sec{background:var(--navy);padding:80px 5vw}
#page-career .car-cta-inner{max-width:1440px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:5vw;align-items:start}
#page-career .car-cta-h2{font-family:'EB Garamond',serif;font-size:clamp(1.7rem,2.5vw,2.5rem);font-weight:700;color:var(--white);line-height:1.2;margin-bottom:.9rem}
#page-career .car-cta-h2 em{font-style:italic;color:var(--gold)}
#page-career .car-cta-desc{font-size:.92rem;line-height:1.82;color:var(--tdim);margin-bottom:1.8rem;max-width:440px}
#page-career .cta-row{display:flex;align-items:center;gap:.9rem;margin-bottom:1rem}
#page-career .cta-icon{width:40px;height:40px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:.95rem;flex-shrink:0}
#page-career .cta-row-label{font-size:.67rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.38);margin-bottom:.18rem}
#page-career .cta-row-val{font-size:.88rem;font-weight:600;color:var(--gold)}
#page-career .car-cta-box{background:rgba(255,255,255,.05);border:1px solid rgba(201,168,76,.15);border-radius:12px;padding:2.2rem}
#page-career .car-cta-box h3{font-family:'EB Garamond',serif;font-size:1.3rem;font-weight:700;color:var(--white);margin-bottom:.5rem}
#page-career .car-cta-box p{font-size:.84rem;color:var(--tdim);line-height:1.7;margin-bottom:1.4rem}
#page-career .cta-submit{width:100%;padding:1rem;border-radius:6px;background:var(--gold);color:var(--navy-deep);font-size:.9rem;font-weight:700;cursor:pointer;border:none;font-family:'Inter',sans-serif;transition:var(--t);margin-bottom:1rem}
#page-career .cta-submit:hover{background:var(--gold-lt)}
#page-career .cta-checklist-hd{font-size:.66rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:.75rem;margin-top:1.2rem;padding-top:1.2rem;border-top:1px solid rgba(255,255,255,.08)}
#page-career .cta-check{display:flex;align-items:center;gap:.55rem;font-size:.82rem;color:rgba(255,255,255,.58);margin-bottom:.4rem}
#page-career .cta-check::before{content:'◆';color:var(--gold);font-size:.55rem;flex-shrink:0}

/* Responsive */
@media(max-width:1024px){
  #page-career .car-why-grid{grid-template-columns:repeat(2,1fr)}
  #page-career .car-steps{grid-template-columns:repeat(2,1fr)}
  #page-career .car-benefits-grid{grid-template-columns:repeat(2,1fr)}
}
@media(max-width:768px){
  #page-career .car-hero-rhs{display:none}
  #page-career .car-why-grid,#page-career .car-culture-grid,#page-career .jc2-body,#page-career .car-steps,#page-career .car-benefits-grid,#page-career .car-cta-inner{grid-template-columns:1fr}
  #page-career .jc2-full{grid-column:1}
  #page-career .jc2-head,#page-career .jc2-body,#page-career .jc2-foot{padding:1.3rem}
  #page-career .jc2-head-row{flex-direction:column}
  #page-career .jc2-foot{flex-direction:column;align-items:flex-start}
}
</style>

  <!-- ══ HERO ══ -->
  <div style="background:var(--navy);padding:88px 5vw 72px;position:relative;overflow:hidden">
    <div style="position:absolute;inset:0;pointer-events:none;background-image:radial-gradient(circle,rgba(201,168,76,.08) 1px,transparent 1px);background-size:48px 48px;z-index:0"></div>
    <div style="position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse 60% 70% at 85% 40%,rgba(201,168,76,.07) 0%,transparent 70%);z-index:0"></div>
    <div style="max-width:1440px;margin:0 auto;position:relative;z-index:1;display:grid;grid-template-columns:1.1fr 0.9fr;gap:5vw;align-items:center">

      <!-- LEFT -->
      <div>
        <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:1.4rem;flex-wrap:wrap">
          <a onclick="go('home')" style="font-size:.7rem;letter-spacing:.09em;text-transform:uppercase;color:var(--gold);cursor:pointer">Home</a>
          <span style="color:rgba(255,255,255,.2);font-size:.7rem">/</span>
          <span style="font-size:.7rem;letter-spacing:.09em;text-transform:uppercase;color:rgba(255,255,255,.35)">Career</span>
        </div>
        <div style="display:inline-flex;align-items:center;gap:.45rem;background:rgba(201,168,76,.14);border:1px solid rgba(201,168,76,.28);color:var(--gold);padding:.3rem .9rem;border-radius:50px;font-size:.72rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:1.2rem">🏛️ &nbsp;Career at V J Desai &amp; Co. LLP</div>
        <h1 style="font-family:'EB Garamond',serif;font-size:clamp(2.2rem,3.8vw,3.5rem);font-weight:700;color:var(--white);line-height:1.12;max-width:640px;margin-bottom:1rem">Build a Career You Are <em style="font-style:italic;color:var(--gold)">Proud Of</em></h1>
        <p style="font-size:.95rem;line-height:1.85;color:rgba(255,255,255,.6);max-width:540px;margin-bottom:1.6rem">Join a distinguished CA firm where learning never stops. Work under experienced partners on real client engagements, GST, Direct Tax, Audit, RERA, FEMA, and Corporate Advisory since 1993.</p>
        <div class="car-hero-badges">
          <span class="car-hero-badge"><span class="chbgold">✦</span> ICAI Registered Firm</span>
          <span class="car-hero-badge"><span class="chbgold">✦</span> Est. 1993 · 33+ Years</span>
          <span class="car-hero-badge"><span class="chbgold">✦</span> Ahmedabad, Gujarat</span>
          <span class="car-hero-badge"><span class="chbgold">✦</span> 2 Positions Open</span>
        </div>
        <div class="car-hero-cta">
          <button class="cbtn-primary" onclick="document.getElementById('car-roles').scrollIntoView({behavior:'smooth'})">View Open Positions ↓</button>
          <button class="cbtn-outline" onclick="openCareerApply()">Send Your CV →</button>
        </div>
        <div class="car-hero-stats">
          <div><div class="chs-num">1993</div><div class="chs-label">Year Founded</div></div>
          <div><div class="chs-num">33+</div><div class="chs-label">Years of Practice</div></div>
          <div><div class="chs-num">2500+</div><div class="chs-label">Clients Served</div></div>
          <div><div class="chs-num">35+</div><div class="chs-label">Industry Sectors</div></div>
        </div>
      </div>

      <!-- RIGHT: quick job previews -->
      <div class="car-hero-rhs">
        <div style="font-size:.67rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:.8rem">Currently Accepting Applications</div>
        <div class="cqcard">
          <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.6rem">
            <div style="width:30px;height:30px;background:rgba(26,82,118,.6);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:.85rem">🎓</div>
            <span style="font-size:.62rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;background:rgba(26,82,118,.2);color:#5dade2;border:1px solid rgba(93,173,226,.25);border-radius:3px;padding:.14rem .55rem">Article Trainee</span>
          </div>
          <h4>CA Articleship Training</h4>
          <p>3-year ICAI practical training across GST, Tax, Audit, RERA, FEMA &amp; Company Law under direct partner mentorship.</p>
          <div class="cqcard-meta">
            <span class="cqctag">CA Foundation / Inter</span>
            <span class="cqctag">ICAI Stipend</span>
            <span class="cqctag">3 Years</span>
          </div>
          <button class="cqapply" onclick="openCareerApply()">Apply Now →</button>
        </div>
        <div class="cqcard">
          <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.6rem">
            <div style="width:30px;height:30px;background:rgba(0,112,112,.5);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:.85rem">💼</div>
            <span style="font-size:.62rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;background:rgba(0,128,128,.15);color:#1abc9c;border:1px solid rgba(26,188,156,.25);border-radius:3px;padding:.14rem .55rem">Full-Time</span>
          </div>
          <h4>Accounts Executive / Accountant</h4>
          <p>Permanent role in bookkeeping, GST filing, TDS compliance and accounts finalization for multiple clients.</p>
          <div class="cqcard-meta">
            <span class="cqctag">B.Com / M.Com</span>
            <span class="cqctag">1–3 Yrs Exp</span>
          </div>
          <button class="cqapply" onclick="openCareerApply()">Apply Now →</button>
        </div>
        <div style="background:rgba(201,168,76,.08);border:1px dashed rgba(201,168,76,.25);border-radius:8px;padding:1rem 1.2rem">
          <p style="font-size:.77rem;color:rgba(255,255,255,.45);line-height:1.7">
            📧 &nbsp;<a href="mailto:info@vjdesai.com" style="color:var(--gold);font-weight:600">info@vjdesai.com</a><br/>
            📞 &nbsp;<a href="tel:+919825062515" style="color:rgba(255,255,255,.55)">+91 98250 62515</a> &nbsp;·&nbsp; Mon–Sat 10am–6pm
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- ══ SECTION 1: WHY JOIN US ══ -->
  <section id="car-why" class="car-sec">
    <div class="car-sec-inner">
      <div class="car-sec-head">
        <div class="stag">Why Choose Us</div>
        <h2 class="ht">Why Build Your Career <em>With Us</em></h2>
        <p class="ssub" style="max-width:620px;margin:0 auto">We are more than a CA firm, a structured learning environment where professionals grow, take real ownership, and build careers that matter.</p>
      </div>
      <div class="car-why-grid">
        <div class="cwcard"><div class="cwicon">📚</div><h3>Multi-Domain Exposure</h3><p>Work across statutory audit, tax audit, GST, direct tax, RERA, FEMA, company law, and corporate advisory, building a rounded profile from day one.</p></div>
        <div class="cwcard"><div class="cwicon">🎓</div><h3>Direct Partner Mentorship</h3><p>Work under CA partners with 30+ years of combined expertise. Get personalised guidance, structured feedback, and real client interaction from the start.</p></div>
        <div class="cwcard"><div class="cwicon">🚀</div><h3>Clear Growth Path</h3><p>We believe in meritocracy. High performers take on client responsibility quickly. A transparent progression framework ensures you always know where you stand.</p></div>
        <div class="cwcard"><div class="cwicon">🏆</div><h3>Real Client Responsibility</h3><p>From early in your career, you handle real client files, not just supporting work. This hands-on approach accelerates learning and builds confidence fast.</p></div>
        <div class="cwcard"><div class="cwicon">⚖️</div><h3>Integrity-First Culture</h3><p>Founded on integrity, reliability, and proficiency. Every team member upholds these values, ethical practice is non-negotiable at every level of the firm.</p></div>
        <div class="cwcard"><div class="cwicon">📍</div><h3>Prime Ahmedabad Office</h3><p>Our office at Ratnaakar Nine Square, Satellite, a modern, well-connected workspace with professional infrastructure and a collaborative, energetic team.</p></div>
      </div>
    </div>
  </section>

</div>

</main>

<!-- SHARED FOOTER (loaded by include.js) -->
<div data-include="../components/footer.html?v=8"></div>

<!-- SITE JS -->
<script src="../assets/js/include.js?v=2"><\/script>
<script src="../assets/js/nav.js?v=3"><\/script>
<script src="../assets/js/main.js"><\/script>
<script src="../assets/js/lock.js?v=2"><\/script>

</body>
</html>\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0`;export{e as default};
