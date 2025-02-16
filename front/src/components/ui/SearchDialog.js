'use client';
import { useRef, useEffect, useState } from 'react';
import { FiSearch, FiHome, FiUser, FiSettings } from 'react-icons/fi';

const SearchDialog = ({ searchQuery, setSearchQuery, showDialog, setShowDialog }) => {
  const searchRef = useRef(null);
  const dialogRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  const suggestions = [
    { title: "Dashboard", icon: <FiHome />, path: "/dashboard" },
    { title: "Profile", icon: <FiUser />, path: "/profile" },
    { title: "Settings", icon: <FiSettings />, path: "/settings" }
  ];

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px é o breakpoint md do Tailwind
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowDialog(true);
      }
      else if (e.key === 'Escape' && showDialog) {
        handleCloseDialog();
      }
    };

    const handleClickOutside = (e) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target)) {
        handleCloseDialog();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    if (showDialog) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDialog, setShowDialog]);

  const handleCloseDialog = () => {
    setShowDialog(false);
    setSearchQuery('');
  };

  return (
    <>
      <div className="flex-1 max-w-2xl mx-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={isMobile ? "Pesquisar..." : "Pesquisar... (Ctrl + K)"}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClick={() => setShowDialog(true)}
          />
        </div>
      </div>

      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" style={{ margin: 0 }}>
          <div 
            ref={dialogRef}
            className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl shadow-xl" 
          >
            <div className="p-4">
              <input
                ref={searchRef}
                type="text"
                placeholder={isMobile ? "Pesquisar..." : "Pesquisar... (Ctrl + K)"}
                className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <div className="mt-4">
                {!searchQuery ? (
                  <div className="grid grid-cols-3 gap-4">
                    {suggestions.map((item, index) => (
                      <button 
                        key={index} 
                        className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                      >
                        <span className="text-gray-600 dark:text-gray-400">{item.icon}</span>
                        <span className="ml-2">{item.title}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {/* Add your search results here */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchDialog; 