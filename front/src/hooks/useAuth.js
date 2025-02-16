import { useState, useEffect } from 'react';
import { useApi } from './useApi';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { api } = useApi();

  const checkAuth = async () => {
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
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return {
    isAuthenticated,
    isLoading,
    user,
    checkAuth
  };
} 