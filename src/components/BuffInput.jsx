import React, { useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';

const BuffInput = ({ character, onClose, onSubmit }) => {
  const [buffName, setBuffName] = useState('');
  const [buffColor, setBuffColor] = useState('#9333ea');

  const handleSubmit = () => {
    if (buffName.trim()) {
      onSubmit(buffName, buffColor);
      setBuffName('');
      setBuffColor('#9333ea');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-1">
      <div className="gamer-modal bg-gray-900 p-4 rounded-lg border-2 border-purple-800 shadow-xl w-full max-w-[300px]">
        <h3 className="text-lg font-bold text-purple-400 font-gaming mb-3 hover:text-purple-300 transition-colors">
          Nome do Buff
        </h3>
        
        <input
          type="text"
          value={buffName}
          onChange={(e) => setBuffName(e.target.value)}
          className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 mb-3 border border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm hover:border-purple-500 transition-colors"
          placeholder="Nome do buff"
          autoFocus
        />
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-purple-400 mb-2 hover:text-purple-300 transition-colors">
            Cor do Buff
          </label>
          <input
            type="color"
            value={buffColor}
            onChange={(e) => setBuffColor(e.target.value)}
            className="w-full h-8 cursor-pointer rounded-lg"
          />
        </div>
        
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="gamer-button px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-all text-sm border border-gray-600 hover:scale-105 transform active:scale-95"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="gamer-button px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-500 transition-all text-sm border border-purple-500 hover:scale-105 transform active:scale-95"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuffInput;
