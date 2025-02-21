'use client';
import Image from 'next/image';
import { DefaultLogo } from './DefaultLogo';
import { DefaultIcon } from './DefaultIcon';
import { useTheme } from '@/contexts/ThemeContext';

export function CompanyLogo({ 
  logoUrl = null, 
  iconUrl = null,
  faviconUrl = null,
  className = "w-auto h-12",
  type = "logo",
  darkClassName = "text-white",
  lightClassName = "text-gray-900"
}) {
  const { theme } = useTheme();
  const color = theme === 'dark' ? "white" : "#111827";

  const getFullUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${process.env.NEXT_PUBLIC_API_URL}/storage/${url}`;
  };

  const renderDefault = () => {
    switch (type) {
      case 'icon':
        return <DefaultIcon className={className} color={color} />;
      case 'favicon':
        return <DefaultIcon className={className} color={color} />;
      default:
        return <DefaultLogo className={className} color={color} />;
    }
  };

  const renderImage = (url) => {
    const dimensions = {
      logo: { width: 200, height: 60 },
      icon: { width: 48, height: 48 },
      favicon: { width: 32, height: 32 }
    };

    const { width, height } = dimensions[type] || dimensions.logo;
    const fullUrl = getFullUrl(url);

    return (
      <div style={{ width, height }} className={`relative ${className}`}>
        <Image
          src={fullUrl}
          alt={`${type} preview`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain"
          priority={type === 'logo'}
        />
      </div>
    );
  };

  const getUrlForType = () => {
    switch (type) {
      case 'icon':
        return iconUrl;
      case 'favicon':
        return faviconUrl;
      default:
        return logoUrl;
    }
  };

  const url = getUrlForType();
  return url ? renderImage(url) : renderDefault();
} 