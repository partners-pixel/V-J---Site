import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const toPath = (slug) => (slug === 'home' || slug === 'index' ? '/' : '/' + slug);

/* Renders a chunk of raw page HTML (legacy markup or an admin override),
   with internal "<a href='x.html'>" links and inline go('x') handlers
   rewired to client-side navigation. */
export default function RawHtml({ html }) {
  const navigate = useNavigate();

  useEffect(() => {
    const go = (s) => navigate(toPath(s));
    window.go = go;
    return () => { if (window.go === go) delete window.go; };
  }, [navigate]);

  const onClick = (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href') || '';
    if (/\.html(\?|#|$)/i.test(href)) {
      e.preventDefault();
      const file = href.split('/').pop().split(/[?#]/)[0].replace(/\.html$/i, '');
      navigate(toPath(file));
    }
  };

  return <div onClickCapture={onClick} dangerouslySetInnerHTML={{ __html: html }} />;
}
