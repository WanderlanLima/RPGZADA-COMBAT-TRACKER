import React from 'react';

const ClearConfirmation = ({ showConfirmation, confirmClearAll, cancelClearAll, theme }) => {
  if (!showConfirmation) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center p-4">
      <div className="gamer-modal bg-gray-900 p-4 rounded-lg border-2 border-purple-800 shadow-xl transform transition-all w-full max-w-[90vw] sm:max-w-[400px]">
        <p className="mb-4 text-base sm:text-lg text-purple-400 font-gaming text-center">Tem certeza que deseja apagar todos os dados?</p>
        <div className="flex flex-col sm:flex-row justify-center gap-2">
          <button 
            onClick={cancelClearAll} 
            className="gamer-button text-white py-2 px-4 rounded-lg touch:active-scale hover:bg-purple-600/50 transition-all duration-300 border border-purple-500 hover:border-purple-400 hover:brightness-110 flex-shrink-0"
          >
            <span className="text-base">Cancelar</span>
          </button>
          <button 
            onClick={confirmClearAll} 
            className="gamer-button text-white py-2 px-4 rounded-lg touch:active-scale hover:bg-red-600/50 transition-all duration-300 border border-red-500 hover:border-red-400 hover:brightness-110 flex-shrink-0"
          >
            <span className="text-base">Confirmar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClearConfirmation;
