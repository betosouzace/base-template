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

  const renderImage = (url) => {
    const dimensions = {
      logo: { width: 200, height: 60 },
      icon: { width: 48, height: 48 },
      favicon: { width: 32, height: 32 }
    };

    const { width, height } = dimensions[type] || dimensions.logo;

    if (!url) {
      return type === 'icon' ? (
        <DefaultIcon className={theme === 'dark' ? darkClassName : lightClassName} />
      ) : (
        <DefaultLogo className={theme === 'dark' ? darkClassName : lightClassName} />
      );
    }

    return (
      <div style={{ width, height }} className={`relative flex items-center ${className}`}>
        <Image
          src={url}
          alt={`${type} preview`}
          width={width}
          height={height}
          style={{ objectFit: 'contain' }}
          onError={(e) => {
            e.target.onerror = null;
            type === 'icon' ? 
              e.target.parentNode.replaceChild(<DefaultIcon className={theme === 'dark' ? darkClassName : lightClassName} />, e.target) :
              e.target.parentNode.replaceChild(<DefaultLogo className={theme === 'dark' ? darkClassName : lightClassName} />, e.target);
          }}
          unoptimized={true}
          className={`${className} object-contain`}
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