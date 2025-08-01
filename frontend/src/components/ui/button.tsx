import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit';
  disabled?: boolean;
}

const ButtonQuiz = ({ 
  children, 
  onClick, 
  className = '', 
  variant = 'primary', 
  type = 'button',
  disabled = false 
}: ButtonProps) => {
  const baseClasses = "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium cursor-pointer text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-yellow-400 hover:bg-yellow-300 text-black shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:ring-yellow-400",
    secondary: "bg-gray-800 text-gray-300 border-2 border-gray-700 hover:border-yellow-400 hover:text-yellow-400 hover:shadow-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:border-yellow-400 dark:hover:text-yellow-400 light:bg-white light:text-gray-700 light:border-gray-200 light:hover:border-yellow-400 light:hover:text-yellow-600"
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default ButtonQuiz;