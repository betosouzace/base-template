'use client';
import { useState, useEffect } from 'react';
import { FiMenu, FiChevronLeft, FiX } from 'react-icons/fi';
import SearchDialog from '../ui/SearchDialog';
import NotificationsMenu from '../ui/NotificationsMenu';
import UserMenu from '../ui/UserMenu';
import { CompanyLogo } from '../CompanyLogo';
import { DefaultIcon } from '../DefaultIcon';
import { useApi } from '@/hooks/useApi';
import { useTheme } from '@/contexts/ThemeContext';

const Header = ({ searchQuery, setSearchQuery, toggleSidebar, isOpen, isMobile }) => {
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [branding, setBranding] = useState(null);
  const api = useApi();
  const { theme } = useTheme();

  useEffect(() => {
    const loadBranding = async () => {
      try {
        const response = await api.get('company/theme', {
          skipAuthRefresh: true,
          withCredentials: false
        });
        
        const { branding } = response.data;
        // Atualiza o branding com as URLs completas
        setBranding({
          ...branding,
          logo: branding.logo ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${branding.logo}` : null,
          icon: branding.icon ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${branding.icon}` : null,
          favicon: branding.favicon ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${branding.favicon}` : null,
        });
      } catch (error) {
        console.error('Erro ao carregar branding:', error);
      }
    };

    loadBranding();
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 shadow-sm z-40">
      <div className="max-w-[1920px] mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={toggleSidebar}
            aria-label="Toggle Menu"
          >
            {isMobile ? (
              isOpen ? (
                <FiX className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              ) : (
                <FiMenu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              )
            ) : (
              <FiChevronLeft
                className={`w-6 h-6 text-gray-600 dark:text-gray-300 transition-transform duration-300 ${!isOpen ? "rotate-180" : ""}`}
              />
            )}
          </button>

          {/* Ícone da empresa (apenas mobile) */}
          {isMobile && (
            branding?.icon ? (
              <CompanyLogo
                iconUrl={branding.icon}
                type="icon"
                className="w-14 h-14"
              />
            ) : (
              <div className="w-14 h-14 flex items-center justify-center">
                <DefaultIcon className="text-white" />
              </div>
            )
          )}

          {/* Logo da empresa (apenas desktop) */}
          <div className="hidden md:block">
            <CompanyLogo
              logoUrl={branding?.logo}
              className="w-auto h-14"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <SearchDialog
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showDialog={showSearchDialog}
            setShowDialog={setShowSearchDialog}
          />
          <NotificationsMenu
            show={showNotifications}
            setShow={setShowNotifications}
            setShowUserMenu={setShowUserMenu}
          />
          <UserMenu
            show={showUserMenu}
            setShow={setShowUserMenu}
            setShowNotifications={setShowNotifications}
          />
        </div>
      </div>
    </div>
  );
};

export default Header; 