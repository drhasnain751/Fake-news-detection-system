import axios from 'axios';

let API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
if (API_BASE && !API_BASE.endsWith('/api')) {
  if (API_BASE.endsWith('/')) {
    API_BASE = API_BASE.slice(0, -1);
  }
  API_BASE = `${API_BASE}/api`;
}

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => Promise.reject(error));

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if not already on login/signup page
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth ───────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// ─── Predictions ─────────────────────────────────────────────────────
export const predictionAPI = {
  analyze: (text) => api.post('/predictions/analyze', { text }),
  getHistory: (params) => api.get('/predictions/history', { params }),
  getAnalytics: () => api.get('/predictions/analytics'),
  delete: (id) => api.delete(`/predictions/${id}`),
};

// ─── Admin ───────────────────────────────────────────────────────────
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  toggleUser: (id) => api.patch(`/admin/users/${id}/toggle`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getAllPredictions: (params) => api.get('/admin/predictions', { params }),
  retrainModel: () => api.post('/admin/retrain'),
  getModelStatus: () => api.get('/admin/model-status'),
};

// ─── Datasets ─────────────────────────────────────────────────────────
export const datasetAPI = {
  getAll: () => api.get('/datasets'),
  upload: (formData) => api.post('/datasets/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/datasets/${id}`),
};

export default api;
