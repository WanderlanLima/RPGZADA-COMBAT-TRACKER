import React, { useState } from 'react';
import DropdownMenu from './DropdownMenu';

const CharacterList = ({ characters, onRollInitiative }) => {
  const [filter, setFilter] = useState('all');

  const filteredCharacters = characters.filter(character => {
    if (filter === 'npc') return character.type === 'NPC';
    if (filter === 'player') return character.type === 'Jogador';
    return true;
  });

  const handleRollInitiative = () => {
    const charactersToRoll = filteredCharacters;
    onRollInitiative(charactersToRoll);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <DropdownMenu onFilterChange={setFilter} />
        
        <button
          onClick={handleRollInitiative}
          className="gamer-button text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition-all"
        >
          Rolar Iniciativa
        </button>
      </div>

      <div className="grid gap-4 px-4 sm:px-0">
        {filteredCharacters.map((character) => (
          <div key={character.id} className="gamer-bg p-4 rounded-lg w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-white truncate">{character.name}</h3>
                <p className="text-sm text-gray-400">{character.type}</p>
              </div>
              <span className="text-white text-lg sm:text-base font-medium px-3 py-1 sm:px-2 sm:py-0.5 bg-purple-900/50 rounded-full">
                {character.initiative || '-'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterList;
