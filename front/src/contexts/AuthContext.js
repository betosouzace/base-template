'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApi } from '@/hooks/useApi';
import { toast } from 'react-hot-toast';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const api = useApi();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) {
        api.setToken(token);
        const response = await api.get('me');
        setUser(response.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      api.setToken(null);
      setIsAuthenticated(false);
      setUser(null);
      
      if (window.location.pathname !== '/login') {
        const currentPath = encodeURIComponent(window.location.pathname);
        router.replace(`/login?redirectUrl=${currentPath}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password, remember = false) => {
    try {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      api.setToken(null);

      const response = await api.post('login', { 
        email, 
        password,
        remember 
      });
      
      const { token, user } = response.data;
      
      api.setToken(token);
      
      setUser(user);
      setIsAuthenticated(true);
      
      if (remember) {
        localStorage.setItem('token', token);
      } else {
        sessionStorage.setItem('token', token);
      }
      
      const redirectUrl = searchParams.get('redirectUrl');
      
      if (!user.company_id) {
        router.replace('/wizard');
      } else if (redirectUrl) {
        router.replace(decodeURIComponent(redirectUrl));
      } else {
        router.replace('/dashboard');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Erro no login:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });

      let errorMessage = 'Erro ao fazer login';

      if (error.response?.status === 401) {
        errorMessage = 'Email ou senha incorretos';
      } else if (error.response?.status === 429) {
        errorMessage = 'Muitas tentativas. Tente novamente mais tarde.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      return { 
        success: false, 
        error: errorMessage 
      };
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateUserAfterWizard = (userData) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoading, 
      login, 
      logout,
      updateUserAfterWizard 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 