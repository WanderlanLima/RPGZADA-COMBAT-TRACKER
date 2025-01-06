import React, { useState, useEffect, useRef } from 'react';

    const ControlModal = ({ showModal, handleCloseModal, character, theme, handleConfirmControlChange }) => {
      const [damage, setDamage] = useState('');
      const [heal, setHeal] = useState('');
      const [tempHp, setTempHp] = useState('');
      const [conditions, setConditions] = useState('');
      const modalRef = useRef(null);

      useEffect(() => {
        if (showModal && modalRef.current) {
          modalRef.current.focus();
        }
      }, [showModal]);

      const handleConfirm = () => {
        handleConfirmControlChange(character.id, damage, heal, tempHp, conditions);
        setDamage('');
        setHeal('');
        setTempHp('');
        setConditions('');
      };

      if (!showModal || !character) return null;

      return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div
            ref={modalRef}
            tabIndex={-1}
            className={`bg-white dark:bg-gray-800 p-6 rounded-md shadow-lg ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}
          >
            <h3 className="font-bold mb-4">Controle de Personagem</h3>
            <p className="mb-2">
              Personagem: {character.name}
            </p>
            <div className="mb-3">
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Dano</label>
              <input
                type="number"
                placeholder="Dano"
                value={damage}
                onChange={(e) => setDamage(e.target.value)}
                className="w-full p-2 rounded text-gray-800 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Cura</label>
              <input
                type="number"
                placeholder="Cura"
                value={heal}
                onChange={(e) => setHeal(e.target.value)}
                className="w-full p-2 rounded text-gray-800 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Vida Temporária</label>
              <input
                type="number"
                placeholder="Vida Temporária"
                value={tempHp}
                onChange={(e) => setTempHp(e.target.value)}
                className="w-full p-2 rounded text-gray-800 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Condições</label>
              <input
                type="text"
                placeholder="Condições"
                value={conditions}
                onChange={(e) => setConditions(e.target.value)}
                className="w-full p-2 rounded text-gray-800 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
            </div>
            <div className="flex justify-end">
              <button onClick={handleCloseModal} className="bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 px-4 rounded mr-2">Cancelar</button>
              <button onClick={handleConfirm} className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded">Confirmar</button>
            </div>
          </div>
        </div>
      );
    };

    export default ControlModal;
