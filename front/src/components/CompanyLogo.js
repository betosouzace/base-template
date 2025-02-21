'use client';
import Image from 'next/image';
import { DefaultLogo } from './DefaultLogo';
import { useTheme } from '@/contexts/ThemeContext';

export function CompanyLogo({ 
  logoUrl = null, 
  className = "w-auto h-12",
  darkClassName = "text-white",
  lightClassName = "text-gray-900"
}) {
  const { theme } = useTheme();
  
  if (logoUrl) {
    return (
      <Image
        src={logoUrl.startsWith('http') 
          ? logoUrl 
          : `${process.env.NEXT_PUBLIC_API_URL}/storage/${logoUrl}`}
        alt="Logo"
        width={200}
        height={60}
        className={className}
      />
    );
  }

  return (
    <DefaultLogo 
      className={className} 
      color={theme === 'dark' ? "white" : "#111827"}
    />
  );
} 