import React from 'react';
    import { IoImageOutline } from 'react-icons/io5';

    const CharacterForm = ({ newCharacter, handleInputChange, handleImageUpload, errorMessage, npcQuantity, setNpcQuantity, handleAddCharacter }) => {
      return (
        <div className="w-full md:w-1/3 p-6 border-r border-gray-700 flex flex-col">
          <h2 className="text-xl font-bold mb-4">Adicionar Personagem</h2>
          <div className="mb-4">
            <label className="block text-sm mb-1">Nome do Personagem</label>
            <input
              type="text"
              name="name"
              value={newCharacter.name}
              onChange={handleInputChange}
              placeholder="Nome"
              className="w-full p-2 rounded text-gray-800 bg-white border border-gray-400"
            />
            {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Tipo do Personagem</label>
            <select
              name="type"
              value={newCharacter.type}
              onChange={handleInputChange}
              className="w-full p-2 rounded text-gray-800 bg-white border border-gray-400"
            >
              <option value="Jogador">Jogador</option>
              <option value="NPC">NPC</option>
            </select>
          </div>
          {newCharacter.type === 'NPC' && (
            <div className="mb-4">
              <label className="block text-sm mb-1">Quantidade de NPCs</label>
              <input
                type="number"
                name="npcQuantity"
                value={npcQuantity}
                onChange={(e) => setNpcQuantity(parseInt(e.target.value, 10))}
                placeholder="1"
                className="w-full p-2 rounded text-gray-800 bg-white border border-gray-400"
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-sm mb-1">Modificador de Iniciativa</label>
            <input
              type="number"
              name="modifier"
              value={newCharacter.modifier}
              onChange={handleInputChange}
              placeholder="0"
              className="w-full p-2 rounded text-gray-800 bg-white border border-gray-400"
            />
          </div>
          <div className="mb-4">
            {newCharacter.image && (
              <div className="w-24 h-24 rounded mb-2 overflow-hidden">
                <img src={newCharacter.image} alt="Character Preview" className="w-full h-full object-cover" />
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
            <label htmlFor="image-upload" className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded cursor-pointer block text-center flex items-center justify-center">
              <IoImageOutline className="mr-2" />
              Imagem do Personagem
            </label>
            <button onClick={handleAddCharacter} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded mt-2">
              Adicionar Personagem
            </button>
          </div>
        </div>
      );
    };

    export default CharacterForm;
