import React from 'react';
    import { FaSun, FaMoon } from 'react-icons/fa';

    const ThemeToggleButton = ({ theme, toggleTheme }) => {
      return (
        <div className="flex justify-end p-4">
          <button onClick={toggleTheme} className={`text-gray-400 hover:text-white text-xl ${theme === 'dark' ? 'mr-0' : 'mr-0'}`} title="Mudar Tema">
            {theme === 'dark' ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      );
    };

    export default ThemeToggleButton;
