import { Link } from 'react-router-dom';
import useDocTitle from '../lib/useDocTitle.js';

export default function NotFound() {
  useDocTitle('Page Not Found');
  return (
    <div className="ph"><div className="phi">
      <div className="bc"><Link to="/">Home</Link><span>/</span><span>404</span></div>
      <div className="pgbadge">404</div>
      <h1>Page <em>Not Found</em></h1>
      <p>The page you’re looking for doesn’t exist or may have moved.</p>
      <div className="ph-ctas"><Link className="ph-cta" to="/">← Back to Home</Link></div>
    </div></div>
  );
}
