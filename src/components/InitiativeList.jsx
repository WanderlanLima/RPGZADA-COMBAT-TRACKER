import React, { useState, useRef, useEffect, useMemo } from 'react';
    import { FaDiceD20, FaRedoAlt, FaHeart, FaShieldAlt } from 'react-icons/fa';
    import { IoTrashOutline, IoPersonOutline, IoCaretDown } from 'react-icons/io5';
    import { GiCrossedSwords } from 'react-icons/gi';
    import { BsArrowRight, BsPlus, BsDash } from 'react-icons/bs';
    import ConfirmationModal from './ConfirmationModal';
    import ResetConfirmationModal from './ResetConfirmationModal';
    import InitiativeInputModal from './InitiativeInputModal';
    import ConditionsModal from './ConditionsModal';

    const InitiativeList = ({
      sortedCharacters,
      theme,
      handleRollInitiative,
      handleDeleteCharacter,
      handleResetInitiatives,
      handleRollAll,
      handleRollAllInitiatives,
      setCharacters,
      characters,
      setBattleStarted,
      battleStarted,
      currentTurnIndex,
      nextTurn: handleNextTurn
    }) => {
      const characterRefs = useRef([]);

      const listContainerRef = useRef(null);

      useEffect(() => {
        if (battleStarted && currentTurnIndex !== null && characterRefs.current[currentTurnIndex]) {
          setTimeout(() => {
            const element = characterRefs.current[currentTurnIndex];
            const container = listContainerRef.current;
            const elementRect = element.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Calculate visible area with padding
            const viewportPadding = 100;
            const isElementVisible = (
              elementRect.top >= viewportPadding &&
              elementRect.bottom <= (windowHeight - viewportPadding)
            );

            // Only scroll if element is not fully visible
            if (!isElementVisible) {
              // Calculate scroll positions with padding
              const windowScrollY = window.scrollY + elementRect.top - 
                (windowHeight / 2) + (elementRect.height / 2);
              
              const containerScrollTop = element.offsetTop - 
                (containerRect.height / 2) + (elementRect.height / 2);
              
              // Scroll window first if needed
              if (elementRect.top < viewportPadding || 
                  elementRect.bottom > (windowHeight - viewportPadding)) {
                window.scrollTo({
                  top: windowScrollY,
                  behavior: 'smooth'
                });
              }

              // Then scroll container
              container.scrollTo({
                top: containerScrollTop,
                behavior: 'smooth'
              });
            }
          }, 100);
        }
      }, [currentTurnIndex, battleStarted]);
      const [dropdownOpen, setDropdownOpen] = useState(false);
      const dropdownRef = useRef(null);
      const conditionsDropdownRef = useRef(null);
      const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
      const [characterToDelete, setCharacterToDelete] = useState(null);
      const [showResetConfirmation, setShowResetConfirmation] = useState(false);
      const [showInitiativeInput, setShowInitiativeInput] = useState(false);
      const [characterToEdit, setCharacterToEdit] = useState(null);
      const [editModal, setEditModal] = useState({
        open: false,
        characterId: null,
        type: null,
        value: ''
      });
      const editInputRef = useRef(null);
      const [showConditionsModal, setShowConditionsModal] = useState(false);
      const [selectedCharacterForConditions, setSelectedCharacterForConditions] = useState(null);

      const toggleDropdown = (e) => {
        e.stopPropagation();
        setDropdownOpen(prev => !prev);
      };

      const handleDamageChange = (id, type, value) => {
        setCharacters(prevCharacters => prevCharacters.map(char => {
          if (char.id !== id) return char;
          
          const newChar = { ...char };
          
          if (type === 'tempHp') {
            newChar.tempHp = Math.max(0, (newChar.tempHp || 0) + value);
          } else if (type === 'damage') {
            // Primeiro subtrai da vida temporária se houver
            const remainingDamage = Math.max(0, value - (newChar.tempHp || 0));
            newChar.tempHp = Math.max(0, (newChar.tempHp || 0) - value);
            newChar.damage = Math.max(0, (newChar.damage || 0) + remainingDamage);
          } else if (type === 'healing') {
            // Apenas reduz o dano, não afeta a vida temporária
            newChar.damage = Math.max(0, (newChar.damage || 0) - value);
          }
          
          return newChar;
        }));
      };

      const handleConditionToggle = (id, condition) => {
        setCharacters(prevCharacters => prevCharacters.map(char =>
          char.id === id ? {
            ...char,
            conditions: Array.isArray(char.conditions) ? 
              (char.conditions.includes(condition) ?
                char.conditions.filter(c => c !== condition) :
                [...char.conditions, condition]) :
              [condition]
          } : char
        ));
      };

      useEffect(() => {
        const handleClick = (event) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownOpen(false);
          }
        };

        document.addEventListener('mousedown', handleClick);

        return () => {
          document.removeEventListener('mousedown', handleClick);
        };
      }, []);

      const handleOpenDeleteConfirmation = (id) => {
        setCharacterToDelete(id);
        setShowDeleteConfirmation(true);
      };

      const handleCloseDeleteConfirmation = () => {
        setShowDeleteConfirmation(false);
        setCharacterToDelete(null);
      };

      const handleConfirmDelete = () => {
        if (characterToDelete) {
          handleDeleteCharacter(characterToDelete);
          handleCloseDeleteConfirmation();
        }
      };

      const handleOpenResetConfirmation = () => {
        setShowResetConfirmation(true);
      };

      const handleCloseResetConfirmation = () => {
        setShowResetConfirmation(false);
      };

      const handleConfirmReset = () => {
        handleResetInitiatives();
        handleCloseResetConfirmation();
      };

      const handleOpenInitiativeInput = (id) => {
        setCharacterToEdit(id);
        setShowInitiativeInput(true);
      };

      const handleCloseInitiativeInput = () => {
        setShowInitiativeInput(false);
        setCharacterToEdit(null);
      };

      const handleConfirmInitiativeChange = (newInitiative) => {
        if (characterToEdit) {
          setCharacters(prevCharacters => prevCharacters.map(char =>
            char.id === characterToEdit ? { ...char, initiative: newInitiative } : char
          ));
          handleCloseInitiativeInput();
        }
      };

      const openEditModal = (characterId, type) => {
        setEditModal({
          open: true,
          characterId,
          type,
          value: ''
        });
      };

      useEffect(() => {
        if (editModal.open && editInputRef.current) {
          editInputRef.current.focus();
        }
      }, [editModal.open]);

      const closeEditModal = () => {
        setEditModal({
          open: false,
          characterId: null,
          type: null,
          value: ''
        });
      };

      const handleEditConfirm = () => {
        const value = parseInt(editModal.value);
        if (!isNaN(value) && editModal.characterId && editModal.type) {
          handleDamageChange(editModal.characterId, editModal.type, value);
          closeEditModal();
        }
      };

      const handleRollAllAndSetBattle = () => {
        // Verifica se todas as iniciativas foram roladas
        if (characters.every(char => char.initiative !== 0 && !char.needsRoll)) {
          setBattleStarted(true);
        } else {
          handleRollAll();
          setBattleStarted(true);
        }
      };

      const allInitiativesRolled = useMemo(() => {
        return characters.every(char => char.initiative !== 0 && !char.needsRoll);
      }, [characters]);

      const showBattleButton = useMemo(() => {
        return characters.length > 0 && allInitiativesRolled;
      }, [characters, allInitiativesRolled]);

      const commonConditions = [
        'Agarrado',
        'Amedrontado', 
        'Atordoado',
        'Caído',
        'Cego',
        'Confuso',
        'Contido',
        'Desafiado',
        'Dominado',
        'Enfeitiçado',
        'Envenenado',
        'Escondido',
        'Exaustão',
        'Incapacitado',
        'Inconsciente',
        'Invisível',
        'Marcado',
        'Paralisado',
        'Petrificado',
        'Possuído',
        'Rastreado',
        'Surdo'
      ];

      const handleOpenConditionsModal = (characterId) => {
        setSelectedCharacterForConditions(characterId);
        setShowConditionsModal(true);
      };

      const handleCloseConditionsModal = () => {
        setShowConditionsModal(false);
        setSelectedCharacterForConditions(null);
      };

      return (
        <div className={`bg-gray-100 dark:bg-gray-800 p-4 rounded shadow-md`}>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <h2 className="text-xl font-bold mr-2 text-gray-800 dark:text-white">Lista de Iniciativa</h2>
              {!battleStarted && (
                <button onClick={handleOpenResetConfirmation} className="text-gray-400 hover:text-white text-xl" title="Resetar Iniciativas">
                  <FaRedoAlt />
                </button>
              )}
            </div>
            <div className="flex items-center relative" ref={dropdownRef}>
              {showBattleButton && !battleStarted && (
                <button onClick={handleRollAllAndSetBattle} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mr-2 flex items-center">
                  <GiCrossedSwords className="mr-2" />
                  Iniciar batalha
                </button>
              )}
              {battleStarted && (
                <button 
                  onClick={handleNextTurn} 
                  className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded mr-0 flex items-center fixed bottom-4 right-4 md:static z-50" 
                  style={{ backgroundColor: 'rgb(60,36,92)' }}
                >
                  Próximo Turno
                  <BsArrowRight className="ml-2" />
                </button>
              )}
              {!battleStarted && (
                <button onClick={handleRollAll} className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded mr-2">
                  Rolar Iniciativas
                </button>
              )}
              {!battleStarted && (
                <button onClick={toggleDropdown} className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-2 rounded h-full flex items-center">
                  <IoCaretDown className="text-lg" />
                </button>
              )}
              {dropdownOpen && !battleStarted && (
                <div className="absolute top-full right-0 mt-1 bg-gray-700 rounded shadow-md z-10">
                  <button onClick={() => handleRollAllInitiatives('SOMENTE NPCS')} className="block w-full text-left py-2 px-4 hover:bg-gray-600">SOMENTE NPCS</button>
                  <button onClick={() => handleRollAllInitiatives('SOMENTE JOGADORES')} className="block w-full text-left py-2 px-4 hover:bg-gray-600">SOMENTE JOGADORES</button>
                </div>
              )}
            </div>
          </div>
          <ul className="space-y-2 flex-grow overflow-y-auto">
            {sortedCharacters.map((character, index) => (
              <li key={character.id} className={`p-4 rounded flex items-center justify-between ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${battleStarted && index === currentTurnIndex ? 'pulsing-border' : ''}`}>
                <div className="flex items-center flex-col md:flex-row">
                  <div className="w-16 h-16 mr-2 overflow-hidden rounded-full relative border-2 border-purple-500">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id={`image-upload-${character.id}`}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setCharacters(prevCharacters => prevCharacters.map(char =>
                              char.id === character.id ? { ...char, image: event.target.result } : char
                            ));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    {character.image ? (
                      <img 
                        src={character.image} 
                        alt="Character" 
                        className="object-cover w-full h-full" 
                      />
                    ) : (
                      <label 
                        htmlFor={`image-upload-${character.id}`}
                        className="w-full h-full flex items-center justify-center rounded-full bg-gray-600 dark:bg-gray-700 cursor-pointer hover:bg-gray-500"
                      >
                        <IoPersonOutline className={`text-4xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-100'}`} />
                      </label>
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 dark:text-white">{character.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{character.type}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {battleStarted ? `Iniciativa: ${character.initiative}` : `Modificador: ${character.modifier >= 0 ? '+' : ''}${character.modifier}`}
                    </div>
                    
                    {/* Damage Controls */}
                    {battleStarted && (
                      <div className="flex flex-row space-x-2 mt-1">
                        <button 
                          onClick={() => openEditModal(character.id, 'damage')}
                          className="flex items-center space-x-2 p-2 rounded bg-gray-600 hover:bg-gray-500"
                        >
                          <GiCrossedSwords className="text-red-500" />
                          <span>Dano: {character.damage || 0}</span>
                        </button>

                        <button 
                          onClick={() => openEditModal(character.id, 'healing')}
                          className="flex items-center space-x-2 p-2 rounded bg-gray-600 hover:bg-gray-500"
                        >
                          <FaHeart className="text-green-500" />
                          <span>Cura: {character.healing || 0}</span>
                        </button>

                        <button 
                          onClick={() => openEditModal(character.id, 'tempHp')}
                          className="flex items-center space-x-2 p-2 rounded bg-gray-600 hover:bg-gray-500"
                        >
                          <FaShieldAlt className="text-blue-400" />
                          <span>Vida Temp: {character.tempHp || 0}</span>
                        </button>
                        <button 
                          onClick={() => handleOpenConditionsModal(character.id)}
                          className="flex items-center space-x-2 p-2 rounded bg-gray-600 hover:bg-gray-500"
                        >
                          <GiCrossedSwords className="text-yellow-500" />
                          <span>Condições</span>
                        </button>
                      </div>
                    )}

                    {editModal.open && editModal.characterId === character.id && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-gray-700 p-6 rounded-lg w-96">
                          <h3 className="text-lg font-bold mb-4">
                            {editModal.type === 'damage' && 'Adicionar Dano'}
                            {editModal.type === 'healing' && 'Adicionar Cura'} 
                            {editModal.type === 'tempHp' && 'Adicionar Vida Temporária'}
                          </h3>
                          <input
                            type="number"
                            min="0"
                            className="w-full px-3 py-2 rounded bg-gray-600 text-white mb-4"
                            placeholder="Valor"
                            value={editModal.value}
                            onChange={(e) => setEditModal(prev => ({...prev, value: e.target.value}))}
                            ref={editInputRef}
                          />
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={closeEditModal}
                              className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={handleEditConfirm}
                              className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-500"
                            >
                              Confirmar
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1 mt-2">
                      {(Array.isArray(character.conditions) ? character.conditions : []).map(condition => (
                        <div
                          key={condition}
                          onClick={() => handleConditionToggle(character.id, condition)}
                          className={`text-xs px-2 py-1 rounded-full cursor-pointer transition-all`}
                          style={{ backgroundColor: 'rgb(140,60,244)', color: 'white' }}
                        >
                          {condition}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  {!battleStarted && (
                    <span
                      onClick={() => handleOpenInitiativeInput(character.id)}
                      className="font-bold text-2xl mr-4 text-gray-800 dark:text-white w-16 text-center cursor-pointer px-2 py-1 hover:text-purple-500"
                      style={{ display: 'inline-block', margin: '0 1rem', padding: '0.2rem 0.4rem' }}
                    >
                      {character.initiative}
                    </span>
                  )}
                  {battleStarted && character.needsRoll && (
                    <button onClick={() => handleRollInitiative(character.id)} className="text-gray-400 hover:text-white mr-2"><FaDiceD20 /></button>
                  )}
                  <div className="flex items-center">
                    <button onClick={() => handleOpenDeleteConfirmation(character.id)} className="text-gray-400 hover:text-white"><IoTrashOutline /></button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="fixed bottom-4 left-4 flex gap-2">
          </div>
          <ConfirmationModal
            showConfirmation={showDeleteConfirmation}
            handleCloseConfirmation={handleCloseDeleteConfirmation}
            handleConfirmDelete={handleConfirmDelete}
            theme={theme}
          />
          <ResetConfirmationModal
            showConfirmation={showResetConfirmation}
            handleCloseConfirmation={handleCloseResetConfirmation}
            handleConfirmReset={handleConfirmReset}
            theme={theme}
          />
          <InitiativeInputModal
            showModal={showInitiativeInput}
            handleCloseModal={handleCloseInitiativeInput}
            handleConfirmChange={handleConfirmInitiativeChange}
            character={characters.find(char => char.id === characterToEdit)}
            theme={theme}
          />
          <ConditionsModal
            showModal={showConditionsModal}
            handleCloseModal={handleCloseConditionsModal}
            character={characters.find(char => char.id === selectedCharacterForConditions)}
            theme={theme}
            handleConditionToggle={handleConditionToggle}
            commonConditions={commonConditions}
          />
        </div>
      );
    };

    export default InitiativeList;
