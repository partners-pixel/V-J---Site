import { useEffect, useState } from 'react';
import RawHtml from './RawHtml.jsx';

/* Wraps a page: if the admin has saved a content override for this slug,
   render that HTML instead of the default page. Otherwise render `children`. */
export default function EditablePage({ slug, children }) {
  const [override, setOverride] = useState(undefined); // undefined=loading, null=none, string=html

  useEffect(() => {
    let alive = true;
    fetch(`/api/page-content/${slug}`)
      .then((r) => r.json())
      .then((d) => { if (alive) setOverride(d.html || null); })
      .catch(() => { if (alive) setOverride(null); });
    return () => { alive = false; };
  }, [slug]);

  if (typeof override === 'string' && override.trim()) return <RawHtml html={override} />;
  return children;
}
