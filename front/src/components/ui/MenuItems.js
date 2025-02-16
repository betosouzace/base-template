'use client';
import { FiHome, FiPieChart, FiUsers, FiSettings, FiBell, FiChevronDown } from 'react-icons/fi';

const MenuItems = ({ isOpen, activeMenu, setActiveMenu, activeSubMenu, setActiveSubMenu }) => {
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

  const handleMenuClick = (index) => {
    setActiveMenu(activeMenu === index ? null : index);
    setActiveSubMenu(null);
  };

  const handleSubMenuClick = (menuIndex, index, event) => {
    event.stopPropagation();
    setActiveSubMenu(activeSubMenu === `${menuIndex}-${index}` ? null : `${menuIndex}-${index}`);
  };

  const renderSubmenuItems = (submenu, menuIndex, isActive) => (
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isActive ? "max-h-96" : "max-h-0"
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
              className={`w-4 h-4 mr-4 transition-transform duration-200 ${
                activeSubMenu === `${menuIndex}-${index}` ? "rotate-180" : ""
              }`}
            />
          </div>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              activeSubMenu === `${menuIndex}-${index}` ? "max-h-48" : "max-h-0"
            }`}
          >
            {item.submenu.map((subItem, subSubIdx) => (
              <div
                key={subSubIdx}
                className="pl-16 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
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
    <div className="py-4 overflow-y-auto overflow-x-hidden">
      {menuItems.map((item, index) => (
        <div key={index}>
          <div
            className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            onClick={() => handleMenuClick(index)}
          >
            <div className={`flex items-center flex-1 ${!isOpen && 'justify-center'}`}>
              <span className="text-gray-600 dark:text-gray-300">{item.icon}</span>
              <span className={`ml-4 text-gray-700 dark:text-gray-300 whitespace-nowrap transition-all duration-300 ${
                isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 hidden'
              }`}>
                {item.title}
              </span>
            </div>
            <FiChevronDown
              className={`w-5 h-5 text-gray-600 dark:text-gray-300 transition-all duration-200 ${
                !isOpen ? 'hidden' : ''
              } ${activeMenu === index ? "rotate-180" : ""}`}
            />
          </div>
          {isOpen && renderSubmenuItems(item.submenu, index, activeMenu === index)}
        </div>
      ))}
    </div>
  );
};

export default MenuItems; 