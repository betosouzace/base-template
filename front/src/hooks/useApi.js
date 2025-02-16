import { useState } from 'react';
import axios from 'axios';
import { API_URL, API_TIMEOUT } from '@/config/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  withCredentials: true, // Importante para CSRF e autenticação
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
      
      // Obtém o cookie CSRF
      await api.get('/sanctum/csrf-cookie');
      
      // Faz login
      const response = await api.post('/login', { email, password });
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
      
      await api.get('/sanctum/csrf-cookie');
      const response = await api.post('/register', {
        name,
        email,
        password,
        password_confirmation
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

  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      setError(null);
      
      await api.get('/sanctum/csrf-cookie');
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
      
      await api.get('/sanctum/csrf-cookie');
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
    logout
  };
} 