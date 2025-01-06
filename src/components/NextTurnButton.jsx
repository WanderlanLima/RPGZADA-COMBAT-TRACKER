import React from 'react';

const NextTurnButton = ({ onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="fixed top-4 right-4 p-3 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition-all duration-200 z-50"
    >
      Próximo Turno
    </button>
  );
};

export default NextTurnButton;
