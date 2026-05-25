import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Contact from './pages/Contact.jsx';
import LegacyPage from './pages/LegacyPage.jsx';

// Phase-4: reusable real-JSX templates + per-page data
import ServiceTemplate from './templates/ServiceTemplate.jsx';
import GstTemplate from './templates/GstTemplate.jsx';
import KcTemplate from './templates/KcTemplate.jsx';
import auditData from './data/audit.js';
import reraData from './data/rera.js';
import gstData from './data/gst.js';
import kcData from './data/kc.js';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Hand-built React pages */}
        <Route index element={<Home />} />
        <Route path="/contact" element={<Contact />} />

        {/* Phase-4: major templates as real React components */}
        <Route path="/audit" element={<ServiceTemplate data={auditData} />} />
        <Route path="/rera" element={<ServiceTemplate data={reraData} />} />
        <Route path="/gst" element={<GstTemplate data={gstData} />} />
        <Route path="/kc" element={<KcTemplate data={kcData} />} />

        {/* Every other page renders from its original markup (phase-3) */}
        <Route path="/:slug" element={<LegacyPage />} />
      </Route>
    </Routes>
  );
}
