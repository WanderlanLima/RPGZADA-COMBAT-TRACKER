import React, { useState, useRef, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import '../styles/game-effects.css';
import { FaDiceD20, FaRedoAlt, FaHeart, FaShieldAlt, FaSkull, FaSmile } from 'react-icons/fa';
import { IoTrashOutline, IoPersonOutline, IoCaretDown, IoCloseOutline, IoCheckmarkCircle } from 'react-icons/io5';
import { GiCrossedSwords, GiAnticlockwiseRotation, GiRollingDices } from 'react-icons/gi';
import { BsArrowRight, BsPlus, BsDash } from 'react-icons/bs';
import ConfirmationModal from './ConfirmationModal';
import ConditionsModal from './ConditionsModal';
import InitiativeInputModal from './InitiativeInputModal';
import D20Button from './D20Button';

const InitiativeList = ({
  sortedCharacters,
  theme,
  handleRollInitiative,
  handleDeleteCharacter,
  handleResetInitiatives,
  handleRollAll,
  setCharacters,
  characters,
  setBattleStarted,
  battleStarted,
  currentTurnIndex,
  nextTurn
}) => {
  const characterRefs = useRef([]);
  const listContainerRef = useRef(null);
  const [turnCount, setTurnCount] = useState(1);

  // Função para rolar até o personagem atual
  const scrollToCurrentCharacter = () => {
    if (battleStarted && currentTurnIndex !== null && characterRefs.current[currentTurnIndex]) {
      const element = characterRefs.current[currentTurnIndex];
      const container = listContainerRef.current;
      if (element && container) {
        requestAnimationFrame(() => {
          const elementRect = element.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          const elementCenter = elementRect.top + elementRect.height / 2;
          const containerCenter = containerRect.top + containerRect.height / 2;
          const scrollOffset = elementCenter - containerCenter;
          
          container.scrollBy({
            top: scrollOffset,
            behavior: 'smooth'
          });
        });
      }
    }
  };

  // Efeito para rolar quando o turno mudar
  useEffect(() => {
    if (currentTurnIndex !== null) {
      setTimeout(scrollToCurrentCharacter, 50);
    }
  }, [currentTurnIndex, battleStarted]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const dropdownRef = useRef(null);
  const conditionsDropdownRef = useRef(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    characterId: null
  });
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

  const useCharacterState = (character, setCharacters) => {
    const handleStatusChange = (type, value) => {
      setCharacters(prevCharacters => prevCharacters.map(char => {
        if (char.id !== character.id) return char;
        
        const newChar = { ...char };
        if (newChar.status === 'dead') return newChar;

        switch(type) {
          case 'tempHp':
            newChar.tempHp = Math.max(0, (newChar.tempHp || 0) + value);
            break;
          case 'damage':
            if (newChar.status !== 'dying') {
              const remainingDamage = Math.max(0, value - (newChar.tempHp || 0));
              newChar.tempHp = Math.max(0, (newChar.tempHp || 0) - value);
              newChar.damage = Math.max(0, (newChar.damage || 0) + remainingDamage);
            }
            break;
          case 'healing':
            if (newChar.status !== 'dying') {
              newChar.deathAnimation = true;
              newChar.damage = Math.max(0, (newChar.damage || 0) - value);
            }
            break;
        }
        
        return newChar;
      }));
    };

    const handleConditionToggle = (condition) => {
      setCharacters(prevCharacters => prevCharacters.map(char => {
        if (char.id !== character.id) return char;
        
        const currentConditions = Array.isArray(char.conditions) ? char.conditions : [];
        const updatedConditions = currentConditions.includes(condition) 
          ? currentConditions.filter(c => c !== condition)
          : [...currentConditions, condition];
        
        return {
          ...char,
          conditions: updatedConditions
        };
      }));
    };

    return {
      handleStatusChange,
      handleConditionToggle
    };
  };

  const CharacterActions = ({ character, onAction, disabled }) => {
    const handleClick = (e, action) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        onAction(action, character.id);
      }
    };

    return (
      <div className="grid grid-cols-2 gap-2 mt-2 relative z-10" onClick={e => e.stopPropagation()}>
        <button 
          onClick={(e) => handleClick(e, 'DAMAGE')}
          disabled={disabled || character.status === 'dead'}
          className={`gamer-button flex items-center space-x-2 p-2 rounded-lg z-20 ${
            character.status === 'dead' ? 'opacity-50 cursor-not-allowed' : 'touch:active-scale hover:brightness-110 hover:border hover:border-opacity-50'
          } transition-all duration-200`}
        >
          <GiCrossedSwords className="text-red-500" />
          <span className="text-sm">Dano: {character.damage || 0}</span>
        </button>

        <button 
          onClick={(e) => handleClick(e, 'HEAL')}
          disabled={disabled || character.status === 'dead'}
          className={`gamer-button flex items-center space-x-2 p-2 rounded-lg z-20 ${
            character.status === 'dead' ? 'opacity-50 cursor-not-allowed' : 'touch:active-scale hover:brightness-110 hover:border hover:border-opacity-50'
          } transition-all duration-200`}
        >
          <FaHeart className="text-green-500" />
          <span className="text-sm">Cura: {character.healing || 0}</span>
        </button>

        <button 
          onClick={(e) => handleClick(e, 'TEMP_HP')}
          disabled={disabled || character.status === 'dead'}
          className={`gamer-button flex items-center space-x-2 p-2 rounded-lg z-20 ${
            character.status === 'dead' ? 'opacity-50 cursor-not-allowed' : 'touch:active-scale hover:brightness-110 hover:border hover:border-opacity-50'
          } transition-all duration-200`}
        >
          <FaShieldAlt className="text-blue-400" />
          <span className="text-sm">Vida Temp: {character.tempHp || 0}</span>
        </button>

        <button 
          onClick={(e) => handleClick(e, 'conditions')}
          disabled={disabled || character.status === 'dead'}
          className={`gamer-button flex items-center space-x-2 p-2 rounded-lg z-20 ${
            character.status === 'dead' ? 'opacity-50 cursor-not-allowed' : 'touch:active-scale hover:brightness-110 hover:border hover:border-opacity-50'
          } transition-all duration-200`}
        >
          <GiCrossedSwords className="text-yellow-500" />
          <span className="text-sm">Condições</span>
        </button>
      </div>
    );
  };

  const handleDamageChange = (id, type, value) => {
    const character = characters.find(char => char.id === id);
    const { handleStatusChange } = useCharacterState(character, setCharacters);
    handleStatusChange(type, value);
  };

  const handleConditionToggle = (characterId, condition) => {
    setCharacters(prevCharacters => {
      return prevCharacters.map(char => {
        if (char.id !== characterId) return char;
        
        const currentConditions = Array.isArray(char.conditions) ? [...char.conditions] : [];
        const hasCondition = currentConditions.includes(condition);
        let updatedConditions;
        let status = char.status;
        let deathSaves = char.deathSaves || { successes: 0, failures: 0 };
        
        if (condition === 'Morto') {
          if (!hasCondition) {
            // Adicionando condição Morto
            updatedConditions = [...currentConditions, condition];
            status = 'dead';
            deathSaves = { successes: 0, failures: 3 }; // Define 3 falhas
            // Remove a condição "Salvaguarda de Morte" se existir
            updatedConditions = updatedConditions.filter(c => c !== 'Salvaguarda de Morte');
          } else {
            // Removendo condição Morto
            updatedConditions = currentConditions.filter(c => c !== condition);
            status = 'alive';
            deathSaves = { successes: 0, failures: 0 }; // Reseta as salvaguardas
          }
        } else {
          // Para outras condições, comportamento normal
          updatedConditions = hasCondition
            ? currentConditions.filter(c => c !== condition)
            : [...currentConditions, condition];
        }
        
        return { 
          ...char, 
          conditions: updatedConditions,
          status,
          deathSaves
        };
      });
    });
  };

  const handleOpenConditionsModal = (characterId) => {
    const character = characters.find(char => char.id === characterId);
    if (character && character.status !== 'dead') {
      setSelectedCharacterForConditions(characterId);
      setShowConditionsModal(true);
    }
  };

  const handleCloseConditionsModal = () => {
    setShowConditionsModal(false);
    setSelectedCharacterForConditions(null);
  };

  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const updateDropdownPosition = () => {
    if (dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      });
    }
  };

  useEffect(() => {
    if (dropdownOpen) {
      updateDropdownPosition();
      window.addEventListener('scroll', updateDropdownPosition);
      window.addEventListener('resize', updateDropdownPosition);
      
      const handleClick = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setDropdownOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClick);
      
      return () => {
        window.removeEventListener('scroll', updateDropdownPosition);
        window.removeEventListener('resize', updateDropdownPosition);
        document.removeEventListener('mousedown', handleClick);
      };
    }
  }, [dropdownOpen]);

  const handleOpenDeleteConfirmation = (characterId) => {
    setDeleteConfirmation({
      isOpen: true,
      characterId
    });
  };

  const handleCloseDeleteConfirmation = () => {
    setDeleteConfirmation({
      isOpen: false,
      characterId: null
    });
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmation.characterId && handleDeleteCharacter) {
      handleDeleteCharacter(deleteConfirmation.characterId);
      handleCloseDeleteConfirmation();
    }
  };

  const handleOpenResetConfirmation = () => {
    setConfirmationModal({
      isOpen: true,
      title: 'Resetar Iniciativas',
      message: 'Tem certeza que deseja resetar todas as iniciativas?',
      confirmText: 'Resetar',
      onConfirm: () => {
        // Apenas zera as iniciativas mantendo o resto do estado
        const resetCharacters = characters.map(char => ({
          ...char,
          initiative: 0
        }));
        setCharacters(resetCharacters);
        setConfirmationModal({ isOpen: false });
      }
    });
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
    setEditingInitiative(null);
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
    setEditError(null);
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
      handleActionButton(new Event('click'), editModal.type, editModal.characterId);
      closeEditModal();
    }
  };

  const handleDeathSave = (characterId, type) => {
    setCharacters(prevCharacters => {
      return prevCharacters.map(char => {
        if (char.id === characterId) {
          const deathSaves = {
            successes: char.deathSaves?.successes || 0,
            failures: char.deathSaves?.failures || 0
          };

          if (type === 'success') {
            deathSaves.successes = Math.min(3, deathSaves.successes + 1);
          } else {
            deathSaves.failures = Math.min(3, deathSaves.failures + 1);
          }

          // Verifica se o personagem morreu ou se estabilizou
          let status = char.status;
          let conditions = Array.isArray(char.conditions) ? [...char.conditions] : [];
          
          if (deathSaves.failures >= 3) {
            status = 'dead';
            // Adiciona a condição "Morto" se não existir
            if (!conditions.includes('Morto')) {
              conditions.push('Morto');
            }
            // Remove a condição "Salvaguarda de Morte" se existir
            conditions = conditions.filter(c => c !== 'Salvaguarda de Morte');
          } else if (deathSaves.successes >= 3) {
            status = 'stable';
            // Reseta os saves quando estabiliza
            deathSaves.successes = 0;
            deathSaves.failures = 0;
            // Remove a condição "Salvaguarda de Morte"
            conditions = conditions.filter(c => c !== 'Salvaguarda de Morte');
          }

          return { 
            ...char, 
            deathSaves,
            status,
            conditions
          };
        }
        return char;
      });
    });
  };

  const renderDeathSaves = (character) => {
    const deathSaves = character.deathSaves || { successes: 0, failures: 0 };
    return (
      <div className="flex items-center space-x-2 mt-2">
        <div className="flex items-center">
          <span className="text-green-500 mr-1">Sucessos:</span>
          {[...Array(3)].map((_, i) => (
            <IoCheckmarkCircle
              key={`success-${i}`}
              className={`cursor-pointer ${i < deathSaves.successes ? 'text-green-500' : 'text-gray-500'}`}
              onClick={() => handleDeathSave(character.id, 'success')}
            />
          ))}
        </div>
        <div className="flex items-center">
          <span className="text-red-500 mr-1">Falhas:</span>
          {[...Array(3)].map((_, i) => (
            <IoCloseOutline
              key={`failure-${i}`}
              className={`cursor-pointer ${i < deathSaves.failures ? 'text-red-500' : 'text-gray-500'}`}
              onClick={() => handleDeathSave(character.id, 'failure')}
            />
          ))}
        </div>
      </div>
    );
  };

  const handleNextTurnWithCount = () => {
    let nextIndex = (currentTurnIndex + 1) % sortedCharacters.length;
    let checkedAll = false;

    // Procura o próximo personagem vivo
    while (!checkedAll && sortedCharacters[nextIndex]?.status === 'dead') {
      nextIndex = (nextIndex + 1) % sortedCharacters.length;
      
      // Se voltamos ao índice inicial, significa que checamos todos
      if (nextIndex === currentTurnIndex) {
        checkedAll = true;
      }
    }

    // Se não encontrou nenhum personagem vivo ou voltou ao mesmo, encerra a batalha
    if (checkedAll) {
      setBattleStarted(false);
      return;
    }

    // Se passou pelo índice 0, incrementa o turno
    if (nextIndex < currentTurnIndex) {
      setTurnCount(prev => prev + 1);
    }

    nextTurn(nextIndex);
  };

  // Reset o contador quando a batalha termina
  useEffect(() => {
    if (!battleStarted) {
      setTurnCount(1);
    }
  }, [battleStarted]);

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

  const resetAllInitiatives = () => {
    const resetCharacters = characters.map(char => ({
      ...char,
      initiative: 0,
      needsRoll: true
    }));
    setCharacters(resetCharacters);
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
    return characters.length > 0 && characters.every(char => char.initiative > 0);
  }, [characters]);

  const showBattleButton = useMemo(() => {
    return characters.length > 0 && !battleStarted && characters.every(char => char.initiative > 0);
  }, [characters, battleStarted]);

  const hasRolledInitiatives = useMemo(() => {
    return characters.some(char => char.initiative > 0);
  }, [characters]);

  const commonConditions = [
    'Agarrado',
    'Amedrontado', 
    'Atordoado',
    'Buff',
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
    'Morto',
    'Paralisado',
    'Petrificado',
    'Possuído',
    'Rastreado',
    'Surdo',
    'Salvaguarda de Morte'
  ];

  const [rollMode, setRollMode] = useState('individual');

  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: '',
    onConfirm: () => {}
  });

  const [valueModal, setValueModal] = useState({
    open: false,
    characterId: null,
    type: null,
    value: ''
  });

  const handleValueModalOpen = (e, type, characterId) => {
    e.preventDefault();
    e.stopPropagation();
    setValueModal({
      open: true,
      characterId,
      type,
      value: ''
    });
  };

  const handleValueModalClose = () => {
    setValueModal({
      open: false,
      characterId: null,
      type: null,
      value: ''
    });
  };

  const handleValueModalConfirm = () => {
    const value = parseInt(valueModal.value);
    if (!isNaN(value) && value >= 0) {
      handleActionButton(new Event('click'), valueModal.type, valueModal.characterId, value);
      handleValueModalClose();
    }
  };

  const handleActionButton = (e, action, characterId, value = 1) => {
    e.preventDefault();
    e.stopPropagation();
    const character = characters.find(char => char.id === characterId);
    
    if (!character || !battleStarted) return;
    
    switch (action) {
      case 'DAMAGE':
        handleDamageChange(characterId, 'damage', value);
        break;
      case 'HEAL':
        handleDamageChange(characterId, 'healing', value);
        break;
      case 'TEMP_HP':
        handleDamageChange(characterId, 'tempHp', value);
        break;
      case 'conditions':
        setSelectedCharacterForConditions(characterId);
        setShowConditionsModal(true);
        break;
    }
  };

  const isCharacterDead = (character) => {
    return character.deathSaves?.failures === 3;
  };

  const [editingInitiative, setEditingInitiative] = useState(null);

  const handleInitiativeClick = (e, characterId) => {
    if (battleStarted) return;
    
    e.preventDefault();
    e.stopPropagation();
    setEditingInitiative(characterId);
  };

  const handleInitiativeSave = (characterId, newValue) => {
    if (!isNaN(newValue) && newValue !== '') {
      const character = characters.find(char => char.id === characterId);
      const maxValue = 20 + character.modifier;
      const value = parseInt(newValue);
      
      if (value >= 0 && value <= maxValue) {
        setCharacters(prevCharacters => 
          prevCharacters.map(char => 
            char.id === characterId 
              ? { ...char, initiative: value } 
              : char
          )
        );
      }
    }
    setEditingInitiative(null);
  };

  const [valueInput, setValueInput] = useState({ show: false, type: null, characterId: null });
  const [showD20Button, setShowD20Button] = useState(false);
  const inputRef = useRef(null);
  
  // Função para lidar com a submissão do valor
  const handleValueSubmit = (value) => {
    const numValue = parseInt(value);
    if (isNaN(numValue)) return;
    handleActionButton(new Event('click'), valueInput.type, valueInput.characterId, numValue);
    setValueInput({ show: false, type: null, characterId: null });
  };

  return (
    <div className="initiative-list-container gamer-bg p-4 rounded-lg shadow-lg relative">
      {/* Modal do input numérico */}
      {valueInput.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="gamer-bg p-6 rounded-lg shadow-xl border-2 border-purple-500 animate-fade-in min-w-[300px]">
            <h3 className="text-xl font-bold mb-4 text-center text-purple-300">
              {valueInput.type === 'DAMAGE' ? 'Dano' : 
               valueInput.type === 'HEAL' ? 'Cura' : 'Vida Temporária'}
            </h3>
            <div className="relative mb-4">
              <input
                ref={inputRef}
                type="number"
                className="w-full px-4 py-3 bg-gray-800 border-2 border-purple-500 rounded-lg text-white text-center text-2xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400 gamer-input-focus"
                placeholder="0"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleValueSubmit(e.target.value);
                  } else if (e.key === 'Escape') {
                    setValueInput({ show: false, type: null, characterId: null });
                  }
                }}
                autoFocus
              />
            </div>
            <div className="flex justify-center gap-4">
              <button
                className="gamer-button px-6 py-2 rounded-lg text-white hover:bg-purple-600/50"
                onClick={() => setValueInput({ show: false, type: null, characterId: null })}
              >
                Cancelar
              </button>
              <button
                className="gamer-button px-6 py-2 rounded-lg text-white hover:bg-purple-600/50"
                onClick={(e) => handleValueSubmit(inputRef.current?.value)}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-3 md:space-y-0">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold mr-4">
            {battleStarted ? `Turno: ${turnCount}` : 'Lista de Iniciativa'}
          </h2>
          {!battleStarted && hasRolledInitiatives && (
            <button 
              onClick={handleResetInitiatives}
              className="text-gray-400 hover:text-white text-xl touch:active-scale p-1 rounded-full hover:bg-gray-600 transition-colors" 
              title="Resetar Iniciativas"
              aria-label="Resetar Iniciativas"
            >
              <FaRedoAlt />
            </button>
          )}
        </div>
        {!battleStarted && (
          <div className="flex items-center">
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={handleRollAll} 
                className="gamer-button text-white py-2 px-4 rounded-lg touch:active-scale hover:bg-purple-600/50 transition-all duration-300 border border-purple-500 hover:border-purple-400 hover:brightness-110 flex-shrink-0"
              >
                <span className="text-base">Rolar Iniciativas</span>
              </button>
              {showBattleButton && (
                <button 
                  onClick={handleRollAllAndSetBattle} 
                  className="gamer-button text-white py-2 px-4 rounded-lg flex items-center touch:active-scale hover:bg-purple-600/50 transition-all duration-300 border border-purple-500 hover:border-purple-400 hover:brightness-110 flex-shrink-0"
                >
                  <GiCrossedSwords className="mr-2" />
                  <span className="text-base">Iniciar batalha</span>
                </button>
              )}
            </div>
          </div>
        )}
        {battleStarted && (
          <button 
            onClick={handleNextTurnWithCount} 
            className="gamer-button text-white py-2 px-4 rounded-lg flex items-center touch:active-scale hover:bg-purple-600/50 transition-all duration-300 border border-purple-500 hover:border-purple-400 hover:brightness-110"
          >
            <span className="text-base">Próximo Turno</span>
            <BsArrowRight className="ml-2" />
          </button>
        )}
      </div>
      <div ref={listContainerRef} className="flex-1 overflow-y-auto">
        <ul className="space-y-2">
          {filteredCharacters.map((character, index) => (
            <li
              key={character.id}
              ref={el => characterRefs.current[index] = el}
              className={`p-4 rounded flex flex-col md:flex-row items-center justify-between transition-all duration-300 relative ${
                theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              } ${
                battleStarted && index === currentTurnIndex 
                  ? 'active-character gamer-card-active transform hover:scale-[1.02] hover:shadow-xl border-2 border-purple-500 pointer-events-none' 
                  : 'gamer-card hover:shadow-md'
              } ${
                character.status === 'dying' ? 'bg-yellow-900 hover:bg-yellow-800' : 
                character.status === 'dead' ? 'character-dead' : ''
              } ${
                character.deathAnimation ? 'animate-pulse' : ''
              }`}
              onClick={(e) => {
                const isInteractiveElement = e.target.tagName.toLowerCase() === 'button' || 
                  e.target.closest('button') || 
                  e.target.tagName.toLowerCase() === 'input' ||
                  e.target.closest('.interactive-element');
                
                if (!isInteractiveElement) {
                  toggleDropdown(e, character.id);
                }
              }}
            >
              {/* Conteúdo principal */}
              <div className="flex items-center flex-col md:flex-row w-full pointer-events-auto">
                <div className="w-16 h-16 mr-2 overflow-hidden rounded-full relative border-2 border-purple-500 flex-shrink-0 avatar-container">
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
                      className="flex items-center justify-center w-full h-full px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors cursor-pointer"
                    >
                      <IoPersonOutline className={`text-4xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-100'}`} />
                    </label>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold mb-1 character-name">
                    {character.name}
                  </h3>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{character.type}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {battleStarted ? `Iniciativa: ${character.initiative}` : `Modificador: ${character.modifier >= 0 ? '+' : ''}${character.modifier}`}
                  </div>
                  
                  {/* Damage Controls */}
                  {battleStarted && (
                    <CharacterActions 
                      character={character}
                      onAction={(action, characterId) => {
                        if (['DAMAGE', 'HEAL', 'TEMP_HP'].includes(action)) {
                          setValueInput({ show: true, type: action, characterId });
                          setTimeout(() => {
                            if (inputRef.current) {
                              inputRef.current.focus();
                            }
                          }, 100);
                        } else {
                          handleActionButton(new Event('click'), action, characterId);
                        }
                      }}
                      disabled={false}
                    />
                  )}

                  {/* Lista de condições */}
                  {character.conditions && character.conditions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1 pointer-events-auto">
                      {character.conditions.map((condition) => {
                        const isBuff = condition.startsWith('Buff:');
                        const buffColor = isBuff ? condition.split('|')[1] : null;
                        
                        return (
                          <button
                            key={condition}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleConditionToggle(character.id, condition);
                            }}
                            className="interactive-element px-2 py-0.5 text-xs rounded text-white hover:brightness-110 transition-colors cursor-pointer flex items-center gap-1 group"
                            style={isBuff ? { 
                              backgroundColor: buffColor,
                              border: `1px solid ${buffColor}`,
                              boxShadow: `0 0 8px ${buffColor}`
                            } : { 
                              backgroundColor: '#8b5cf6',
                              border: '1px solid #a78bfa',
                              boxShadow: '0 0 8px #a78bfa'
                            }}
                          >
                            <span>{isBuff ? condition.split('|')[0].replace('Buff:', '') : condition}</span>
                            <IoCloseOutline className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Status de morte e salvaguardas */}
                  {(character.conditions?.includes('Salvaguarda de Morte') || character.status === 'dying') && (
                    <div className="flex flex-col gap-2 mt-2 p-2 rounded bg-gray-800/30 border border-purple-500/20 pointer-events-auto">
                      {/* Sucessos */}
                      <div className="flex items-center justify-between">
                        <span className="text-green-500 text-sm">Sucesso</span>
                        <div className="flex gap-1">
                          {[...Array(3)].map((_, i) => (
                            <button
                              key={`success-${i}`}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDeathSave(character.id, 'success', i);
                              }}
                              className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                                character.deathSaves?.successes > i
                                  ? 'bg-green-500 text-white'
                                  : 'bg-gray-700 text-gray-400'
                              }`}
                            >
                              <IoCheckmarkCircle className="w-4 h-4" />
                            </button>
                          ))}
                        </div>
                      </div>
                      {/* Falhas */}
                      <div className="flex items-center justify-between">
                        <span className="text-red-500 text-sm">Falha</span>
                        <div className="flex gap-1">
                          {[...Array(3)].map((_, i) => (
                            <button
                              key={`failure-${i}`}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDeathSave(character.id, 'failure', i);
                              }}
                              className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                                character.deathSaves?.failures > i
                                  ? 'bg-red-500 text-white'
                                  : 'bg-gray-700 text-gray-400'
                              }`}
                            >
                              <FaSkull className="w-3 h-3" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center pointer-events-auto">
                {!battleStarted && (
                  <div onClick={(e) => e.stopPropagation()}>
                    <D20Button 
                      onClick={(roll) => {
                        handleRollInitiative(character.id, roll);
                        setShowD20Button(false);
                      }}
                      isVisible={showD20Button && character.id === selectedCharacter?.id}
                    />
                    {editingInitiative === character.id ? (
                      <div className="relative inline-block">
                        <input
                          type="number"
                          min="0"
                          max={20 + character.modifier}
                          defaultValue={character.initiative}
                          onBlur={(e) => {
                            let value = e.target.value;
                            if (value === '') return;
                            
                            const maxValue = 20 + character.modifier;
                            value = parseInt(value);
                            if (value > maxValue) {
                              e.target.value = maxValue.toString();
                            } else if (value < 0) {
                              e.target.value = '0';
                            }
                            handleInitiativeSave(character.id, e.target.value);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              let value = e.target.value;
                              if (value === '') return;
                              
                              const maxValue = 20 + character.modifier;
                              value = parseInt(value);
                              if (value > maxValue) {
                                e.target.value = maxValue.toString();
                              } else if (value < 0) {
                                e.target.value = '0';
                              }
                              handleInitiativeSave(character.id, e.target.value);
                            } else if (e.key === 'Escape') {
                              setEditingInitiative(null);
                            } else if (e.key >= '0' && e.key <= '9') {
                              // Se for o primeiro número digitado, limpa o campo
                              if (!e.currentTarget.dataset.hasInput) {
                                e.currentTarget.value = '';
                                e.currentTarget.dataset.hasInput = 'true';
                              }
                            }
                          }}
                          autoFocus
                          className="w-24 h-12 bg-gray-900 text-2xl text-center text-purple-400 
                                   border-2 border-purple-500 rounded-lg outline-none
                                   shadow-[0_0_10px_rgba(147,51,234,0.3)]
                                   focus:border-purple-400 focus:shadow-[0_0_15px_rgba(147,51,234,0.5)]
                                   transition-all duration-300 font-dice
                                   backdrop-blur-sm backdrop-filter
                                   [appearance:textfield]
                                   [&::-webkit-outer-spin-button]:appearance-none
                                   [&::-webkit-inner-spin-button]:appearance-none"
                          style={{
                            background: 'linear-gradient(45deg, rgba(20,20,20,0.95) 0%, rgba(45,31,61,0.95) 100%)',
                            boxShadow: 'inset 0 0 10px rgba(147,51,234,0.2), 0 0 15px rgba(147,51,234,0.3)',
                          }}
                        />
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="absolute top-0 left-2 w-2 h-2 border-t-2 border-l-2 border-purple-500"></div>
                          <div className="absolute top-0 right-2 w-2 h-2 border-t-2 border-r-2 border-purple-500"></div>
                          <div className="absolute bottom-0 left-2 w-2 h-2 border-b-2 border-l-2 border-purple-500"></div>
                          <div className="absolute bottom-0 right-2 w-2 h-2 border-b-2 border-r-2 border-purple-500"></div>
                        </div>
                      </div>
                    ) : (
                      <span 
                        onClick={(e) => handleInitiativeClick(e, character.id)}
                        className="font-bold text-2xl mr-4 text-gray-800 dark:text-white w-16 text-center 
                                 cursor-pointer px-2 py-1 hover:text-purple-500 font-dice"
                        style={{ display: 'inline-block', margin: '0 1rem', padding: '0.2rem 0.4rem' }}
                      >
                        {character.initiative}
                      </span>
                    )}
                  </div>
                )}
                {battleStarted && character.needsRoll && !character.initiative && character.status === 'alive' && character.type !== 'npc' && (
                  <button onClick={() => handleRollInitiative(character.id)} className="text-gray-400 hover:text-white"><FaDiceD20 /></button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <ConditionsModal
        showModal={showConditionsModal}
        handleCloseModal={handleCloseConditionsModal}
        character={characters.find(char => char.id === selectedCharacterForConditions)}
        theme={theme}
        handleConditionToggle={handleConditionToggle}
        commonConditions={commonConditions}
      />
      {/* Modal de confirmação para deletar personagem */}
      {deleteConfirmation.isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleCloseDeleteConfirmation}
        >
          <div 
            className="gamer-bg p-6 rounded-lg shadow-lg border-2 border-purple-500/30 w-96 transform transition-all duration-200"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4 text-center text-white">Confirmar Exclusão</h3>
            <p className="text-gray-300 text-center mb-6">
              Tem certeza que deseja excluir este personagem?
              <br />
              <span className="text-red-400 text-sm">Esta ação não pode ser desfeita.</span>
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleConfirmDelete}
                className="gamer-button bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
              >
                Excluir
              </button>
              <button
                onClick={handleCloseDeleteConfirmation}
                className="gamer-button bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText={confirmationModal.confirmText}
        onConfirm={confirmationModal.onConfirm}
        onCancel={() => setConfirmationModal({ isOpen: false })}
      />
      {/* Modal para inserir valores numéricos */}
      {valueModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleValueModalClose}>
          <div 
            className={`gamer-bg p-4 rounded-lg shadow-lg border-2 border-purple-500/30 w-64 transform transition-all duration-200`}
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-3 text-center">
              {valueModal.type === 'damage' ? 'Dano' :
               valueModal.type === 'heal' ? 'Cura' :
               'Vida Temporária'}
            </h3>
            <input
              type="number"
              min="0"
              value={valueModal.value}
              onChange={(e) => setValueModal(prev => ({ ...prev, value: e.target.value }))}
              className="w-full p-2 mb-3 rounded bg-gray-700 border border-purple-500/30 text-center focus:outline-none focus:border-purple-500 transition-colors"
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleValueModalConfirm();
                }
              }}
            />
            <div className="flex justify-center space-x-2">
              <button
                onClick={handleValueModalClose}
                className="gamer-button px-3 py-1 rounded text-sm hover:brightness-110 transition-all duration-200 touch:active-scale"
              >
                Cancelar
              </button>
              <button
                onClick={handleValueModalConfirm}
                className="gamer-button px-3 py-1 rounded text-sm hover:brightness-110 transition-all duration-200 touch:active-scale"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InitiativeList;
