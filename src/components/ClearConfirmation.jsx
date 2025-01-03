import React from 'react';

    const ClearConfirmation = ({ showConfirmation, confirmClearAll, cancelClearAll, theme }) => {
      if (!showConfirmation) return null;

      return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-md">
            <p className="mb-4 dark:text-white">Tem certeza que deseja apagar todos os dados?</p>
            <div className="flex justify-end">
              <button onClick={cancelClearAll} className="bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 px-4 rounded mr-2">Cancelar</button>
              <button onClick={confirmClearAll} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">Confirmar</button>
            </div>
          </div>
        </div>
      );
    };

    export default ClearConfirmation;
