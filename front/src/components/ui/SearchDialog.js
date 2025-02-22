'use client';
import { useRef, useEffect, useState } from 'react';
import { FiSearch, FiHome, FiUser, FiSettings } from 'react-icons/fi';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

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
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" style={{ margin: 0 }}>
          <div
            ref={dialogRef}
            className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl shadow-xl"
          >
            <div className="p-4">
              <div className="mt-0 mb-4 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseDialog}
                >
                  Fechar [Esc]
                </Button>
              </div>

              <Input
                ref={searchRef}
                placeholder="Pesquisar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={FiSearch}
                fullWidth
                size="lg"
                autoFocus
              />

              <div className="mt-4">
                {!searchQuery ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {suggestions.map((item, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        fullWidth
                        className="justify-start h-12"
                      >
                        <span className="text-gray-600 dark:text-gray-400 mr-3">
                          {item.icon}
                        </span>
                        <span>{item.title}</span>
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-sm text-gray-500 dark:text-gray-400 p-2">
                      Nenhum resultado encontrado para "{searchQuery}"
                    </div>
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