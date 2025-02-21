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
      // Adicione também a configuração para produção se necessário
      // {
      //   protocol: 'https',
      //   hostname: 'seu-dominio-de-producao.com',
      //   pathname: '/storage/**',
      // },
    ],
  },
  // ... outras configurações existentes
};

export default nextConfig;
