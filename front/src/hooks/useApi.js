'use client';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Limpa ambos os storages em caso de erro de autenticação
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      
      // Redireciona apenas se não estiver já na página de login
      if (!window.location.pathname.includes('/login')) {
        const currentPath = encodeURIComponent(window.location.pathname);
        // window.location.href = `/login?redirectUrl=${currentPath}`;
        router.push('/login?redirectUrl=${currentPath}');
      }
    }
    return Promise.reject(error);
  }
);

export const useApi = () => {
  return api;
}; 