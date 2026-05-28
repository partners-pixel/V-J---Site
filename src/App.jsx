import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import SiteLayout from './layouts/SiteLayout.jsx';
import MigratedHtmlPage from './pages/MigratedHtmlPage.jsx';
import RoutePlaceholder from './pages/RoutePlaceholder.jsx';
import Admin from './pages/Admin.jsx';
import Blog from './pages/Blog.jsx';
import BlogPost from './pages/BlogPost.jsx';
import ChecklistPage from './pages/ChecklistPage.jsx';
import { routeMap } from './data/routes.js';

function LegacyHtmlRedirect() {
  const { file = '' } = useParams();
  const slug = file.replace(/\.html$/i, '');
  const target = slug === 'index' ? '/' : `/${slug}`;
  return <Navigate to={target} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/admin" element={<Admin />} />
        <Route path="/kc-blog" element={<Blog />} />
        <Route path="/kc-blog/:id" element={<BlogPost />} />
        <Route path="/kc-checklist" element={<ChecklistPage />} />
        {routeMap.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<MigratedHtmlPage route={route} />}
          />
        ))}
        <Route path="/pages/:file" element={<LegacyHtmlRedirect />} />
        <Route path="/:file.html" element={<LegacyHtmlRedirect />} />
        <Route path="*" element={<RoutePlaceholder />} />
      </Route>
    </Routes>
  );
}
