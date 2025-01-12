import React from 'react';
import { FaArrowUp } from 'react-icons/fa';
import useTheme from '../hooks/useTheme';

const FloatingButton = ({ 
  onClick, 
  battleStarted,
  isFormOpen,
  toggleForm 
}) => {
  const { theme } = useTheme();
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* Botão de scroll para desktop */}
      {!battleStarted && (
        <button 
          onClick={scrollToTop}
          className={`fixed bottom-24 right-4 p-4 ${
            theme === 'dark' ? 'bg-purple-800' : 'bg-purple-600'
          } rounded-full shadow-lg hover:bg-purple-700 transition-all duration-200 z-50 hidden md:block`}
          aria-label="Voltar ao topo"
        >
          <FaArrowUp className="text-white text-xl" />
        </button>
      )}
    </>
  );
};

export default FloatingButton;
