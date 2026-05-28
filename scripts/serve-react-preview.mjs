// Serve the production React build through Express so admin/API routes work.
process.env.PORT ||= '4174';

await import('../server.js');
