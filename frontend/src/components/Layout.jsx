import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowUpOnSquareIcon,
  DocumentChartBarIcon,
  InformationCircleIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const hideSidebar = location.pathname.startsWith('/download');

  const username = localStorage.getItem('username') || '';
  const email = localStorage.getItem('email') || '';
  const initial = username.charAt(0).toUpperCase() || 'U';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      {!hideSidebar && (
        <aside
          className={`transition-all duration-300 bg-gray-900 text-gray-100 flex flex-col relative ${
            sidebarOpen ? 'w-64' : 'w-16'
          }`}
        >
          {/* Toggle Button */}
          <div className="flex justify-end px-2 py-2">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-white"
            >
              {sidebarOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
            </button>
          </div>

          {/* App Title */}
          <div className="px-4 pb-3 text-lg font-bold border-b border-gray-800 truncate">
            {sidebarOpen ? 'Secure Share' : 'SS'}
          </div>

          {/* Navigation */}
          <div
            className={`px-4 py-2 text-xs font-semibold text-gray-400 ${
              !sidebarOpen && 'hidden'
            }`}
          >
            Actions
          </div>
          <nav className="px-2 space-y-1">
            <NavLink
              to="/upload"
              className={({ isActive }) =>
                `flex items-center px-2 py-2 rounded-md hover:bg-gray-800 ${
                  isActive ? 'bg-gray-800' : ''
                }`
              }
            >
              <ArrowUpOnSquareIcon className="h-5 w-5 mr-2" />
              {sidebarOpen && <span>Upload Files</span>}
            </NavLink>
            <NavLink
              to="/files"
              className={({ isActive }) =>
                `flex items-center px-2 py-2 rounded-md hover:bg-gray-800 ${
                  isActive ? 'bg-gray-800' : ''
                }`
              }
            >
              <DocumentChartBarIcon className="h-5 w-5 mr-2" />
              {sidebarOpen && <span>Shared Files</span>}
            </NavLink>
          </nav>

          {/* Pages Section */}
          <div
            className={`mt-4 px-4 py-2 text-xs font-semibold text-gray-400 ${
              !sidebarOpen && 'hidden'
            }`}
          >
            Pages
          </div>
          <nav className="px-2 space-y-1">
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `flex items-center px-2 py-2 rounded-md hover:bg-gray-800 ${
                  isActive ? 'bg-gray-800' : ''
                }`
              }
            >
              <InformationCircleIcon className="h-5 w-5 mr-2" />
              {sidebarOpen && <span>About Us</span>}
            </NavLink>
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* User Profile */}
          <div className="px-4 py-3 border-t border-gray-800 flex items-center relative">
            <div className="h-8 w-8 bg-gray-700 rounded-full flex items-center justify-center text-sm font-medium">
              {initial}
            </div>
            {sidebarOpen && (
              <div className="ml-3 flex-1">
                <div className="text-sm font-medium truncate">{username}</div>
                <div className="text-xs text-gray-400 truncate">{email}</div>
              </div>
            )}
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="ml-auto text-gray-400 hover:text-white"
            >
              <ChevronDownIcon className="h-5 w-5" />
            </button>

            {showDropdown && (
              <div className="absolute bottom-12 right-4 bg-gray-800 text-sm rounded shadow-lg z-10 w-40">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700 text-red-400"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 bg-[#0b0f1a] text-white overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
