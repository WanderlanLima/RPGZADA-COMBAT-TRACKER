import React, { useState } from 'react';
import { IoCloseOutline, IoCheckmarkCircle } from 'react-icons/io5';
import BuffInput from './BuffInput';
import ConditionButton from './ConditionButton';

const ConditionsModal = ({ 
  showModal, 
  handleCloseModal, 
  character, 
  handleConditionToggle, 
  commonConditions 
}) => {
  const [showBuffInput, setShowBuffInput] = useState(false);
  
  if (!showModal || !character) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-1">
        <div className="gamer-modal bg-gray-900 p-4 rounded-lg border-2 border-purple-800 shadow-xl transform transition-all max-w-[600px] max-w-[90vw] overflow-y-auto fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10000]">
          
          {/* Close Button */}
          <button
            onClick={handleCloseModal}
            className="absolute top-2 right-2 text-gray-400 hover:text-white transition-all bg-gray-800 rounded-full p-1 hover:scale-110 transform active:scale-95"
          >
            <IoCloseOutline size={20} className="transition-transform" />
          </button>
          
          {/* Modal Title */}
          <h3 className="text-lg font-bold text-purple-400 font-gaming mb-2 px-2 hover:text-purple-300 transition-colors">
            Condições
          </h3>
          
          {/* Conditions Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 px-2">
            {commonConditions.map(condition => (
              <ConditionButton
                key={condition}
                condition={condition}
                character={character}
                onClick={() => {
                  if (condition === 'Buff') {
                    setShowBuffInput(true);
                  } else {
                    handleConditionToggle(character.id, condition);
                  }
                }}
              />
            ))}
          </div>

          {/* Close Modal Button */}
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleCloseModal}
              className="gamer-button px-4 py-2 rounded-lg bg-purple-900 text-white hover:bg-purple-800 transition-all font-gaming border border-purple-600 text-sm hover:scale-105 transform active:scale-95"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>

      {/* Buff Input Modal */}
      {showBuffInput && (
        <BuffInput
          character={character}
          onClose={() => setShowBuffInput(false)}
          onSubmit={(buffName, buffColor) => {
            handleConditionToggle(character.id, `Buff: ${buffName}|${buffColor}`);
          }}
        />
      )}
    </>
  );
};

export default ConditionsModal;
