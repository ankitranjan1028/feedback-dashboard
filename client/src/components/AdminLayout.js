import React, { useState, useContext } from 'react';
import { Navigate, Outlet, Link, NavLink } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const AdminLayout = () => {
  const { auth, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!auth) {
    return <Navigate to="/login" />;
  }

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link 
                to="/" 
                onClick={closeMenu}
                className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent hover:from-cyan-300 hover:to-blue-400 transition-all duration-300"
              >
                Feedback Platform
              </Link>
            </div>
            
            <div className={`${isMenuOpen ? 'block' : 'hidden'} md:block absolute md:relative top-16 md:top-0 left-0 right-0 md:left-auto md:right-auto bg-black/90 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none border-b border-white/10 md:border-none`}>
              <div className="flex flex-col md:flex-row md:items-center md:space-x-8 p-4 md:p-0">
                <NavLink 
                  to="/" 
                  className={({ isActive }) => 
                    `block py-2 px-4 rounded-lg text-white font-medium transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/25' 
                        : 'hover:bg-white/10 hover:shadow-lg'
                    }`
                  }
                  onClick={closeMenu} 
                  end
                >
                  Dashboard
                </NavLink>
                <NavLink 
                  to="/my-forms" 
                  className={({ isActive }) => 
                    `block py-2 px-4 rounded-lg text-white font-medium transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/25' 
                        : 'hover:bg-white/10 hover:shadow-lg'
                    }`
                  }
                  onClick={closeMenu}
                >
                  My Forms
                </NavLink>
                <NavLink 
                  to="/create-form" 
                  className={({ isActive }) => 
                    `block py-2 px-4 rounded-lg text-white font-medium transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/25' 
                        : 'hover:bg-white/10 hover:shadow-lg'
                    }`
                  }
                  onClick={closeMenu}
                >
                  Create Form
                </NavLink>
                <button 
                  onClick={() => { logout(); closeMenu(); }} 
                  className="mt-4 md:mt-0 py-2 px-6 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium rounded-lg shadow-lg hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  Logout
                </button>
              </div>
            </div>
            
            <button 
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </nav>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;