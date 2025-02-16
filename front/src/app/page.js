'use client';
import { useState, useCallback, useEffect, useRef } from "react";
import { FiHome, FiPieChart, FiUsers, FiSettings, FiBell, FiMenu, FiX, FiChevronDown, FiChevronRight, FiSun, FiMoon, FiChevronLeft, FiSearch, FiLogOut, FiUser } from "react-icons/fi";

const Header = ({ isDarkMode, searchQuery, setSearchQuery }) => {
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchRef = useRef(null);
  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);

  const suggestions = [
    { title: "Dashboard", icon: <FiHome />, path: "/dashboard" },
    { title: "Profile", icon: <FiUser />, path: "/profile" },
    { title: "Settings", icon: <FiSettings />, path: "/settings" }
  ];

  const notifications = [
    { id: 1, title: "New message", time: "5m ago", read: false },
    { id: 2, title: "System update", time: "1h ago", read: false },
    { id: 3, title: "Welcome aboard!", time: "1d ago", read: true }
  ];

  const userMenuItems = [
    { title: "Profile", icon: <FiUser />, action: () => {} },
    { title: "Settings", icon: <FiSettings />, action: () => {} },
    { title: "Logout", icon: <FiLogOut />, action: () => {} }
  ];

  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.key === "k" && e.ctrlKey) || e.key === "Enter") {
        e.preventDefault();
        setShowSearchDialog(true);
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, []);

  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === "Escape") {
        setShowSearchDialog(false);
        setShowNotifications(false);
        setShowUserMenu(false);
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDialog(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 shadow-sm z-40">
      <div className="max-w-[1920px] mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
            D
          </div>
          <h1 className="font-bold text-xl hidden md:block">Dashboard</h1>
        </div>

        <div className="flex-1 max-w-2xl mx-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search... (Crtl + K)"
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
          >
            <FiBell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
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
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
            </div>
          </div>
        </div>
      </div>

      {showSearchDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl shadow-xl" ref={searchRef}>
            <div className="p-4">
              <input
                type="text"
                placeholder="Search..."
                className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <div className="mt-4">
                {!searchQuery ? (
                  <div className="grid grid-cols-3 gap-4">
                    {suggestions.map((item, index) => (
                      <button key={index} className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        {item.icon}
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

      {showNotifications && (
        <div className="absolute right-20 top-16 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50" ref={notificationRef}>
          <div className="p-4">
            <h3 className="font-semibold mb-4">Notifications</h3>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div key={notification.id} className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />}
                  <div>
                    <p className="font-medium">{notification.title}</p>
                    <p className="text-sm text-gray-500">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showUserMenu && (
        <div className="absolute right-4 top-16 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50" ref={userMenuRef}>
          <div className="p-4 space-y-3">
            {userMenuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="flex items-center w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                {item.icon}
                <span className="ml-2">{item.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const DashboardSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const menuItems = [
    {
      title: "Dashboard",
      icon: <FiHome className="w-5 h-5" />,
      submenu: [
        { title: "Overview", submenu: ["Daily", "Weekly", "Monthly"] },
        { title: "Analytics", submenu: ["Revenue", "Users", "Traffic"] },
        { title: "Reports", submenu: ["Sales", "Performance", "Goals"] }
      ]
    },
    {
      title: "Analytics",
      icon: <FiPieChart className="w-5 h-5" />,
      submenu: [
        { title: "Statistics", submenu: ["General", "Detailed"] },
        { title: "Performance", submenu: ["System", "User"] },
        { title: "Metrics", submenu: ["Basic", "Advanced"] }
      ]
    },
    {
      title: "User Management",
      icon: <FiUsers className="w-5 h-5" />,
      submenu: [
        { title: "Users", submenu: ["List", "Add", "Import"] },
        { title: "Roles", submenu: ["View", "Create", "Assign"] },
        { title: "Permissions", submenu: ["Configure", "Templates"] }
      ]
    },
    {
      title: "Settings",
      icon: <FiSettings className="w-5 h-5" />,
      submenu: [
        { title: "Profile", submenu: ["Edit", "Privacy"] },
        { title: "Security", submenu: ["Password", "2FA"] },
        { title: "Preferences", submenu: ["Notifications", "Theme"] }
      ]
    },
    {
      title: "Notifications",
      icon: <FiBell className="w-5 h-5" />,
      submenu: [
        { title: "All", submenu: ["Read", "Unread"] },
        { title: "Unread", submenu: ["Important", "Other"] },
        { title: "Archive", submenu: ["Recent", "Old"] }
      ]
    }
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
    if (window.innerWidth > 768) setIsOpen(true);
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleMenuClick = (index) => {
    setActiveMenu(activeMenu === index ? null : index);
    setActiveSubMenu(null);
  };

  const handleSubMenuClick = (menuIndex, index, event) => {
    event.stopPropagation();
    setActiveSubMenu(activeSubMenu === `${menuIndex}-${index}` ? null : `${menuIndex}-${index}`);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const renderSubmenuItems = (submenu, menuIndex, isActive) => (
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${isActive ? "max-h-96" : "max-h-0"
        }`}
    >
      {submenu.map((item, index) => (
        <div key={index}>
          <div
            className="pl-12 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200 flex items-center justify-between"
            onClick={(e) => handleSubMenuClick(menuIndex, index, e)}
          >
            <span>{item.title}</span>
            <FiChevronDown
              className={`w-4 h-4 mr-4 transition-transform duration-200 ${activeSubMenu === `${menuIndex}-${index}` ? "rotate-180" : ""
                }`}
            />
          </div>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${activeSubMenu === `${menuIndex}-${index}` ? "max-h-48" : "max-h-0"
              }`}
          >
            {item.submenu.map((subItem, subSubIdx) => (
              <div
                key={subSubIdx}
                className="pl-16 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                onClick={() => isMobile && setIsOpen(false)}
              >
                {subItem}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={`relative ${isDarkMode ? "dark" : ""}`}>
      <Header
        isDarkMode={isDarkMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleSidebar}
        />
      )}

      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white dark:bg-gray-800 shadow-lg block md:hidden"
        onClick={toggleSidebar}
        aria-label="Toggle Menu"
      >
        {isOpen ? (
          <FiX className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        ) : (
          <FiMenu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        )}
      </button>

      <nav
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 shadow-xl z-30 transition-all duration-300 ${isOpen ? "w-64" : "w-20"
          } ${isMobile && !isOpen ? "-translate-x-full" : "translate-x-0"}`}
      >
        <div className="py-4 overflow-y-auto">
          {menuItems.map((item, index) => (
            <div key={index}>
              <div
                className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                onClick={() => handleMenuClick(index)}
              >
                <div className="flex items-center flex-1">
                  {item.icon}
                  {isOpen && (
                    <span className="ml-4 text-gray-700 dark:text-gray-300">
                      {item.title}
                    </span>
                  )}
                </div>
                {isOpen && (
                  <FiChevronDown
                    className={`w-5 h-5 transition-transform duration-200 ${activeMenu === index ? "rotate-180" : ""
                      }`}
                  />
                )}
              </div>
              {isOpen && renderSubmenuItems(item.submenu, index, activeMenu === index)}
            </div>
          ))}
        </div>

        <div className="absolute bottom-0 w-full border-t dark:border-gray-700">
          <button
            onClick={toggleDarkMode}
            className="flex items-center w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            {isDarkMode ? (
              <FiSun className="w-5 h-5" />
            ) : (
              <FiMoon className="w-5 h-5" />
            )}
            {isOpen && (
              <span className="ml-4 text-gray-700 dark:text-gray-300">
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </span>
            )}
          </button>
        </div>
      </nav>
    </div>
  );
};

export default DashboardSidebar;