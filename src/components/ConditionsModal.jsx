import React from 'react';

    const ConditionsModal = ({ showModal, handleCloseModal, character, theme, handleConditionToggle, commonConditions }) => {
      if (!showModal || !character) return null;

      return (
        <div className="fixed inset-0 gamer-bg-overlay flex justify-center items-center z-50">
          <div className="gamer-bg p-6 rounded-lg shadow-lg text-white">
            <h3 className="font-bold mb-4 text-xl">Selecionar Condições</h3>
            <div className="grid grid-cols-2 gap-2">
              {commonConditions.map(condition => (
                <button
                  key={condition}
                  onClick={() => handleConditionToggle(character.id, condition)}
                  className={`gamer-button px-3 py-1 rounded-lg m-1 text-sm ${
                    character.conditions?.includes(condition)
                      ? 'gamer-button-active'
                      : ''
                  }`}
                >
                  {condition}
                </button>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleCloseModal}
                className="gamer-button px-4 py-2 rounded-lg"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      );
    };

    export default ConditionsModal;
