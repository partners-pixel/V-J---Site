import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Contact from './pages/Contact.jsx';
import Blog from './pages/Blog.jsx';
import Admin from './pages/Admin.jsx';
import LegacyPage from './pages/LegacyPage.jsx';
import NotFound from './pages/NotFound.jsx';
import EditablePage from './components/EditablePage.jsx';

// Phase-4: reusable real-JSX templates + per-page data
import ServiceTemplate from './templates/ServiceTemplate.jsx';
import GstTemplate from './templates/GstTemplate.jsx';
import KcTemplate from './templates/KcTemplate.jsx';
import auditData from './data/audit.js';
import reraData from './data/rera.js';
import gstData from './data/gst.js';
import kcData from './data/kc.js';
import reraSub from './data/reraSub.js';
import auto from './data/auto.js';

// GST-template sub-pages keyed by slug (RERA hand-built + auto-extracted families)
const gstPages = { ...reraSub, ...auto };

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Hand-built React pages (wrapped so an admin content override can replace them) */}
        <Route index element={<EditablePage slug="home"><Home /></EditablePage>} />
        <Route path="/contact" element={<EditablePage slug="contact"><Contact /></EditablePage>} />

        {/* Phase-4: major templates as real React components */}
        <Route path="/audit" element={<EditablePage slug="audit"><ServiceTemplate data={auditData} /></EditablePage>} />
        <Route path="/rera" element={<EditablePage slug="rera"><ServiceTemplate data={reraData} /></EditablePage>} />
        <Route path="/gst" element={<EditablePage slug="gst"><GstTemplate data={gstData} /></EditablePage>} />
        <Route path="/kc" element={<EditablePage slug="kc"><KcTemplate data={kcData} /></EditablePage>} />
        <Route path="/kc-blog" element={<EditablePage slug="kc-blog"><Blog /></EditablePage>} />
        <Route path="/admin" element={<Admin />} />

        {/* Phase-5: sub-pages on the GST template (data-driven) */}
        {Object.entries(gstPages).map(([slug, data]) => (
          <Route key={slug} path={`/${slug}`} element={<EditablePage slug={slug}><GstTemplate data={data} /></EditablePage>} />
        ))}

        {/* Every other page renders from its original markup (phase-3) */}
        <Route path="/:slug" element={<LegacyPage />} />
        {/* Unmatched (multi-segment) paths */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
