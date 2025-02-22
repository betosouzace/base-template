'use client';
import { useState, useEffect } from "react";
import { FaEnvelope, FaGoogle, FaFacebook } from "react-icons/fa";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { CompanyLogo } from '@/components/CompanyLogo';
import { useApi } from '@/hooks/useApi';

// Importando componentes UI
import { Input } from '@/components/ui/Input';
import { Password } from '@/components/ui/Password';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';

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
        // Usa as URLs completas retornadas pela API
        setBranding(branding);
        
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
          <Button
            variant="ghost"
            onClick={() => toggleTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2"
          >
            {theme === 'dark' ? (
              <MdLightMode className="h-5 w-5 text-gray-300" />
            ) : (
              <MdDarkMode className="h-5 w-5 text-gray-600" />
            )}
          </Button>
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
            <Input
              id="email"
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              icon={FaEnvelope}
              error={errors.email}
              required
              fullWidth
            />

            <Password
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              error={errors.password}
              required
              fullWidth
            />
          </div>

          <div className="flex items-center justify-between mt-6">
            <Checkbox
              id="remember-me"
              label="Lembrar-me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />

            <div className="text-sm">
              <a href="#" className="font-medium text-[var(--primary-color)] hover:text-[var(--primary-color-hover)]">
                Esqueceu sua senha?
              </a>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={apiLoading}
            disabled={apiLoading || success}
          >
            {apiLoading ? "Entrando..." : success ? "Redirecionando..." : "Entrar"}
          </Button>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${theme === 'dark' ? "border-gray-600" : "border-gray-300"}`}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-2 ${theme === 'dark' ? "bg-gray-800 text-gray-300" : "bg-white text-gray-500"}`}>
                  Ou continue com
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                variant="secondary"
                onClick={() => {}}
                className="inline-flex justify-center"
              >
                <FaGoogle className="w-5 h-5 text-red-500 mr-2" />
                Google
              </Button>
              
              <Button
                variant="secondary"
                onClick={() => {}}
                className="inline-flex justify-center"
              >
                <FaFacebook className="w-5 h-5 text-blue-600 mr-2" />
                Facebook
              </Button>
            </div>
          </div>

          <div className="text-center">
            <p className={`text-sm ${theme === 'dark' ? "text-gray-300" : "text-gray-600"}`}>
              Não tem uma conta?{" "}
              <a href="/register" className="font-medium text-[var(--primary-color)] hover:text-[var(--primary-color-hover)]">
                Cadastre-se
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;