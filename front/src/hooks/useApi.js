import { useState } from 'react';
import axios from 'axios';
import { API_URL, API_TIMEOUT, API_CONFIG } from '@/config/api';
import { useRouter } from 'next/navigation';

// Criar uma única instância do axios
const api = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  ...API_CONFIG
});

export const useApi = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleResponse = async (promise) => {
    try {
      const response = await promise;
      return {
        data: response.data,
        error: null,
        status: response.status
      };
    } catch (error) {
      console.error('API Error:', error);
      return {
        data: null,
        error: error.response?.data?.message || 'Erro ao processar a requisição',
        status: error.response?.status
      };
    }
  };

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
      
      // Verificar se o login foi bem-sucedido
      if (response.status === 200) {
        // Aguardar cookies serem definidos
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Verificar se o usuário está autenticado
        const userResponse = await api.get('/api/user');
        
        if (userResponse.data) {
          router.push('/home');
          return userResponse.data;
        }
      } else {
        throw new Error('Falha na autenticação');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Erro ao realizar login';
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
    api,
    get: (url) => handleResponse(api.get(url)),
    post: (url, data) => handleResponse(api.post(url, data)),
    put: (url, data) => handleResponse(api.put(url, data)),
    delete: (url) => handleResponse(api.delete(url))
  };
}; 