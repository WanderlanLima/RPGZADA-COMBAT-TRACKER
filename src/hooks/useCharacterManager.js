import { useState, useMemo, useEffect, useCallback } from 'react';
import { nanoid } from 'nanoid';

const STORAGE_KEY = 'rpgzada_characters';

const loadFromStorage = () => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : { characters: [], battleStarted: false, currentTurnIndex: 0 };
  } catch (error) {
    console.error('Falha ao carregar do localStorage:', error);
    return { characters: [], battleStarted: false, currentTurnIndex: 0 };
  }
};

const saveToStorage = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Falha ao salvar no localStorage:', error);
  }
};

const useCharacterManager = () => {
  // Estados iniciais carregados do localStorage
  const [characters, setCharacters] = useState(() => loadFromStorage().characters || []);
  const [battleStarted, setBattleStarted] = useState(() => loadFromStorage().battleStarted || false);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(() => loadFromStorage().currentTurnIndex || 0);
  const [newCharactersAdded, setNewCharactersAdded] = useState([]);

  const [newCharacter, setNewCharacter] = useState({
    name: '',
    type: 'Jogador',
    modifier: 0,
    image: null,
  });
  const [npcQuantity, setNpcQuantity] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');

  // Salva no localStorage sempre que houver mudanças nos estados principais
  useEffect(() => {
    saveToStorage({ characters, battleStarted, currentTurnIndex });
  }, [characters, battleStarted, currentTurnIndex]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewCharacter(prev => ({ ...prev, [name]: value }));
    if (name === 'type' && value === 'NPC') {
      setNpcQuantity(1);
    }
  }, []);

  const handleAddCharacter = useCallback(() => {
    if (!newCharacter.name.trim()) {
      setErrorMessage('Por favor, preencha o nome do personagem.');
      return;
    }
    setErrorMessage('');

    // Função auxiliar para criar novo personagem
    const createCharacter = (name, type, modifier, image) => ({
      id: nanoid(),
      name,
      type,
      modifier: parseInt(modifier) || 0,
      initiative: 0,
      image,
      needsRoll: battleStarted,
      status: 'vivo',
      ...(type === 'NPC' && {
        deathSaves: { successes: 0, failures: 0 },
        deathAnimation: false
      })
    });

    setCharacters(prevCharacters => {
      const newCharacters = newCharacter.type === 'NPC'
        ? Array.from({ length: npcQuantity }, (_, i) => 
            createCharacter(
              `${newCharacter.name} ${i + 1}`,
              'NPC',
              newCharacter.modifier,
              newCharacter.image
            )
          )
        : [createCharacter(
            newCharacter.name,
            'Jogador',
            newCharacter.modifier,
            newCharacter.image
          )];

      if (battleStarted) {
        setNewCharactersAdded(newCharacters.map(char => char.id));
      }

      return [...prevCharacters, ...newCharacters];
    });

    // Limpa o formulário após adicionar
    setNewCharacter({ name: '', type: 'Jogador', modifier: 0, image: null });
    setNpcQuantity(1);
  }, [newCharacter, npcQuantity, battleStarted]);

  const handleRollInitiative = useCallback((id) => {
    setCharacters(prevCharacters => {
      const roll = Math.floor(Math.random() * 20) + 1;
      return prevCharacters.map(char =>
        char.id === id
          ? { ...char, initiative: roll + parseInt(char.modifier), needsRoll: false }
          : char
      );
    });
    setNewCharactersAdded(prev => prev.filter(charId => charId !== id));
  }, []);

  const handleRollInitiativesByType = useCallback((type) => {
    setCharacters(prevCharacters => 
      prevCharacters.map(char => {
        if (char.type.toLowerCase() === type) {
          const roll = Math.floor(Math.random() * 20) + 1;
          const totalInitiative = roll + parseInt(char.modifier || 0);
          return {
            ...char,
            initiative: totalInitiative,
            needsRoll: false
          };
        }
        return char;
      })
    );
  }, []);

  const handleRollAllInitiatives = useCallback(() => {
    setCharacters(prevCharacters => 
      prevCharacters.map(char => {
        const roll = Math.floor(Math.random() * 20) + 1;
        const totalInitiative = roll + parseInt(char.modifier || 0);
        return {
          ...char,
          initiative: totalInitiative,
          needsRoll: false
        };
      })
    );
  }, []);

  const handleRollAll = useCallback(() => {
    setCharacters(prevCharacters =>
      prevCharacters.map(char => {
        const roll = Math.floor(Math.random() * 20) + 1;
        return { ...char, initiative: roll + parseInt(char.modifier) };
      })
    );
  }, []);

  const handleDeleteCharacter = useCallback((id) => {
    setCharacters(prevCharacters => prevCharacters.filter(char => char.id !== id));
    setNewCharactersAdded(prev => prev.filter(charId => charId !== id));
  }, []);

  const handleResetInitiatives = useCallback(() => {
    setCharacters(prevCharacters =>
      prevCharacters.map(char => ({ ...char, initiative: 0 }))
    );
  }, []);

  const clearAllCharacters = useCallback(() => {
    setCharacters([]);
    setBattleStarted(false);
    setCurrentTurnIndex(0);
    setNewCharactersAdded([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Ordena personagens mantendo novos no final
  const sortedCharacters = useMemo(() => {
    if (!characters.length) return [];
    
    const existingCharacters = characters.filter(char => !newCharactersAdded.includes(char.id));
    const newChars = characters.filter(char => newCharactersAdded.includes(char.id));
    
    return [
      ...existingCharacters.sort((a, b) => b.initiative - a.initiative),
      ...newChars
    ];
  }, [characters, newCharactersAdded]);

  const nextTurn = useCallback((nextIndex) => {
    setCurrentTurnIndex(nextIndex);
  }, []);

  const saveLog = useCallback(() => {
    const logData = {
      characters,
      battleStarted,
      currentTurnIndex,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(logData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rpgzada-log-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [characters, battleStarted, currentTurnIndex]);

  const loadLog = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const logData = JSON.parse(event.target.result);
        if (!logData.characters) throw new Error('Formato de arquivo de log inválido');
        
        setCharacters(logData.characters);
        setBattleStarted(logData.battleStarted || false);
        setCurrentTurnIndex(logData.currentTurnIndex || 0);
        setNewCharactersAdded([]);
      } catch (error) {
        console.error('Erro ao carregar log:', error);
        alert('Erro ao carregar o arquivo de log. Verifique se o arquivo é válido.');
      }
    };
    reader.readAsText(file);
  }, []);

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCharacter(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleTextFileUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n').filter(line => line.trim() !== '');
      let newCharacters = [];
      
      for (const line of lines) {
        const parts = line.split(',').map(item => item.trim());
        const name = parts[0] || 'Sem Nome';
        let type = parts[1]?.toLowerCase() === 'npc' ? 'NPC' : 'Jogador';
        let quantity = 1;
        let modifier = 0;

        if (type === 'NPC') {
          // Se tiver 3 parâmetros: nome, tipo, modificador
          if (parts.length === 3) {
            modifier = parseInt(parts[2]) || 0;
          }
          // Se tiver 4 parâmetros: nome, tipo, quantidade, modificador
          else if (parts.length >= 4) {
            quantity = parseInt(parts[2]) || 1;
            modifier = parseInt(parts[3]) || 0;
          }
        } else {
          // Para jogadores: nome, tipo, modificador
          modifier = parseInt(parts[2]) || 0;
        }

        if (type === 'NPC') {
          for (let i = 0; i < quantity; i++) {
            newCharacters.push({
              id: nanoid(),
              name: `${name} ${i + 1}`,
              type: 'NPC',
              modifier,
              initiative: 0,
              image: null,
              needsRoll: false,
              status: 'vivo',
              deathSaves: {
                successes: 0,
                failures: 0
              },
              deathAnimation: false
            });
          }
        } else {
          newCharacters.push({
            id: nanoid(),
            name,
            type: 'Jogador',
            modifier,
            initiative: 0,
            image: null,
            needsRoll: false,
            status: 'vivo'
          });
        }
      }

      setCharacters(prevCharacters => {
        if (battleStarted) {
          const existingCharacters = prevCharacters;
          return [...existingCharacters, ...newCharacters];
        }
        return [...prevCharacters, ...newCharacters];
      });
    };
    reader.readAsText(file);
  }, [battleStarted]);

  const clearAllData = useCallback(() => {
    setCharacters([]);
    setBattleStarted(false);
    setCurrentTurnIndex(0);
    setNewCharactersAdded([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const handleStartBattle = useCallback(() => {
    setBattleStarted(true);
  }, []);

  return {
    characters,
    newCharacter,
    npcQuantity,
    errorMessage,
    setNpcQuantity,
    setErrorMessage,
    handleInputChange,
    handleAddCharacter,
    handleImageUpload,
    handleRollInitiative,
    handleRollAllInitiatives,
    handleRollAll,
    handleDeleteCharacter,
    handleResetInitiatives,
    sortedCharacters,
    setCharacters,
    handleTextFileUpload,
    clearAllCharacters,
    battleStarted,
    setBattleStarted,
    currentTurnIndex,
    nextTurn,
    saveLog,
    loadLog,
    clearAllData,
    handleStartBattle,
    handleRollInitiativesByType
  };
};

export default useCharacterManager;
