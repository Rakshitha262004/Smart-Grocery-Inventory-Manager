import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const registerUser  = (data) => API.post('/auth/register', data);
export const loginUser     = (data) => API.post('/auth/login', data);
export const getItems      = ()     => API.get('/grocery');
export const addItem       = (data) => API.post('/grocery', data);
export const updateItem    = (id, data) => API.put(`/grocery/${id}`, data);
export const deleteItem    = (id)   => API.delete(`/grocery/${id}`);
export const updateQty     = (id, change) => API.patch(`/grocery/${id}/qty`, { change });
export const getDashboard  = ()     => API.get('/dashboard/summary');