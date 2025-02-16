'use client';
import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

const RegisterPage = () => {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    // Implementar lógica de registro aqui
    console.log('Register:', { email, password, confirmPassword });
  };

  return (
    <div className={`flex items-center justify-center min-h-screen ${theme === 'dark' ? "bg-gray-900" : "bg-gray-100"}`}>
      <form onSubmit={handleRegister} className={`p-6 rounded-lg shadow-md w-96 ${theme === 'dark' ? "bg-gray-800" : "bg-white"}`}>
        <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? "text-white" : "text-gray-800"}`}>Register</h2>
        <div className="mb-4">
          <label className={`block mb-2 ${theme === 'dark' ? "text-gray-300" : "text-gray-700"}`} htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full p-2 border rounded-lg ${theme === 'dark' ? "border-gray-600 bg-gray-700 text-gray-300" : "border-gray-300"}`}
            required
          />
        </div>
        <div className="mb-4">
          <label className={`block mb-2 ${theme === 'dark' ? "text-gray-300" : "text-gray-700"}`} htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full p-2 border rounded-lg ${theme === 'dark' ? "border-gray-600 bg-gray-700 text-gray-300" : "border-gray-300"}`}
            required
          />
        </div>
        <div className="mb-4">
          <label className={`block mb-2 ${theme === 'dark' ? "text-gray-300" : "text-gray-700"}`} htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full p-2 border rounded-lg ${theme === 'dark' ? "border-gray-600 bg-gray-700 text-gray-300" : "border-gray-300"}`}
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPage; 