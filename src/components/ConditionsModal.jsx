import React from 'react';

    const ConditionsModal = ({ showModal, handleCloseModal, character, theme, handleConditionToggle, commonConditions }) => {
      if (!showModal || !character) return null;

      return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className={`bg-white dark:bg-gray-800 p-6 rounded-md shadow-lg ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            <h3 className="font-bold mb-4">Selecionar Condições</h3>
            <div className="grid grid-cols-2 gap-2">
              {commonConditions.map(condition => (
                <button
                  key={condition}
                  onClick={() => handleConditionToggle(character.id, condition)}
                  className={`px-3 py-1 rounded m-1 text-sm ${
                    character.conditions?.includes(condition)
                      ? 'bg-purple-500 hover:bg-purple-600 text-white'
                      : 'bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-white'
                  }`}
                  style={{ backgroundColor: 'rgb(140,60,244)', color: 'white' }}
                >
                  {condition}
                </button>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      );
    };

    export default ConditionsModal;
