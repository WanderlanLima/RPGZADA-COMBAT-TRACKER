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

      <div className="grid gap-4">
        {filteredCharacters.map((character) => (
          <div key={character.id} className="gamer-bg p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-white">{character.name}</h3>
                <p className="text-sm text-gray-400">{character.type}</p>
              </div>
              <span className="text-white">{character.initiative || '-'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterList;
