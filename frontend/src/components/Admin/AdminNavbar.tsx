import { useTheme } from "@/contexts/ThemeContext";
import { Plus, User, LogOut, Menu, X, Sun, Moon } from 'lucide-react';
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  const { isDarkMode, toggleTheme, colors } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const nav = useNavigate()

  const NavButton = ({ children, onClick, className = '' }: {
    children: React.ReactNode;
    onClick: () => void;
    className?: string;
  }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 cursor-pointer rounded-lg font-medium text-sm transition-all duration-200 ${
        isDarkMode 
          ? 'text-gray-300 hover:text-yellow-400 hover:bg-gray-800' 
          : 'text-gray-700 hover:text-yellow-600 hover:bg-gray-100'
      } ${className}`}
    >
      {children}
    </button>
  );
  
  if (!isAdminRoute) return null; // Don't show on non-admin routes

  return (
    <nav className={`border-b transition-colors duration-300 ${colors.border} ${colors.background}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center">
            <h1 className={`text-2xl font-bold ${colors.accent}`} onClick={()=>nav("/")}>
              Quizzify
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavButton onClick={() => nav("/admin/createQuiz")}>
              <Plus className="w-4 h-4" />
              Create Quiz
            </NavButton>
            <NavButton onClick={() => nav("/admin/profile")}>
              <User className="w-4 h-4" />
              Profile
            </NavButton>
            <NavButton onClick={() => console.log('Logout')}>
              <LogOut className="w-4 h-4" />
              Logout
            </NavButton>
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-200 ${colors.accentHover} ${colors.surfaceHover}`}
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-white hover:text-yellow-400" /> : <Moon className="w-5 h-5 " />}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-200 ${colors.accentHover} ${colors.surfaceHover}`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg transition-all duration-200 ${colors.textSecondary} ${colors.surfaceHover}`}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className={`md:hidden border-t py-4 space-y-2 ${colors.border}`}>
            <NavButton onClick={() => nav("/admin/createQuiz")} className="w-full justify-start">
              <Plus className="w-4 h-4" />
              Create Quiz
            </NavButton>
            <NavButton onClick={() => nav("/admin/profile")} className="w-full justify-start">
              <User className="w-4 h-4" />
              Profile
            </NavButton>
            <NavButton onClick={() => console.log('Logout')} className="w-full justify-start">
              <LogOut className="w-4 h-4" />
              Logout
            </NavButton>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar;