'use client';
import { useRef, useEffect } from 'react';
import { FiBell, FiInbox } from 'react-icons/fi';
import { IoCheckmarkDone } from "react-icons/io5";

const NotificationsMenu = ({ show, setShow, setShowUserMenu }) => {
  const notificationRef = useRef(null);
  const buttonRef = useRef(null);

  const notifications = [
    { id: 1, title: "New message", time: "5m ago", read: false },
    { id: 2, title: "System update", time: "1h ago", read: false },
    { id: 3, title: "Welcome aboard!", time: "1d ago", read: true }
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && show) {
        setShow(false);
      }
    };

    const handleClickOutside = (e) => {
      if (
        show && 
        notificationRef.current && 
        !notificationRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) {
        setShow(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show, setShow]);

  const handleMarkAllAsRead = () => {
    // Implementar lógica para marcar todas como lidas
    console.log('Marcar todas como lidas');
  };

  const handleViewAll = () => {
    // Implementar navegação para página de notificações
    console.log('Ver todas as notificações');
  };

  return (
    <>
      <button 
        ref={buttonRef}
        className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
        onClick={() => {
          setShowUserMenu(false);
          setShow(!show);
        }}
      >
        <FiBell className="w-5 h-5" />
        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>

      {show && (
        <div 
          ref={notificationRef}
          className="fixed md:absolute right-0 md:right-2 top-[4.5rem] w-full md:w-80 bg-white dark:bg-gray-800 md:rounded-lg shadow-xl z-50 max-h-[calc(100vh-6rem)] flex flex-col"
        >
          <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 dark:text-white">Notificações</h3>
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleMarkAllAsRead}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400 transition-colors"
                title="Marcar todas como lidas"
              >
                <IoCheckmarkDone className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto flex-1">
            <div className="divide-y dark:divide-gray-700">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className="flex items-start p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      {!notification.read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                      )}
                      <p className="font-medium text-gray-800 dark:text-white truncate">
                        {notification.title}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {notification.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 border-t dark:border-gray-700">
            <button
              onClick={handleViewAll}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-300 transition-colors"
            >
              <FiInbox className="w-4 h-4" />
              <span>Ver todas as notificações</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationsMenu; 