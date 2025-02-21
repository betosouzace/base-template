/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
      // Adicione aqui outros padrões de domínio conforme necessário
      // Por exemplo, para produção:
      {
        protocol: 'https',
        hostname: 'seu-dominio.com',
        pathname: '/storage/**',
      }
    ],
  },
  // ... outras configurações existentes
};

export default nextConfig;
