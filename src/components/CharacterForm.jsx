import React from 'react';
    import { IoImageOutline } from 'react-icons/io5';
    import FileUpload from './FileUpload';

    const CharacterForm = ({ newCharacter, handleInputChange, handleImageUpload, errorMessage, npcQuantity, setNpcQuantity, handleAddCharacter, handleTextFileUpload }) => {
      return (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded shadow-md">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Adicionar Personagem</h2>
          <div className="mb-3">
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Nome do Personagem</label>
            <input
              type="text"
              name="name"
              value={newCharacter.name}
              onChange={handleInputChange}
              placeholder="Nome"
              className="w-full p-2 rounded text-gray-800 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            />
            {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
          </div>
          <div className="mb-3">
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Tipo do Personagem</label>
            <select
              name="type"
              value={newCharacter.type}
              onChange={handleInputChange}
              className="w-full p-2 rounded text-gray-800 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            >
              <option value="Jogador">Jogador</option>
              <option value="NPC">NPC</option>
            </select>
          </div>
          {newCharacter.type === 'NPC' && (
            <div className="mb-3">
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Quantidade de NPCs</label>
              <input
                type="number"
                name="npcQuantity"
                value={npcQuantity}
                onChange={(e) => setNpcQuantity(parseInt(e.target.value, 10))}
                placeholder="1"
                className="w-full p-2 rounded text-gray-800 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
            </div>
          )}
          <div className="mb-3">
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Modificador de Iniciativa</label>
            <input
              type="number"
              name="modifier"
              value={newCharacter.modifier}
              onChange={handleInputChange}
              placeholder="0"
              className="w-full p-2 rounded text-gray-800 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none appearance-none"
            />
          </div>
          <div className="mb-3">
            {newCharacter.image && (
              <div className="w-24 h-24 rounded mb-2 overflow-hidden">
                <img src={newCharacter.image} alt="Character Preview" className="w-full h-full object-cover" />
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
            <label htmlFor="image-upload" className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded cursor-pointer block text-center flex items-center justify-center">
              <IoImageOutline className="mr-2" />
              Escolher Imagem
            </label>
            <button onClick={handleAddCharacter} className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded mt-2">
              Adicionar Personagem
            </button>
          </div>
          <FileUpload handleTextFileUpload={handleTextFileUpload} />
        </div>
      );
    };

    export default CharacterForm;
