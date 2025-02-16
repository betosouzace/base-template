import { useState, useEffect, useCallback } from 'react';
import { useApi } from './useApi';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { api } = useApi();
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      const response = await api.get('/api/user');
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const logout = useCallback(async () => {
    try {
      await api.post('/logout');
      setUser(null);
      setIsAuthenticated(false);
      router.push('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }, [api, router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    isAuthenticated,
    isLoading,
    user,
    checkAuth,
    logout
  };
} 