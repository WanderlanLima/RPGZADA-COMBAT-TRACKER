import React, { useState, useEffect } from 'react';
import { IoImageOutline } from 'react-icons/io5';
import FileUpload from './FileUpload';
import { IoTrash } from 'react-icons/io5';
import useTheme from '../hooks/useTheme';

const CharacterForm = ({ 
  newCharacter, 
  handleInputChange, 
  handleImageUpload, 
  errorMessage, 
  npcQuantity, 
  setNpcQuantity, 
  handleAddCharacter, 
  handleTextFileUpload, 
  handleClearAll, 
  setShowInstructions, 
  isMobile,
  isFormOpen,
  toggleForm
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!isFormOpen) {
      setIsExpanded(false);
    }
  }, [isFormOpen]);

  const formClasses = `bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-all duration-300 ${
    isMobile ? 'character-form-container' : ''
  } ${isMobile && !isExpanded ? 'character-form-collapsed' : 'character-form-expanded'} ${
    theme === 'dark' ? 'shadow-purple-900/50' : 'shadow-purple-200/50'
  } ${isMobile ? 'pb-[max(1rem,env(safe-area-inset-bottom))]' : ''} ${
    isMobile ? 'w-full max-w-[100vw] mx-0' : 'max-w-md'
  } touch:min-h-[64px] border border-gray-200 dark:border-gray-700`;
  const handleModifierFocus = (e) => {
    if (e.target.value === '0') {
      e.target.value = '';
      handleInputChange(e);
    }
  };

  const handleModifierBlur = (e) => {
    if (e.target.value === '') {
      e.target.value = '0';
      handleInputChange(e);
    }
  };

  const handleNpcQuantityFocus = (e) => {
    if (e.target.value === '1') {
      e.target.value = '';
      setNpcQuantity('');
    }
  };

  const handleNpcQuantityBlur = (e) => {
    if (e.target.value === '') {
      e.target.value = '1';
      setNpcQuantity(1);
    }
  };

  const inputStyle = {
    backgroundColor: 'rgb(56,68,84)',
    color: 'white',
  };

  return (
    <div className={formClasses}>
      <h2 className="text-base sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800 dark:text-white">Adicionar Personagem</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-5">
        {/* Nome do Personagem */}
        <div className="col-span-2">
          <label className="block text-xs mb-1.5 sm:mb-2 text-gray-700 dark:text-gray-300">Nome do Personagem</label>
          <input
            type="text"
            name="name"
            value={newCharacter.name}
            onChange={handleInputChange}
            placeholder="Nome"
            className="w-full py-3 px-4 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-base touch:min-h-[48px] bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
            autoComplete="off"
          />
          {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
        </div>

        {/* Tipo do Personagem */}
        <div className="col-span-2">
          <label className="block text-xs mb-1.5 sm:mb-2 text-gray-700 dark:text-gray-300">Tipo do Personagem</label>
          <select
            name="type"
            value={newCharacter.type}
            onChange={handleInputChange}
            className="w-full py-3 px-4 rounded-lg text-gray-800 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-base touch:min-h-[48px] transition-colors duration-200"
            aria-label="Tipo do personagem"
          >
            <option value="Jogador">Jogador</option>
            <option value="NPC">NPC</option>
          </select>
        </div>

        {/* Quantidade de NPCs */}
        {newCharacter.type === 'NPC' && (
          <div className="col-span-2">
            <label className="block text-xs mb-1.5 sm:mb-2 text-gray-700 dark:text-gray-300">Quantidade de NPCs</label>
            <input
              type="number"
              name="npcQuantity"
              value={npcQuantity}
              onChange={(e) => setNpcQuantity(parseInt(e.target.value, 10))}
              onFocus={handleNpcQuantityFocus}
              onBlur={handleNpcQuantityBlur}
              placeholder="1"
              className="w-full py-3 px-4 rounded-lg text-gray-800 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none appearance-none touch:min-h-[48px] transition-colors duration-200"
              aria-label="Quantidade de NPCs"
              min="1"
            />
          </div>
        )}

        {/* Modificador de Iniciativa */}
        <div className="col-span-2">
          <label className="block text-xs mb-1.5 sm:mb-2 text-gray-700 dark:text-gray-300">Modificador de Iniciativa</label>
          <input
            type="number"
            name="modifier"
            value={newCharacter.modifier}
            onChange={handleInputChange}
            onFocus={handleModifierFocus}
            onBlur={handleModifierBlur}
            placeholder="0"
            className="w-full py-3 px-4 rounded-lg text-gray-800 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none appearance-none touch:min-h-[48px] transition-colors duration-200"
          />
        </div>

        {/* Upload de Imagem */}
        <div className="col-span-2">
          <label className="block text-xs mb-1.5 sm:mb-2 text-gray-700 dark:text-gray-300">Imagem do Personagem</label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="imageUpload"
            />
            <label
              htmlFor="imageUpload"
              className="flex items-center justify-center w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <IoImageOutline className="mr-2" />
              <span className="text-gray-600 dark:text-gray-300">
                {newCharacter.image ? 'Imagem selecionada' : 'Escolher imagem'}
              </span>
            </label>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="col-span-2 space-y-2 sm:space-y-3">
          <button
            onClick={handleAddCharacter}
            className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-colors duration-200 touch:min-h-[48px] text-base sm:text-lg font-medium"
          >
            Adicionar Personagem
          </button>

          <FileUpload handleTextFileUpload={handleTextFileUpload} setShowInstructions={setShowInstructions} />
        </div>

        {/* Botões de Controle */}
        <div className="flex justify-between items-center mt-3 sm:mt-6 px-1 sm:px-2">
          <button 
            onClick={handleClearAll}
            className="text-gray-400 hover:text-white text-2xl p-3 rounded-full hover:bg-gray-700 transition-colors duration-200 touch:min-h-[48px] touch:w-[48px] flex items-center justify-center"
            title="Apagar todos os dados"
          >
            <IoTrash />
          </button>
          <button 
            onClick={() => setShowInstructions(true)}
            className="text-gray-400 hover:text-white text-2xl p-3 rounded-full hover:bg-gray-700 transition-colors duration-200 touch:min-h-[48px] touch:w-[48px] flex items-center justify-center"
            title="Como importar personagens"
          >
            ?
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterForm;
