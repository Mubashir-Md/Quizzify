import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps {
  placeholder: string;
  options: { value: string; label: string }[];
  onValueChange: (value: string) => void;
  isDarkMode?: boolean;
  className?: string;
}

const Select = ({ 
  placeholder, 
  options, 
  onValueChange, 
  isDarkMode = false,
  className = '' 
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  
  const handleSelect = (value: string, label: string) => {
    setSelectedValue(label);
    onValueChange(value);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 flex items-center justify-between ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700 text-white focus:border-yellow-400' 
            : 'bg-white border-gray-300 text-black focus:border-yellow-400'
        }`}
      >
        <span className={selectedValue ? '' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
          {selectedValue || placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className={`absolute top-full left-0 right-0 mt-1 rounded-lg border shadow-lg z-10 ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-300'
        }`}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value, option.label)}
              className={`w-full px-4 py-3 text-left hover:bg-opacity-80 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${
                isDarkMode 
                  ? 'text-white hover:bg-gray-700' 
                  : 'text-black hover:bg-gray-100'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;