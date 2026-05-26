import { useEffect } from 'react';

const SUFFIX = 'V J Desai & Co. LLP';

// Set <title> per route (lightweight SEO without extra deps).
export default function useDocTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${SUFFIX}` : `${SUFFIX} | Chartered Accountants`;
  }, [title]);
}
