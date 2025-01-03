import React, { useRef } from 'react';
    import { FaDiceD20, FaRedoAlt } from 'react-icons/fa';
    import { IoTrashOutline, IoPersonOutline, IoCaretDown } from 'react-icons/io5';

    const InitiativeList = ({
      sortedCharacters,
      theme,
      handleRollInitiative,
      handleDeleteCharacter,
      handleResetInitiatives,
      handleRollAll,
      dropdownOpen,
      toggleDropdown,
      handleRollAllInitiatives,
      dropdownRef
    }) => {
      return (
        <div className="w-full md:w-2/3 p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Lista de Iniciativas</h2>
            <div className="flex items-center relative" ref={dropdownRef}>
              <button onClick={handleRollAll} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mr-0">
                ROLAR INICIATIVAS
              </button>
              <button onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown()
                }} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-2 rounded h-full flex items-center">
                  <IoCaretDown className="text-lg"/>
                </button>
                {dropdownOpen && (
                  <div className="absolute top-full right-0 mt-1 bg-gray-700 rounded shadow-md z-10">
                    <button onClick={() => handleRollAllInitiatives('SOMENTE NPCS')} className="block w-full text-left py-2 px-4 hover:bg-gray-600">SOMENTE NPCS</button>
                    <button onClick={() => handleRollAllInitiatives('SOMENTE JOGADORES')} className="block w-full text-left py-2 px-4 hover:bg-gray-600">SOMENTE JOGADORES</button>
                  </div>
                )}
            </div>
          </div>
          <ul className="space-y-2 flex-grow overflow-y-auto">
            {sortedCharacters.map(character => (
              <li key={character.id} className={`p-4 rounded flex items-center justify-between ${theme === 'dark' ? 'bg-light-navy' : 'bg-gray-200'}`}>
                <div className="flex items-center">
                  {character.image ? (
                    <div className="w-16 h-16 mr-2 overflow-hidden">
                      <img src={character.image} alt="Character" className="object-cover w-full h-full" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 mr-2 flex items-center justify-center">
                      <IoPersonOutline className={`text-4xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                    </div>
                  )}
                  <div>
                    <div className="font-bold">{character.name}</div>
                    <div className="text-sm text-gray-400">{character.type}</div>
                    <div className="text-sm text-gray-400">Modificador: {character.modifier >= 0 ? '+' : ''}{character.modifier}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="font-bold text-2xl mr-4">{character.initiative}</span>
                  <button onClick={() => handleRollInitiative(character.id)} className="text-gray-400 hover:text-white mr-2"><FaDiceD20 /></button>
                  <button onClick={() => handleDeleteCharacter(character.id)} className="text-gray-400 hover:text-white"><IoTrashOutline /></button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-start">
          </div>
        </div>
      );
    };

    export default InitiativeList;
