'use client';
import { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Header 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        toggleSidebar={toggleSidebar}
        isOpen={isOpen}
        isMobile={isMobile}
      />
      
      <Sidebar 
        isOpen={isOpen}
        isMobile={isMobile}
        setIsOpen={setIsOpen}
        toggleSidebar={toggleSidebar}
      />

      <main className={`pt-16 transition-all duration-300 min-h-screen bg-gray-200 dark:bg-gray-900 text-gray-800 dark:text-white
        ${isMobile ? '' : (isOpen ? 'md:pl-64' : 'md:pl-20')}`}>
        <div className="p-4">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout; 