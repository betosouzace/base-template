'use client';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Accept': 'application/json'
  }
});

// Adiciona o token no header de todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Adiciona Content-Type apenas se não for FormData
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }
  
  return config;
});

// Interceptor de resposta para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      
      if (!window.location.pathname.includes('/login')) {
        const currentPath = encodeURIComponent(window.location.pathname);
        window.location.href = `/login?redirectUrl=${currentPath}`;
      }
    }
    return Promise.reject(error);
  }
);

export function useApi() {
  const setToken = (token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  };

  return {
    ...api,
    setToken
  };
} 