import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  colors: {
    primary: string;
    primaryHover: string;
    secondary: string;
    secondaryHover: string;
    background: string;
    surface: string;
    surfaceHover: string;
    text: string;
    textSecondary: string;
    border: string;
    borderHover: string;
    accent: string;
    accentHover: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const colors = {
    primary: isDarkMode ? 'bg-yellow-400 text-black' : 'bg-yellow-400 text-black',
    primaryHover: isDarkMode ? 'hover:bg-yellow-300' : 'hover:bg-yellow-500',
    secondary: isDarkMode ? 'bg-gray-800 text-gray-300 border-gray-700' : 'bg-white text-gray-700 border-gray-200',
    secondaryHover: isDarkMode ? 'hover:border-yellow-400 hover:text-yellow-400' : 'hover:border-yellow-400 hover:text-yellow-500',
    background: isDarkMode ? 'bg-black' : 'bg-white',
    surface: isDarkMode ? 'bg-gray-900' : 'bg-white',
    surfaceHover: isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50',
    text: isDarkMode ? 'text-white' : 'text-black',
    textSecondary: isDarkMode ? 'text-gray-400' : 'text-gray-600',
    border: isDarkMode ? 'border-gray-800' : 'border-gray-200',
    borderHover: isDarkMode ? 'hover:border-yellow-400' : 'hover:border-yellow-400',
    accent: isDarkMode ? 'text-yellow-400' : 'text-yellow-500',
    accentHover: isDarkMode ? 'hover:text-yellow-300' : 'hover:text-yellow-700',
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};