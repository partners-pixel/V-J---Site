// Shared admin auth + fetch helpers.
const KEY = 'vjd_admin_key';
export const getKey = () => localStorage.getItem(KEY) || '';
export const setKey = (k) => localStorage.setItem(KEY, k);
export const clearKey = () => localStorage.removeItem(KEY);

export async function authFetch(url, opts = {}) {
  return fetch(url, { ...opts, headers: { ...(opts.headers || {}), 'x-admin-key': getKey() } });
}

export const fmtDate = (iso) => {
  try { return new Date(iso).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }); }
  catch { return ''; }
};
