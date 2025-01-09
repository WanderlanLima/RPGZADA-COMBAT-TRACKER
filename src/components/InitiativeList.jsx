import React, { useState, useRef, useEffect, useMemo } from 'react';
    import '../styles/game-effects.css';
    import { FaDiceD20, FaRedoAlt, FaHeart, FaShieldAlt, FaSkull, FaSmile } from 'react-icons/fa';
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
          const [selectedCharacter, setSelectedCharacter] = useState(null);
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
          const [editError, setEditError] = useState(null);
          const editInputRef = useRef(null);
          const [showConditionsModal, setShowConditionsModal] = useState(false);
          const [selectedCharacterForConditions, setSelectedCharacterForConditions] = useState(null);

          const toggleDropdown = (e, characterId) => {
            e.stopPropagation();
            setSelectedCharacter(characters.find(char => char.id === characterId));
            setDropdownOpen(prev => !prev);
          };

          const handleDamageChange = (id, type, value) => {
            setCharacters(prevCharacters => prevCharacters.map(char => {
              if (char.id !== id) return char;
              
              const newChar = { ...char };
              
              // Personagens mortos não podem receber dano/cura
              if (newChar.status === 'dead') {
                return newChar;
              }

              if (type === 'tempHp') {
                newChar.tempHp = Math.max(0, (newChar.tempHp || 0) + value);
              } else if (type === 'damage') {
                // Personagens morrendo não podem receber dano adicional
                if (newChar.status !== 'dying') {
                  // Primeiro subtrai da vida temporária se houver
                  const remainingDamage = Math.max(0, value - (newChar.tempHp || 0));
                  newChar.tempHp = Math.max(0, (newChar.tempHp || 0) - value);
                  newChar.damage = Math.max(0, (newChar.damage || 0) + remainingDamage);
                }
              } else if (type === 'healing') {
                // Personagens morrendo não podem receber cura
                if (newChar.status !== 'dying') {
                  // Feedback visual para tentativa de cura em personagem morrendo
                  newChar.deathAnimation = true;
                  // Apenas reduz o dano, não afeta a vida temporária
                  newChar.damage = Math.max(0, (newChar.damage || 0) - value);
                }
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
            const character = characters.find(char => char.id === editModal.characterId);
            
            if (!isNaN(value) && editModal.characterId && editModal.type) {
              // Verifica se o personagem está morto ou morrendo
              if (character.status === 'dead') {
                setEditError('Personagem morto não pode receber dano ou cura!');
                return;
              }
              
              if (character.status === 'dying' && 
                  (editModal.type === 'damage' || editModal.type === 'healing')) {
                setEditError('Personagem morrendo não pode receber dano ou cura!');
                return;
              }
              
              setEditError(null);
              handleDamageChange(editModal.characterId, editModal.type, value);
              closeEditModal();
            }
          };

          const handleDeathSave = (id, type, index) => {
            setCharacters(prevCharacters => prevCharacters.map(char => {
              if (char.id !== id) return char;
              
              const newChar = { ...char };
              newChar.deathSaves = newChar.deathSaves || { success: 0, failure: 0 };
              
              if (type === 'success') {
                newChar.deathSaves.success = Math.max(0, Math.min(3, index + 1));
              } else if (type === 'failure') {
                newChar.deathSaves.failure = Math.max(0, Math.min(3, index + 1));
                
                // Se atingir 3 falhas
                if (newChar.deathSaves.failure === 3) {
                  // Adiciona animação de morte
                  newChar.deathAnimation = true;
                  // Atualiza status para morto
                  newChar.status = 'dead';
                  // Remove a condição de salvaguarda
                  newChar.conditions = newChar.conditions?.filter(c => c !== 'Salvaguarda de Morte');
                  // Reseta os pontos de vida
                  newChar.damage = 0;
                  newChar.tempHp = 0;
                }
              }
              
              return newChar;
            }));
          };

          // Pular turno de personagens mortos
          const handleNextTurnWithDeathCheck = () => {
            let nextIndex = currentTurnIndex;
            let attempts = 0;
            
            do {
              nextIndex = (nextIndex + 1) % sortedCharacters.length;
              attempts++;
              
              // Se o personagem estiver morto, pula para o próximo
              const character = sortedCharacters[nextIndex];
              if (character.deathSaves?.failure === 3) {
                continue;
              }
              
              // Se encontrou um personagem vivo ou atingiu o limite de tentativas
              if (attempts >= sortedCharacters.length || 
                  character.deathSaves?.failure !== 3) {
                break;
              }
            } while (true);
            
            handleNextTurn(nextIndex);
          };

          const [filterType, setFilterType] = useState('all');
          const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);

          const handleFilterChange = (type) => {
            setFilterType(type);
            setFilterDropdownOpen(false);
          };

          const filteredCharacters = useMemo(() => {
            if (filterType === 'all') return sortedCharacters;
            return sortedCharacters.filter(char => 
              filterType === 'npc' ? char.type === 'npc' : char.type === 'player'
            );
          }, [sortedCharacters, filterType]);

          const handleRollAllAndSetBattle = () => {
            // Verifica se todas as iniciativas foram roladas
            if (characters.every(char => char.initiative !== 0 && !char.needsRoll)) {
              setBattleStarted(true);
            } else {
              handleRollAll();
              setBattleStarted(true);
            }
          };

          // Efeito para animação de morte
          useEffect(() => {
            const deathAnimationTimeout = setTimeout(() => {
              setCharacters(prevCharacters => prevCharacters.map(char => ({
                ...char,
                deathAnimation: false
              })));
            }, 2000); // Duração da animação
            
            return () => clearTimeout(deathAnimationTimeout);
          }, [characters.filter(char => char.deathAnimation).length]);

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
            'Surdo',
            'Salvaguarda de Morte'
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
            <div className={`gamer-bg p-4 rounded-lg shadow-lg`}>
              <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-3 md:space-y-0">
                <div className="flex items-center space-x-3">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">Lista de Iniciativa</h2>
                  {!battleStarted && (
                    <button 
                      onClick={handleOpenResetConfirmation} 
                      className="text-gray-400 hover:text-white text-xl touch:active-scale p-1 rounded-full hover:bg-gray-600 transition-colors" 
                      title="Resetar Iniciativas"
                      aria-label="Resetar Iniciativas"
                    >
                      <FaRedoAlt />
                    </button>
                  )}
                </div>
                {!battleStarted && (
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={handleRollAll} 
                      className="gamer-button text-white py-2 px-4 rounded-lg touch:active-scale hover:bg-purple-600 transition-colors"
                    >
                      <span className="text-base">Rolar Iniciativas</span>
                    </button>
                    <div className="relative ml-2" ref={dropdownRef}>
                      <button 
                        className="gamer-button text-white py-2 px-3 rounded-lg h-full flex items-center justify-center touch:active-scale hover:bg-purple-600/50 transition-all duration-300 border border-purple-500 hover:border-purple-400 hover:brightness-110"
                        onClick={(e) => toggleDropdown(e, null)}
                      >
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="text-xl mr-1" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg">
                          <path d="M98 190.06l139.78 163.12a24 24 0 0036.44 0L414 190.06c13.34-15.57 2.28-39.62-18.22-39.62h-279.6c-20.5 0-31.56 24.05-18.18 39.62z"></path>
                        </svg>
                      </button>
                      {dropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 bg-gray-700 rounded-lg shadow-md z-10 w-48 transform transition-all duration-200 ease-out origin-top scale-y-0 opacity-0 animate-dropdown border border-purple-500/30">
                          <style jsx>{`
                            @keyframes dropdown {
                              0% {
                                opacity: 0;
                                transform: translateY(-10px);
                              }
                              100% {
                                opacity: 1;
                                transform: translateY(0);
                              }
                            }
                            .animate-dropdown {
                              animation: dropdown 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                            }
                          `}</style>
                          <button
                            className="w-full text-left px-4 py-3 hover:bg-gray-600/50 rounded-t-lg transition-colors duration-200"
                            onClick={() => {
                              handleRollAllInitiatives('SOMENTE NPCS');
                              setDropdownOpen(false);
                            }}
                          >
                            Somente NPCs
                          </button>
                          <button
                            className="w-full text-left px-4 py-3 hover:bg-gray-600/50 rounded-b-lg transition-colors duration-200"
                            onClick={() => {
                              handleRollAllInitiatives('SOMENTE JOGADORES');
                              setDropdownOpen(false);
                            }}
                          >
                            Somente Jogadores
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {showBattleButton && !battleStarted && (
                  <button 
                    onClick={handleRollAllAndSetBattle} 
                    className="gamer-button text-white py-2 px-4 rounded-lg mr-2 flex items-center touch:active-scale"
                  >
                    <GiCrossedSwords className="mr-2" />
                    <span className="text-base">Iniciar batalha</span>
                  </button>
                )}
                {battleStarted && (
                  <button 
                    onClick={handleNextTurnWithDeathCheck} 
                    className="gamer-button text-white py-3 px-6 rounded-lg flex items-center fixed bottom-4 right-4 md:static z-50 touch:active-scale"
                  >
                    <span className="text-base">Próximo Turno</span>
                    <BsArrowRight className="ml-2" />
                  </button>
                )}
              </div>
              <ul className="space-y-2 flex-grow overflow-y-auto pb-16 md:pb-0">
                {filteredCharacters.map((character, index) => (
                  <li key={character.id} className={`p-4 rounded flex flex-col md:flex-row items-center justify-between transition-all duration-300 ${
                    theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                  } ${
                    battleStarted && index === currentTurnIndex ? 'pulsing-border' : ''
                  } ${
                    character.status === 'dying' ? 'bg-yellow-900 hover:bg-yellow-800' : 
                    character.status === 'dead' ? 'bg-red-900 hover:bg-red-800' : ''
                  } ${
                    character.deathAnimation ? 'animate-pulse' : ''
                  }`}>
                    <div className="flex items-center flex-col md:flex-row w-full">
                      <div className="w-16 h-16 mr-2 overflow-hidden rounded-full relative border-2 border-purple-500 flex-shrink-0">
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
                            loading="lazy"
                          />
                        ) : (
                          <label 
                            htmlFor={`image-upload-${character.id}`}
                            className="w-full h-full flex items-center justify-center rounded-full bg-gray-600 dark:bg-gray-700 cursor-pointer hover:bg-gray-500 touch:active-scale"
                          >
                            <IoPersonOutline className={`text-4xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-100'}`} />
                          </label>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-gray-800 dark:text-white truncate">{character.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{character.type}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {battleStarted ? `Iniciativa: ${character.initiative}` : `Modificador: ${character.modifier >= 0 ? '+' : ''}${character.modifier}`}
                        </div>
                        
                        {/* Damage Controls */}
                        {battleStarted && (
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <button 
                              onClick={() => openEditModal(character.id, 'damage')}
                              className="gamer-button flex items-center space-x-2 p-2 rounded-lg touch:active-scale hover:brightness-110 hover:border hover:border-opacity-50 transition-all duration-200"
                            >
                              <GiCrossedSwords className="text-red-500" />
                              <span className="text-sm">Dano: {character.damage || 0}</span>
                            </button>

                            <button 
                              onClick={() => openEditModal(character.id, 'healing')}
                              className="gamer-button flex items-center space-x-2 p-2 rounded-lg touch:active-scale hover:brightness-110 hover:border hover:border-opacity-50 transition-all duration-200"
                            >
                              <FaHeart className="text-green-500" />
                              <span className="text-sm">Cura: {character.healing || 0}</span>
                            </button>

                            <button 
                              onClick={() => openEditModal(character.id, 'tempHp')}
                              className="gamer-button flex items-center space-x-2 p-2 rounded-lg touch:active-scale hover:brightness-110 hover:border hover:border-opacity-50 transition-all duration-200"
                            >
                              <FaShieldAlt className="text-blue-400" />
                              <span className="text-sm">Vida Temp: {character.tempHp || 0}</span>
                            </button>

                            <button 
                              onClick={() => handleOpenConditionsModal(character.id)}
                              className="gamer-button flex items-center space-x-2 p-2 rounded-lg touch:active-scale hover:brightness-110 hover:border hover:border-opacity-50 transition-all duration-200"
                            >
                              <GiCrossedSwords className="text-yellow-500" />
                              <span className="text-sm">Condições</span>
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
                              {editError && (
                                <div className="mb-4 p-2 bg-red-900 text-red-200 rounded">
                                  {editError}
                                </div>
                              )}
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

                        {character.conditions?.includes('Salvaguarda de Morte') && (
                          <div className="mt-4">
                            <div className="flex flex-col gap-1 mb-2">
                              <span className="text-sm">Sucesso:</span>
                              <div className="flex gap-1">
                                {[1, 2, 3].map((_, i) => (
                                  <button
                                    key={i}
                                    onClick={() => handleDeathSave(character.id, 'success', i)}
                                    className={`gamer-button p-1 rounded-full ${character.deathSaves?.success > i ? 'text-green-500' : 'text-gray-500'}`}
                                  >
                                    <FaSmile />
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-sm">Falha:</span>
                              <div className="flex gap-1">
                                {[1, 2, 3].map((_, i) => (
                                  <button
                                    key={i}
                                    onClick={() => handleDeathSave(character.id, 'failure', i)}
                                    className={`gamer-button p-1 rounded-full ${character.deathSaves?.failure > i ? 'text-red-500' : 'text-gray-500'}`}
                                  >
                                    <FaSkull />
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      {!battleStarted && (
                        <span
                          onClick={() => handleOpenInitiativeInput(character.id)}
                          className="font-bold text-2xl mr-4 text-gray-800 dark:text-white w-16 text-center cursor-pointer px-2 py-1 hover:text-purple-500 font-dice"
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
