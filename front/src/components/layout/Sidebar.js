'use client';
import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import MenuItems from '../ui/MenuItems';
import { FiSun, FiMoon, FiMonitor } from 'react-icons/fi';

const Sidebar = ({ isOpen, isMobile, toggleSidebar }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const { theme, toggleTheme, isDarkMode } = useTheme();
  const darkMode = isDarkMode(true); // true para indicar que é o Sidebar

  // Fecha o menu ao trocar para modo mobile
  useEffect(() => {
    if (isMobile) {
      setActiveMenu(null);
      setActiveSubMenu(null);
    }
  }, [isMobile]);

  const handleMouseEnter = (e) => {
    if (!isMobile && !isOpen && !e.target.closest('.theme-toggle')) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsHovered(false);
      setActiveMenu(null);
      setActiveSubMenu(null);
    }
  };

  const effectiveIsOpen = isOpen || (!isMobile && isHovered);

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 z-30 transition-opacity duration-200 ${
          isMobile && isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      />
      <nav
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`fixed left-0 top-0 h-full transition-all duration-300 z-30 flex flex-col
          ${theme !== 'light' ? 'dark bg-gray-800' : 'bg-white'}
          ${isMobile 
            ? (isOpen ? 'w-full translate-x-0' : '-translate-x-full') 
            : (effectiveIsOpen ? 'w-64' : 'w-20')}`}
      >
        <div className="pt-16 flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <MenuItems 
              isOpen={effectiveIsOpen}
              activeMenu={activeMenu}
              setActiveMenu={setActiveMenu}
              activeSubMenu={activeSubMenu}
              setActiveSubMenu={setActiveSubMenu}
            />
          </div>
        </div>

        <div className="border-t dark:border-gray-700">
          <button
            onClick={toggleTheme}
            className={`theme-toggle flex items-center w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 text-gray-600 dark:text-gray-300 
              ${!effectiveIsOpen && 'justify-center'}`}
          >
            {theme === 'dark' ? (
              <FiSun className="w-5 h-5" />
            ) : theme === 'semi-dark' ? (
              <FiMonitor className="w-5 h-5" />
            ) : (
              <FiMoon className="w-5 h-5" />
            )}
            {effectiveIsOpen && (
              <span className="ml-4 text-gray-700 dark:text-gray-300">
                {theme === 'dark' ? "Light Mode" : theme === 'semi-dark' ? "Dark Mode" : "Semi-Dark"}
              </span>
            )}
          </button>
        </div>
      </nav>
    </>
  );
};

export default Sidebar; 