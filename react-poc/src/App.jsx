import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Audit from './pages/Audit.jsx';
import Contact from './pages/Contact.jsx';
import Placeholder from './pages/Placeholder.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/audit" element={<Audit />} />
        <Route path="/contact" element={<Contact />} />
        {/* Every other nav/footer slug resolves to a stub for the POC */}
        <Route path="/:slug" element={<Placeholder />} />
      </Route>
    </Routes>
  );
}
