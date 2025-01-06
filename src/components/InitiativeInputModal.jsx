import React, { useState, useEffect, useRef } from 'react';

const InitiativeInputModal = ({ showModal, handleCloseModal, handleConfirmChange, character, theme }) => {
  const [initiative, setInitiative] = useState('');
  const [maxInitiative, setMaxInitiative] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (character) {
      setMaxInitiative(parseInt(character.modifier, 10) + 20);
      setInitiative(character.initiative);
    }
  }, [character]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value === '' || (!isNaN(value) && parseInt(value, 10) <= maxInitiative)) {
      setInitiative(value);
    }
  };

  const handleConfirm = () => {
    if (initiative !== '') {
      handleConfirmChange(parseInt(initiative, 10));
    }
  };

  const handleInputFocus = (e) => {
    e.target.value = '';
    setInitiative('');
  };

  if (!showModal || !character) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className={`bg-white dark:bg-gray-800 p-6 rounded-md shadow-lg ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
        <h3 className="font-bold mb-4">Editar Iniciativa</h3>
        <p className="mb-2">
          Iniciativa máxima: {maxInitiative}
        </p>
        <input
          type="number"
          value={initiative}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder="Digite a iniciativa"
          className="w-full p-2 rounded text-gray-800 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none mb-4"
          ref={inputRef}
        />
        <div className="flex justify-end">
          <button onClick={handleCloseModal} className="bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 px-4 rounded mr-2">Cancelar</button>
          <button onClick={handleConfirm} className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded">Confirmar</button>
        </div>
      </div>
    </div>
  );
};

export default InitiativeInputModal;
