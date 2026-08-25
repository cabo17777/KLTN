import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { logout } from "../redux/authSlice";
import { IoMdAdd } from "react-icons/io";
import {
  FaList,
  FaUsers,
  FaBox,
  FaChevronDown,
  FaChevronRight,
  FaSignOutAlt,
  FaTags,
} from "react-icons/fa";
import { MdDashboard, MdAnalytics } from "react-icons/md";
import { BiPackage } from "react-icons/bi";
import { HiOutlineClipboardList } from "react-icons/hi";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [expandedCategories, setExpandedCategories] = useState({
    Products: false,
  });

  const toggleCategory = (categoryName) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const sidebarItems = [
    {
      title: "Overview",
      icon: <MdDashboard />,
      path: "/",
      description: "Dashboard overview",
      badge: null,
    },
    {
      title: "Analytics",
      icon: <MdAnalytics />,
      path: "/analytics",
      description: "View analytics & insights",
      badge: "New",
    },
    {
      title: "Products",
      icon: <BiPackage />,
      path: "#",
      isCategory: true,
      children: [
        {
          title: "Add Product",
          icon: <IoMdAdd />,
          path: "/add",
          description: "Add new products",
        },
        {
          title: "Product List",
          icon: <FaList />,
          path: "/list",
          description: "Manage all products",
        },

        {
          title: "Categories",
          icon: <FaTags />,
          path: "/categories",
          description: "Manage categories",
        },
        {
          title: "Brands",
          icon: <FaBox />,
          path: "/brands",
          description: "Manage brands",
        },
      ],
    },
    {
      title: "Orders",
      icon: <HiOutlineClipboardList />,
      path: "/orders",
      description: "Manage customer orders",
      badge: null,
    },
    {
      title: "Users",
      icon: <FaUsers />,
      path: "/users",
      description: "User management",
    },
  ];

  const renderNavItem = (item, isChild = false) => {
    if (item.isCategory) {
      const isExpanded = expandedCategories[item.title];

      return (
        <div key={item.title} className="mb-2">
          <button
            onClick={() => toggleCategory(item.title)}
            className="w-full flex items-center justify-between gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 mx-1 sm:mx-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 group"
          >
            <div className="flex items-center min-w-0 gap-2 sm:gap-3">
              <span className="flex-shrink-0 text-base transition-transform sm:text-lg group-hover:scale-110">
                {item.icon}
              </span>
              <span className="hidden font-medium truncate sm:inline-flex">
                {item.title}
              </span>
            </div>
            <span className="flex-shrink-0 hidden sm:inline-flex">
              {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
            </span>
          </button>
          <div
            className={`ml-3 sm:ml-4 space-y-1 transition-all duration-300 overflow-hidden ${
              isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            {item.children?.map((child) => renderNavItem(child, true))}
          </div>
        </div>
      );
    }

    return (
      <NavLink
        key={item.title}
        to={item.path}
        className={({ isActive }) =>
          `flex items-center justify-between gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 mx-1 sm:mx-2 rounded-lg transition-all duration-200 group ${
            isActive
              ? "bg-gradient-to-r from-black to-gray-800 text-white shadow-lg"
              : "text-gray-700 hover:bg-gray-50 hover:text-black"
          } ${isChild ? "text-sm" : ""}`
        }
        title={item.description}
      >
        <div className="flex items-center flex-1 min-w-0 gap-2 sm:gap-3">
          <span
            className={`${
              isChild ? "text-sm sm:text-base" : "text-base sm:text-lg"
            } transition-transform group-hover:scale-110 flex-shrink-0`}
          >
            {item.icon}
          </span>
          <div className="flex-col flex-1 hidden min-w-0 sm:flex">
            <span
              className={`font-medium truncate ${isChild ? "text-sm" : ""}`}
            >
              {item.title}
            </span>
            {!isChild && (
              <span className="text-xs text-gray-400 truncate group-hover:text-gray-600">
                {item.description}
              </span>
            )}
          </div>
        </div>
        {item.badge && (
          <span className="flex-shrink-0 hidden px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full lg:inline-flex">
            {item.badge}
          </span>
        )}
      </NavLink>
    );
  };

  return (
    <div className="flex flex-col w-full overflow-x-hidden bg-white border-r border-gray-200">
      {/* Logo/Header */}
      <div className="flex-shrink-0 p-3 border-b border-gray-200 sm:p-4 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg shadow-lg sm:w-10 sm:h-10 bg-gradient-to-br from-black to-gray-700 sm:rounded-xl">
            <FaBox className="text-sm text-white sm:text-lg" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-gray-900 sm:text-xl">
              HL_Sports
            </h1>
            <p className="flex items-center gap-1 text-xs text-gray-500">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Dashboard Active
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-2 overflow-x-hidden overflow-y-auto sm:py-4">
        <div className="px-1 space-y-1 sm:px-0">
          {sidebarItems.map((item) => renderNavItem(item))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 p-3 border-t border-gray-100 sm:p-4 bg-gray-50">
        {/* User Info */}
        {/* {user && (
          <div className="items-center hidden gap-3 p-2 mb-3 bg-white rounded-lg sm:flex">
            <div className="flex items-center justify-center w-8 h-8 text-xs font-semibold text-white rounded-full bg-gradient-to-br from-blue-600 to-blue-700">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name || user.email}
              </p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        )} */}

        {/* Logout Button */}
        <div className="mb-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center sm:justify-start gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 group"
          >
            <FaSignOutAlt className="text-sm transition-transform duration-200 sm:text-base group-hover:scale-110" />
            <span className="hidden font-medium sm:inline">Logout</span>
          </button>
        </div>

        {/* System Status */}
        <div className="text-xs text-center text-gray-400">
          <div className="hidden sm:block">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              <span>System Healthy</span>
            </div>
            <p className="text-gray-500">© 2025 HL_Sports Admin v1.0.0</p>
          </div>
          <div className="flex flex-col items-center gap-1 sm:hidden">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-500">v1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
