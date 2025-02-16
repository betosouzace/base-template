'use client';
import { useState, useRef } from 'react';
import { FiMenu, FiChevronLeft, FiX } from 'react-icons/fi';
import SearchDialog from '../ui/SearchDialog';
import NotificationsMenu from '../ui/NotificationsMenu';
import UserMenu from '../ui/UserMenu';

const Header = ({ searchQuery, setSearchQuery, toggleSidebar, isOpen, isMobile }) => {
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
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
                className={`w-6 h-6 text-gray-600 dark:text-gray-300 transition-transform duration-300 ${
                  !isOpen ? "rotate-180" : ""
                }`}
              />
            )}
          </button>
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
            D
          </div>
          <h1 className="font-bold text-xl hidden md:block text-gray-800 dark:text-white">
            Dashboard
          </h1>
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