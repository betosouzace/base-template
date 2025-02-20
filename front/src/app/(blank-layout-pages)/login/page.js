'use client';
import { useState } from "react";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaGoogle, FaFacebook } from "react-icons/fa";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const router = useRouter();
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);

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
      try {
        const credentials = {
          email,
          password,
          remember: rememberMe
        };
        
        const loginSuccess = await login(credentials);
        if (loginSuccess) {
          setSuccess(true);
          setErrors({});
          setTimeout(() => {
            window.location.href = '/home';
          }, 1500);
        } else {
          setErrors(prev => ({
            ...prev,
            api: "Credenciais inválidas"
          }));
        }
      } catch (error) {
        setErrors(prev => ({
          ...prev,
          api: error.message || "Erro ao realizar login"
        }));
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
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {theme === 'dark' ? <MdLightMode className="w-6 h-6 text-yellow-400" /> : <MdDarkMode className="w-6 h-6 text-gray-600" />}
          </button>
        </div>

        <div>
          <h2 className={`mt-6 text-center text-3xl font-extrabold ${theme === 'dark' ? "text-white" : "text-gray-900"}`}>
            Sign in to your account
          </h2>
        </div>

        {success && (
          <div className="mb-4 p-3 rounded bg-green-100 text-green-600">
            Login realizado com sucesso! Redirecionando...
          </div>
        )}

        {errors.api && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-600">
            {errors.api}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="email">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className={`h-5 w-5 ${theme === 'dark' ? "text-gray-400" : "text-gray-500"}`} />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`appearance-none rounded-md relative block w-full pl-10 px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} dark:bg-gray-700 dark:text-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  required
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="password">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className={`h-5 w-5 ${theme === 'dark' ? "text-gray-400" : "text-gray-500"}`} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`appearance-none rounded-md relative block w-full pl-10 pr-10 px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} dark:bg-gray-700 dark:text-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <FaEyeSlash className={`h-5 w-5 ${theme === 'dark' ? "text-gray-400" : "text-gray-500"} hover:text-gray-600`} />
                  ) : (
                    <FaEye className={`h-5 w-5 ${theme === 'dark' ? "text-gray-400" : "text-gray-500"} hover:text-gray-600`} />
                  )}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs italic">{errors.password}</p>}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember-me" className={`ml-2 block text-sm ${theme === 'dark' ? "text-gray-300" : "text-gray-900"}`}>
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button 
              type="submit" 
              disabled={apiLoading || success}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                ${success 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-indigo-600 hover:bg-indigo-700'} 
                focus:outline-none focus:ring-2 focus:ring-offset-2 
                ${success ? 'focus:ring-green-500' : 'focus:ring-indigo-500'} 
                disabled:opacity-50`}
            >
              {apiLoading 
                ? "Entrando..." 
                : success 
                  ? "Login realizado!" 
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