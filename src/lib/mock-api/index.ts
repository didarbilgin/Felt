// Central export for all mock API services
// When connecting to real FastAPI backend, replace these imports

export { articlesApi } from './articles';
export { programsApi } from './programs';
export { eventsApi } from './events';
export { blogApi } from './blog';
export { contactApi } from './contact';
export { authApi } from './auth';

// API base URL for future FastAPI integration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
