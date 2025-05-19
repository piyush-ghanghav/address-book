import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const contactService = {
  getAll: () => api.get('/contacts'),
  delete: (id) => api.delete(`/contacts/${id}`),
  update: (id, data) => api.put(`/contacts/${id}`, data),
  create: (data) => api.post('/contacts', data)
};