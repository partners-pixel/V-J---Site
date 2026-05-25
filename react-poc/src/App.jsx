import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Audit from './pages/Audit.jsx';
import Contact from './pages/Contact.jsx';
import LegacyPage from './pages/LegacyPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Hand-built React pages */}
        <Route index element={<Home />} />
        <Route path="/audit" element={<Audit />} />
        <Route path="/contact" element={<Contact />} />
        {/* Every other page renders from its original markup (phase-3) */}
        <Route path="/:slug" element={<LegacyPage />} />
      </Route>
    </Routes>
  );
}
