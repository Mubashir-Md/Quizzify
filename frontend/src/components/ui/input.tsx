import React from 'react';

interface InputProps {
  type: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  value?: string | number;
  required?: boolean;
  isDarkMode?: boolean;
}

const Input = ({ 
  type, 
  placeholder, 
  onChange, 
  className = '', 
  value,
  required,
  isDarkMode = false 
}: InputProps) => (
  <input
    type={type}
    placeholder={placeholder}
    onChange={onChange}
    value={value}
    required={required}
    className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-yellow-400' 
        : 'bg-white border-gray-300 text-black placeholder-gray-500 focus:border-yellow-400'
    } ${className}`}
  />
);

export default Input;