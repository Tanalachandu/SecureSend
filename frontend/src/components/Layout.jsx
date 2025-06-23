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
    <div className="flex h-screen overflow-hidden font-sans"> {/* Added font-sans for consistency */}
      {/* Sidebar */}
      {!hideSidebar && (
        <aside
          className={`transition-all duration-300 bg-card-dark-gray text-text-white flex flex-col relative ${ // Changed bg & text colors
            sidebarOpen ? 'w-64' : 'w-16'
          }`}
        >
          {/* Toggle Button */}
          <div className="flex justify-end px-2 py-2">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-text-light-gray hover:text-white" // Adjusted text colors
            >
              {sidebarOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
            </button>
          </div>

          {/* App Title */}
          <div className="px-4 pb-3 text-lg font-bold border-b border-border-subtle truncate"> {/* Changed border color */}
            {sidebarOpen ? 'Secure Share' : 'SS'}
          </div>

          {/* Navigation */}
          <div
            className={`px-4 py-2 text-xs font-semibold text-text-light-gray ${ // Adjusted text color
              !sidebarOpen && 'hidden'
            }`}
          >
            Actions
          </div>
          <nav className="px-2 space-y-1">
            <NavLink
              to="/upload"
              className={({ isActive }) =>
                `flex items-center px-2 py-2 rounded-md hover:bg-card-inner-dark ${ // Changed hover/active bg
                  isActive ? 'bg-card-inner-dark text-accent-blue' : '' // Added active text color
                }`
              }
            >
              <ArrowUpOnSquareIcon className="h-5 w-5 mr-2" />
              {sidebarOpen && <span>Upload Files</span>}
            </NavLink>
            <NavLink
              to="/files"
              className={({ isActive }) =>
                `flex items-center px-2 py-2 rounded-md hover:bg-card-inner-dark ${ // Changed hover/active bg
                  isActive ? 'bg-card-inner-dark text-accent-blue' : '' // Added active text color
                }`
              }
            >
              <DocumentChartBarIcon className="h-5 w-5 mr-2" />
              {sidebarOpen && <span>Shared Files</span>}
            </NavLink>
          </nav>

          {/* Pages Section
          <div
            className={`mt-4 px-4 py-2 text-xs font-semibold text-text-light-gray ${ // Adjusted text color
              !sidebarOpen && 'hidden'
            }`}
          >
            Pages
          </div> */}
          {/* <nav className="px-2 space-y-1">
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `flex items-center px-2 py-2 rounded-md hover:bg-card-inner-dark ${ // Changed hover/active bg
                  isActive ? 'bg-card-inner-dark text-accent-blue' : '' // Added active text color
                }`
              }
            >
              <InformationCircleIcon className="h-5 w-5 mr-2" />
              {sidebarOpen && <span>About Us</span>}
            </NavLink>
          </nav> */}

          {/* Spacer */}
          <div className="flex-1" />

          {/* User Profile */}
          <div className="px-4 py-3 border-t border-border-subtle flex items-center relative"> {/* Changed border color */}
            <div className="h-8 w-8 bg-card-inner-dark rounded-full flex items-center justify-center text-sm font-medium text-text-white"> {/* Changed bg & text */}
              {initial}
            </div>
            {sidebarOpen && (
              <div className="ml-3 flex-1">
                <div className="text-sm font-medium truncate text-text-white">{username}</div> {/* Ensured text color */}
                <div className="text-xs text-text-light-gray truncate">{email}</div> {/* Ensured text color */}
              </div>
            )}
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="ml-auto text-text-light-gray hover:text-white" // Adjusted text colors
            >
              <ChevronDownIcon className="h-5 w-5" />
            </button>

            {showDropdown && (
              <div className="absolute bottom-12 right-4 bg-card-dark-gray text-sm rounded shadow-card-elevate z-10 w-40"> {/* Changed bg & shadow */}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-card-inner-dark text-accent-red" // Changed hover bg & text color
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 bg-true-black text-text-white overflow-auto p-6"> {/* Changed bg & text color */}
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;