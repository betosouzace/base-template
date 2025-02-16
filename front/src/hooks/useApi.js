import { useState } from 'react';
import axios from 'axios';
import { API_URL, API_TIMEOUT, API_CONFIG } from '@/config/api';

// Criar uma única instância do axios
const api = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  ...API_CONFIG
});

// Função para obter o token CSRF
const getCsrfToken = async () => {
  try {
    await axios.get(`${API_URL}/sanctum/csrf-cookie`, {
      withCredentials: true
    });
    // Aguarda um momento para garantir que o cookie foi definido
    await new Promise(resolve => setTimeout(resolve, 100));
  } catch (error) {
    console.error('Erro ao obter CSRF token:', error);
    throw error;
  }
};

// Interceptor para adicionar o token CSRF
api.interceptors.request.use(async (config) => {
  // Obtém o token CSRF do cookie
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];

  if (!token) {
    await getCsrfToken();
  }

  // Obtém o token novamente após a requisição do CSRF
  const updatedToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];

  if (updatedToken) {
    config.headers['X-XSRF-TOKEN'] = decodeURIComponent(updatedToken);
  }

  return config;
});

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleError = (error) => {
    if (error.response?.status === 422) {
      // Erros de validação
      const validationErrors = error.response.data.errors;
      return Object.values(validationErrors).flat()[0];
    }
    return error.response?.data?.message || 'Ocorreu um erro inesperado';
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/login', { email, password });
      
      // O Laravel Sanctum já configura o cookie automaticamente
      return response.data;
    } catch (err) {
      const message = handleError(err);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, password_confirmation) => {
    try {
      setLoading(true);
      setError(null);
      
      // Garante que temos um token CSRF antes de fazer a requisição
      await getCsrfToken();
      
      const response = await api.post('/register', {
        name,
        email,
        password,
        password_confirmation
      });
      
      // Aguarda um momento para garantir que os cookies foram definidos
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return response.data;
    } catch (err) {
      console.error('Erro completo:', err);
      const message = handleError(err);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/forgot-password', { email });
      return response.data;
    } catch (err) {
      const message = handleError(err);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email, password, password_confirmation, token) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/reset-password', {
        email,
        password,
        password_confirmation,
        token
      });
      return response.data;
    } catch (err) {
      const message = handleError(err);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/logout');
      return response.data;
    } catch (err) {
      const message = handleError(err);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    login,
    register,
    forgotPassword,
    resetPassword,
    logout,
    api
  };
} 