import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';

const Navbar = ({ userRole, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Navigation links based on role
  const getNavigationLinks = () => {
    if (userRole === 'Admin') {
      return [
        { path: '/books', label: '📚 Books', icon: '📚' },
        { path: '/add-book', label: '➕ Add Book', icon: '➕' },
        { path: '/issue', label: '📤 Issue Book', icon: '📤' },
        { path: '/return', label: '📥 Return Book', icon: '📥' },
        { path: '/reports', label: '📊 Reports', icon: '📊' }
      ];
    } else if (userRole === 'Student') {
      return [
        { path: '/books', label: '📚 Books', icon: '📚' }
      ];
    }
    return [];
  };

  const navigationLinks = getNavigationLinks();

  const isActive = (path) => {
    return location.pathname === path;
  };

  if (!userRole) {
    return null; // Don't show navbar on home page
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link 
              to="/books" 
              className="flex items-center space-x-2 text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors duration-200"
              onClick={closeMobileMenu}
            >
              <span className="text-2xl">📚</span>
              <span className="hidden sm:block">HIT Library</span>
              <span className="sm:hidden">Library</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span className="md:hidden">{link.icon}</span>
                <span className="hidden md:inline">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Profile Dropdown */}
          <div className="hidden md:flex items-center">
            <ProfileDropdown userRole={userRole} onLogout={handleLogout} />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900 transition-colors duration-200"
            >
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path fillRule="evenodd" d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"/>
                ) : (
                  <path fillRule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"/>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 rounded-b-lg">
              {navigationLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={closeMobileMenu}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Mobile Profile & Logout */}
              <div className="pt-4 pb-2 border-t border-gray-200 mt-4">
                <div className="px-3 py-2">
                  <ProfileDropdown userRole={userRole} onLogout={handleLogout} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;