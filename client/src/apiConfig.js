// Base API URL for connecting the frontend to the backend.
// In development, it defaults to http://localhost:5000 (our local backend).
// When deploying to production (e.g. Vercel), set the VITE_API_BASE_URL environment variable.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default API_BASE_URL;
