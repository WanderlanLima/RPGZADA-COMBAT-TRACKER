import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggleButton = ({ theme, toggleTheme }) => {
  const handleToggle = () => {
      toggleTheme('light');
  };

  return (
    <div className="flex justify-end p-4">
      <button onClick={handleToggle} className={`text-gray-400 hover:text-white text-xl ${theme === 'dark' ? 'mr-0' : 'mr-0'}`} title="Mudar Tema">
        {theme === 'dark' ? <FaSun /> : <FaMoon />}
      </button>
    </div>
  );
};

export default ThemeToggleButton;
