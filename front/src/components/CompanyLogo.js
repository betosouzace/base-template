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
    const defaultClasses = `${className} ${theme === 'dark' ? darkClassName : lightClassName}`;
    
    switch (type) {
      case 'icon':
      case 'favicon':
        return (
          <div className={defaultClasses}>
            <DefaultIcon color={color} className="w-full h-full" />
          </div>
        );
      default:
        return (
          <div className={defaultClasses}>
            <DefaultLogo color={color} className="w-full h-full" />
          </div>
        );
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

    if (!fullUrl) {
      return renderDefault();
    }

    return (
      <div style={{ width, height }} className={`relative ${className}`}>
        <Image
          src={fullUrl}
          alt={`${type} preview`}
          fill
          style={{ objectFit: 'contain' }}
          onError={() => renderDefault()}
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
  return renderImage(url);
} 