import React from 'react';

const ConfirmationModal = ({ showConfirmation, handleCloseConfirmation, handleConfirmDelete, theme }) => {
  if (!showConfirmation) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className={`bg-white dark:bg-gray-800 p-6 rounded-md shadow-lg ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
        <p className="mb-4">Tem certeza que deseja remover este personagem?</p>
        <div className="flex justify-end">
          <button onClick={handleCloseConfirmation} className={`bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 px-4 rounded mr-2`}>Cancelar</button>
          <button onClick={handleConfirmDelete} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">Confirmar</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
