'use client';
import { useRef, useEffect } from 'react';
import { FiUser, FiSettings, FiLogOut } from 'react-icons/fi';

const UserMenu = ({ show, setShow, setShowNotifications }) => {
  const userMenuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && show) {
        setShow(false);
      }
    };

    const handleClickOutside = (e) => {
      if (
        show && 
        userMenuRef.current && 
        !userMenuRef.current.contains(e.target) &&
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

  const userMenuItems = [
    { title: "Profile", icon: <FiUser />, action: () => {} },
    { title: "Settings", icon: <FiSettings />, action: () => {} },
    { title: "Logout", icon: <FiLogOut />, action: () => {} }
  ];

  return (
    <>
      <div 
        ref={buttonRef}
        className="flex items-center space-x-3 cursor-pointer"
        onClick={() => {
          setShowNotifications(false);
          setShow(!show);
        }}
      >
        <svg 
          width="32" 
          height="32" 
          className="rounded-full bg-blue-500"
          viewBox="0 0 32 32"
        >
          <text 
            x="50%" 
            y="50%" 
            dominantBaseline="middle" 
            textAnchor="middle" 
            fill="white" 
            fontSize="14"
            fontWeight="500"
          >
            JD
          </text>
        </svg>
        <div className="hidden md:block">
          <p className="text-sm font-medium text-gray-800 dark:text-white">John Doe</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
        </div>
      </div>

      {show && (
        <div 
          ref={userMenuRef}
          className="fixed md:absolute right-0 md:right-2 top-[4.5rem] w-full md:w-56 bg-white dark:bg-gray-800 md:rounded-lg shadow-xl z-50 max-h-[calc(100vh-6rem)]"
        >
          <div className="md:hidden p-4 border-b dark:border-gray-700">
            <p className="font-medium text-gray-800 dark:text-white">John Doe</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Admin</p>
          </div>

          <div className="p-3 space-y-1">
            {userMenuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="flex items-center w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 transition-colors"
              >
                <span className="text-gray-600 dark:text-gray-400">{item.icon}</span>
                <span className="ml-3">{item.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default UserMenu; 