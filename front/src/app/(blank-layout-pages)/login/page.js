'use client';
import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaGoogle, FaFacebook } from "react-icons/fa";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { CompanyLogo } from '@/components/CompanyLogo';
import { useApi } from '@/hooks/useApi';

const Login = () => {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const api = useApi();
  const [branding, setBranding] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);

  useEffect(() => {
    const loadBranding = async () => {
      try {
        const response = await api.get('company/theme', {
          skipAuthRefresh: true,
          withCredentials: false
        });
        
        const { branding } = response.data;
        // Atualiza o branding com as URLs completas
        setBranding({
          ...branding,
          logo: branding.logo ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${branding.logo}` : null,
          icon: branding.icon ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${branding.icon}` : null,
          favicon: branding.favicon ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${branding.favicon}` : null,
        });
        
        document.title = branding.name;
      } catch (error) {
        console.error('Erro ao carregar branding:', error);
      }
    };

    loadBranding();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setApiLoading(true);
      setErrors({});
      
      try {
        const result = await login(email, password, rememberMe);
        if (result.success) {
          setSuccess(true);
        } else {
          setErrors({
            api: result.error
          });
        }
      } catch (error) {
        setErrors({
          api: "Erro ao conectar com o servidor"
        });
      } finally {
        setApiLoading(false);
      }
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${theme === 'dark' ? "bg-gray-900" : "bg-gray-100"}`}>
      <div className={`max-w-md w-full space-y-8 ${theme === 'dark' ? "bg-gray-800" : "bg-white"} p-10 rounded-xl shadow-2xl transition-all duration-300`}>
        <div className="flex justify-end">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {theme === 'dark' ? (
              <MdLightMode className="h-5 w-5 text-gray-300" />
            ) : (
              <MdDarkMode className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>

        <div>
          <div className="flex justify-center mb-8">
            <CompanyLogo 
              logoUrl={branding?.logo}
              className="w-auto h-20"
            />
          </div>
        </div>

        {/* Mensagens de Erro */}
        {errors.api && (
          <div className="mb-4 p-4 rounded-md bg-red-50 border border-red-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {errors.api}
                </h3>
              </div>
            </div>
          </div>
        )}

        {/* Mensagem de Sucesso */}
        {success && (
          <div className="mb-4 p-4 rounded-md bg-green-50 border border-green-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Login realizado com sucesso! Redirecionando...
                </h3>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`appearance-none block w-full pl-10 pr-3 py-2 border ${
                    errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } rounded-md shadow-sm placeholder-gray-400 
                  focus:outline-none focus:ring-primary focus:border-primary
                  dark:bg-gray-700 dark:text-gray-300 dark:placeholder-gray-400
                  text-sm`}
                  placeholder="seu@email.com"
                  required
                />
              </div>
              {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="password">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`appearance-none block w-full pl-10 pr-10 py-2 border ${
                    errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } rounded-md shadow-sm placeholder-gray-400 
                  focus:outline-none focus:ring-primary focus:border-primary
                  dark:bg-gray-700 dark:text-gray-300 dark:placeholder-gray-400
                  text-sm`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                  )}
                </button>
              </div>
              {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
            </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Lembrar-me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-primary hover:text-primary-hover">
                Esqueceu sua senha?
              </a>
            </div>
          </div>

          <div>
            <button 
              type="submit"
              disabled={apiLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                ${success ? 'bg-green-600' : 'bg-indigo-600 hover:bg-indigo-700'} 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                disabled:opacity-50`}
            >
              {apiLoading 
                ? "Entrando..." 
                : success 
                  ? "Redirecionando..." 
                  : "Entrar"}
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${theme === 'dark' ? "border-gray-600" : "border-gray-300"}`}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-2 ${theme === 'dark' ? "bg-gray-800 text-gray-300" : "bg-white text-gray-500"}`}>Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className={`w-full inline-flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium ${theme === 'dark' ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-white text-gray-500 hover:bg-gray-50"} border ${theme === 'dark' ? "border-gray-600" : "border-gray-300"}`}
              >
                <FaGoogle className="w-5 h-5 text-red-500" />
                <span className="ml-2">Google</span>
              </button>
              <button
                type="button"
                className={`w-full inline-flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium ${theme === 'dark' ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-white text-gray-500 hover:bg-gray-50"} border ${theme === 'dark' ? "border-gray-600" : "border-gray-300"}`}
              >
                <FaFacebook className="w-5 h-5 text-blue-600" />
                <span className="ml-2">Facebook</span>
              </button>
            </div>
          </div>

          <div className="text-center">
            <p className={`text-sm ${theme === 'dark' ? "text-gray-300" : "text-gray-600"}`}>
              Don't have an account?{" "}
              <a href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;