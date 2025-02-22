'use client';
import { useState } from 'react';
import { FaEnvelope, FaUser } from "react-icons/fa";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'next/navigation';
import { useApi } from '@/hooks/useApi';

// Importando componentes UI
import { Input } from '@/components/ui/Input';
import { Password } from '@/components/ui/Password';
import { Button } from '@/components/ui/Button';

const RegisterPage = () => {
  const router = useRouter();
  const api = useApi();
  const { theme, toggleTheme } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!name) {
      newErrors.name = "Nome é obrigatório";
    }
    if (!email) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Por favor, insira um email válido";
    }
    if (!password) {
      newErrors.password = "Senha é obrigatória";
    } else if (password.length < 6) {
      newErrors.password = "A senha deve ter pelo menos 6 caracteres";
    }
    if (!passwordConfirmation) {
      newErrors.passwordConfirmation = "Confirmação de senha é obrigatória";
    } else if (password !== passwordConfirmation) {
      newErrors.passwordConfirmation = "As senhas não coincidem";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setApiLoading(true);
    try {
      const response = await api.post('/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation
      });

      if (response.data) {
        setSuccess(true);
        setErrors({});
        
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      }
    } catch (err) {
      console.error('Erro no registro:', err);
      setErrors(prev => ({
        ...prev,
        api: err.response?.data?.message || 'Ocorreu um erro durante o registro. Tente novamente.'
      }));
    } finally {
      setApiLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${theme === 'dark' ? "bg-gray-900" : "bg-gray-100"}`}>
      <div className={`max-w-md w-full space-y-8 ${theme === 'dark' ? "bg-gray-800" : "bg-white"} p-10 rounded-xl shadow-2xl transition-all duration-300`}>
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Criar Conta
          </h2>
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

        {/* Mensagem de Sucesso */}
        {success && (
          <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 text-green-800 dark:text-green-200 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">Registro realizado com sucesso! Redirecionando...</span>
          </div>
        )}

        {/* Mensagem de Erro da API */}
        {errors.api && (
          <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-200 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{errors.api}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-6">
            <Input
              label="Nome"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={FaUser}
              error={errors.name}
              required
              fullWidth
            />

            <Input
              label="Email"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={FaEnvelope}
              error={errors.email}
              required
              fullWidth
            />

            <Password
              label="Senha"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              required
              fullWidth
            />

            <Password
              label="Confirmar Senha"
              id="passwordConfirmation"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              error={errors.passwordConfirmation}
              required
              fullWidth
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={apiLoading}
            disabled={apiLoading || success}
          >
            {apiLoading 
              ? "Criando conta..." 
              : success 
                ? "Conta criada com sucesso!" 
                : "Criar Conta"}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Já tem uma conta?{" "}
              <a href="/login" className="font-medium text-[var(--primary-color)] hover:text-[var(--primary-color-hover)]">
                Entrar
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage; 