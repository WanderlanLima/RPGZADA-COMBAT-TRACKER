import React from 'react';
    import { FaArrowUp } from 'react-icons/fa';

    const FloatingButton = ({ onClick, battleStarted }) => {
      const scrollToTop = () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      };

      return (
        <>
          {/* Botão para desktop */}
          
          {/* Botão para mobile */}
          <button 
            onClick={scrollToTop}
            className="fixed bottom-4 right-4 p-4 bg-purple-600 rounded-full shadow-lg hover:bg-purple-700 transition-all duration-200 z-50 md:hidden opacity-0 animate-fade-in"
            aria-label="Voltar ao topo"
          >
            <FaArrowUp className="text-white text-xl" />
          </button>
        </>
      );
    };

    export default FloatingButton;
