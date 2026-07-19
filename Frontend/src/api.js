// Central API base URL — set once, used everywhere.
// Production (Railway):  set VITE_API_URL=https://your-backend.up.railway.app  as a build variable
// Local dev:             VITE_DB_HOST=localhost:3000 still works (backward compat)
const API_BASE =
    import.meta.env.VITE_API_URL ||
    (import.meta.env.VITE_DB_HOST
        ? `http://${import.meta.env.VITE_DB_HOST}`
        : 'http://localhost:3000');

export default API_BASE;
