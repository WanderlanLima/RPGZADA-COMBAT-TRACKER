import React from 'react';
    import { IoImageOutline } from 'react-icons/io5';
    import FileUpload from './FileUpload';
    import { IoTrash } from 'react-icons/io5';

    const CharacterForm = ({ newCharacter, handleInputChange, handleImageUpload, errorMessage, npcQuantity, setNpcQuantity, handleAddCharacter, handleTextFileUpload, handleClearAll, setShowInstructions }) => {
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
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded shadow-md relative">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Adicionar Personagem</h2>
          
          <div className="space-y-3">
            {/* Nome do Personagem */}
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Nome do Personagem</label>
              <input
                type="text"
                name="name"
                value={newCharacter.name}
                onChange={handleInputChange}
                placeholder="Nome"
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-base"
                style={inputStyle}
                autoComplete="off"
              />
              {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
            </div>

            {/* Tipo do Personagem */}
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Tipo do Personagem</label>
              <select
                name="type"
                value={newCharacter.type}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg text-gray-800 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-base"
              >
                <option value="Jogador">Jogador</option>
                <option value="NPC">NPC</option>
              </select>
            </div>

            {/* Quantidade de NPCs */}
            {newCharacter.type === 'NPC' && (
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Quantidade de NPCs</label>
                <input
                  type="number"
                  name="npcQuantity"
                  value={npcQuantity}
                  onChange={(e) => setNpcQuantity(parseInt(e.target.value, 10))}
                  onFocus={handleNpcQuantityFocus}
                  onBlur={handleNpcQuantityBlur}
                  placeholder="1"
                  className="w-full p-3 rounded-lg text-gray-800 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none appearance-none"
                  min="1"
                />
              </div>
            )}

            {/* Modificador de Iniciativa */}
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Modificador de Iniciativa</label>
              <input
                type="number"
                name="modifier"
                value={newCharacter.modifier}
                onChange={handleInputChange}
                onFocus={handleModifierFocus}
                onBlur={handleModifierBlur}
                placeholder="0"
                className="w-full p-3 rounded-lg text-gray-800 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none appearance-none"
                style={inputStyle}
              />
            </div>

            {/* Upload de Imagem */}
            <div className="space-y-2">
              {newCharacter.image && (
                <div className="w-24 h-24 rounded-lg mb-2 overflow-hidden mx-auto">
                  <img 
                    src={newCharacter.image} 
                    alt="Character Preview" 
                    className="w-full h-full object-cover" 
                    loading="lazy"
                  />
                </div>
              )}
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="hidden" 
                id="image-upload" 
              />
              <label 
                htmlFor="image-upload" 
                className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg cursor-pointer block text-center flex items-center justify-center touch:active-scale"
              >
                <IoImageOutline className="mr-2 dark:text-white text-gray-800 text-lg" />
                <span className="text-base">Escolher Imagem</span>
              </label>
            </div>

            {/* Botão Adicionar */}
            <button 
              onClick={handleAddCharacter} 
              className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg mt-2 touch:active-scale text-base font-medium"
            >
              Adicionar Personagem
            </button>
          </div>

          {/* File Upload */}
          <FileUpload handleTextFileUpload={handleTextFileUpload} />

          {/* Botão Limpar */}
          <div className="flex justify-start mt-4 items-center">
            <button 
              onClick={handleClearAll} 
              className="text-gray-400 hover:text-white text-2xl p-2 rounded-full touch:active-scale" 
              title="Limpar todos os dados"
              aria-label="Limpar todos os dados"
            >
              <IoTrash />
            </button>
            <button
              onClick={() => setShowInstructions(true)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 ml-auto"
              title="Instruções de importação"
            >
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="w-6 h-6" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" strokeMiterlimit="10" strokeWidth="32" d="M256 80a176 176 0 10176 176A176 176 0 00256 80z"></path><path fill="none" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="28" d="M200 202.29s.84-17.5 19.57-32.57C230.68 160.77 244 158.18 256 158c10.93-.14 20.69 1.67 26.53 4.45 10 4.76 29.47 16.38 29.47 41.09 0 26-17 37.81-36.37 50.8S251 281.43 251 296"></path><circle cx="250" cy="348" r="20"></circle></svg>
            </button>
          </div>
        </div>
      );
    };

    export default CharacterForm;
