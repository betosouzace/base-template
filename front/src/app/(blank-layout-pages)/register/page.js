'use client';
import { useState } from 'react';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useTheme } from '@/contexts/ThemeContext';
import { useApi } from '@/hooks/useApi';
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { register, loading: apiLoading, error: apiError } = useApi();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!name) {
      newErrors.name = "Name is required";
    }
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
    if (!passwordConfirmation) {
      newErrors.passwordConfirmation = "Password confirmation is required";
    } else if (password !== passwordConfirmation) {
      newErrors.passwordConfirmation = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { data, error } = await register(
      name, 
      email, 
      password, 
      passwordConfirmation
    );
    
    if (error) {
      console.error('Erro no registro:', error);
      // Mostrar mensagem de erro para o usuário
      return;
    }

    if (data) {
      console.log('Registro bem-sucedido:', data);
      router.push('/login');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${theme === 'dark' ? "bg-gray-900" : "bg-gray-100"}`}>
      <div className={`max-w-md w-full space-y-8 ${theme === 'dark' ? "bg-gray-800" : "bg-white"} p-10 rounded-xl shadow-2xl transition-all duration-300`}>
        <div className="flex justify-between items-center">
          <h2 className={`text-3xl font-bold ${theme === 'dark' ? "text-white" : "text-gray-900"}`}>
            Register
          </h2>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {theme === 'dark' ? <MdLightMode className="w-6 h-6 text-yellow-400" /> : <MdDarkMode className="w-6 h-6 text-gray-600" />}
          </button>
        </div>

        {/* Mensagem de Sucesso */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">Registro realizado com sucesso! Redirecionando...</span>
          </div>
        )}

        {/* Mensagem de Erro da API */}
        {errors.api && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{errors.api}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            {/* Nome */}
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="name">Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className={`h-5 w-5 ${theme === 'dark' ? "text-gray-400" : "text-gray-500"}`} />
                </div>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`appearance-none rounded-md relative block w-full pl-10 px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} dark:bg-gray-700 dark:text-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  required
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs italic mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="mb-4">
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
              {errors.email && <p className="text-red-500 text-xs italic mt-1">{errors.email}</p>}
            </div>

            {/* Senha */}
            <div className="mb-4">
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
              {errors.password && <p className="text-red-500 text-xs italic mt-1">{errors.password}</p>}
            </div>

            {/* Confirmação de Senha */}
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="passwordConfirmation">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className={`h-5 w-5 ${theme === 'dark' ? "text-gray-400" : "text-gray-500"}`} />
                </div>
                <input
                  type={showPasswordConfirmation ? "text" : "password"}
                  id="passwordConfirmation"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  className={`appearance-none rounded-md relative block w-full pl-10 pr-10 px-3 py-2 border ${errors.passwordConfirmation ? 'border-red-500' : 'border-gray-300'} dark:bg-gray-700 dark:text-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPasswordConfirmation ? (
                    <FaEyeSlash className={`h-5 w-5 ${theme === 'dark' ? "text-gray-400" : "text-gray-500"} hover:text-gray-600`} />
                  ) : (
                    <FaEye className={`h-5 w-5 ${theme === 'dark' ? "text-gray-400" : "text-gray-500"} hover:text-gray-600`} />
                  )}
                </button>
              </div>
              {errors.passwordConfirmation && <p className="text-red-500 text-xs italic mt-1">{errors.passwordConfirmation}</p>}
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
                ? "Criando conta..." 
                : success 
                  ? "Conta criada com sucesso!" 
                  : "Criar Conta"}
            </button>
          </div>

          <div className="text-center">
            <p className={`text-sm ${theme === 'dark' ? "text-gray-300" : "text-gray-600"}`}>
              Already have an account?{" "}
              <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage; 