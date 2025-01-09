import { useState, useMemo, useEffect } from 'react';
    import { nanoid } from 'nanoid';

    const STORAGE_KEY = 'rpgzada_characters';

    const loadFromStorage = () => {
      try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        return savedData ? JSON.parse(savedData) : [];
      } catch (error) {
        console.error('Failed to load from localStorage:', error);
        return [];
      }
    };

    const saveToStorage = (data) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error('Failed to save to localStorage:', error);
      }
    };

    const useCharacterManager = () => {
      const [characters, setCharacters] = useState([]);
      const [battleStarted, setBattleStarted] = useState(false);
      const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
      const [newCharactersAdded, setNewCharactersAdded] = useState([]);

      useEffect(() => {
        // Load characters from localStorage only if there are no characters already set
        if (characters.length === 0) {
          const storedData = loadFromStorage();
          if (storedData && storedData.length > 0) {
            setCharacters(storedData.characters || []);
            setBattleStarted(storedData.battleStarted || false);
            setCurrentTurnIndex(storedData.currentTurnIndex || 0);
          }
        }
      }, []);

      useEffect(() => {
        saveToStorage({ characters, battleStarted, currentTurnIndex });
      }, [characters, battleStarted, currentTurnIndex]);
      const [newCharacter, setNewCharacter] = useState({
        name: '',
        type: 'Jogador',
        modifier: 0,
        image: null,
      });
      const [npcQuantity, setNpcQuantity] = useState(1);
      const [errorMessage, setErrorMessage] = useState('');

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCharacter({ ...newCharacter, [name]: value });
        if (name === 'type' && value === 'NPC') {
          setNpcQuantity(1);
        }
      };

      const handleAddCharacter = () => {
        if (!newCharacter.name.trim()) {
          setErrorMessage('Por favor, preencha o nome do personagem.');
          return;
        }
        setErrorMessage('');

        const newCharacters = [];
        if (newCharacter.type === 'NPC') {
          for (let i = 0; i < npcQuantity; i++) {
            newCharacters.push({
              ...newCharacter,
              id: nanoid(),
              name: newCharacter.name ? `${newCharacter.name} ${i + 1}` : `NPC ${i + 1}`,
              initiative: 0,
              needsRoll: false,
            });
          }
        } else {
          newCharacters.push({ ...newCharacter, id: nanoid(), initiative: 0, needsRoll: false });
        }

        setCharacters(prevCharacters => {
          const updatedCharacters = [...prevCharacters, ...newCharacters];
          if (battleStarted && newCharacters.length > 1) {
            setNewCharactersAdded(newCharacters.map(char => char.id));
            return updatedCharacters.map(char => {
              if (newCharacters.some(newChar => newChar.id === char.id)) {
                return { ...char, needsRoll: true };
              }
              return char;
            });
          }
          return updatedCharacters;
        });
        setNewCharacter({ name: '', type: 'Jogador', modifier: 0, image: null });
        setNpcQuantity(1);
      };

      const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setNewCharacter({ ...newCharacter, image: reader.result });
          };
          reader.readAsDataURL(file);
        }
      };

      const handleRollInitiative = (id) => {
        const roll = Math.floor(Math.random() * 20) + 1;
        setCharacters(prevCharacters => {
          const updatedCharacters = prevCharacters.map(char =>
            char.id === id ? { ...char, initiative: roll + parseInt(char.modifier), needsRoll: false } : char
          );
          
          const existingCharacters = updatedCharacters.filter(char => !newCharactersAdded.includes(char.id));
          const newCharacters = updatedCharacters.filter(char => newCharactersAdded.includes(char.id)).sort((a, b) => b.initiative - a.initiative);
          
          setNewCharactersAdded([]);
          return [...existingCharacters, ...newCharacters];
        });
      };

      const handleRollAllInitiatives = (type) => {
        setCharacters(characters.map(char => {
          if (type === 'SOMENTE NPCS' && char.type !== 'NPC') return char;
          if (type === 'SOMENTE JOGADORES' && char.type !== 'Jogador') return char;
          const roll = Math.floor(Math.random() * 20) + 1;
          return { ...char, initiative: roll + parseInt(char.modifier) };
        }));
      };

      const handleRollAll = () => {
        setCharacters(characters.map(char => {
          const roll = Math.floor(Math.random() * 20) + 1;
          return { ...char, initiative: roll + parseInt(char.modifier) };
        }));
      }

      const handleDeleteCharacter = (id) => {
        setCharacters(characters.filter(char => char.id !== id));
      };

      const handleResetInitiatives = () => {
        setCharacters(characters.map(char => ({ ...char, initiative: 0 })));
      };

      const handleTextFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target.result;
          const lines = text.split('\n').filter(line => line.trim() !== '');
          let newCharacters = [];
          for (const line of lines) {
            const parts = line.split(',').map(item => item.trim());
            const name = parts[0] || 'No Name';
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
              name: name ? `${name} ${i + 1}` : `NPC ${i + 1}`,
              type: 'NPC',
              modifier: modifier,
              initiative: 0,
              image: null,
              needsRoll: false,
              status: 'alive',
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
                name: name,
                type: 'Jogador',
                modifier: modifier,
                initiative: 0,
                image: null,
                needsRoll: false,
                status: 'alive'
              });
            }
          }
          setCharacters(prevCharacters => {
            const updatedCharacters = [...prevCharacters, ...newCharacters];
            if (battleStarted) {
              // Rola iniciativa automaticamente para novos personagens
              // Rola iniciativa mas mantém novos personagens no final
              const existingCharacters = updatedCharacters.filter(char => 
                !newCharacters.some(newChar => newChar.id === char.id)
              );
              
              // Separa personagens existentes dos novos
              const updatedExisting = updatedCharacters.filter(char => 
                !newCharacters.some(newChar => newChar.id === char.id)
              );
              const updatedNew = updatedCharacters.filter(char => 
                newCharacters.some(newChar => newChar.id === char.id)
              );
              
              // Insere novos personagens em posições aleatórias
              const shuffledNew = updatedNew.sort(() => Math.random() - 0.5);
              
              // Se houver turno ativo, insere novos personagens após o turno atual
              if (currentTurnIndex > 0) {
                const beforeTurn = updatedExisting.slice(0, currentTurnIndex);
                const afterTurn = updatedExisting.slice(currentTurnIndex);
                return [
                  ...beforeTurn, // Mantém ordem original dos existentes
                  ...afterTurn,  // Mantém ordem original dos existentes
                  ...updatedNew  // Adiciona novos no final
                ];
              }
              
              // Caso contrário, mantém ordem original e adiciona novos no final
              return [...updatedExisting, ...updatedNew]; // Mantém ordem original dos existentes
            }
            return updatedCharacters;
          });
        };
        reader.readAsText(file);
      };

      const clearAllCharacters = () => {
        setCharacters([]);
        setBattleStarted(false);
        setCurrentTurnIndex(0);
        localStorage.removeItem(STORAGE_KEY);
        window.location.reload();
      };

      const sortedCharacters = useMemo(() => {
        const existingCharacters = characters.filter(char => !newCharactersAdded.includes(char.id));
        const newCharacters = characters.filter(char => newCharactersAdded.includes(char.id)).sort((a, b) => b.initiative - a.initiative);
        return [...existingCharacters, ...newCharacters].sort((a, b) => b.initiative - a.initiative);
      }, [characters, newCharactersAdded]);

const nextTurn = () => {
  if (characters.length > 0) {
    setCurrentTurnIndex((prevIndex) => {
      let nextIndex = (prevIndex + 1) % characters.length;
      let attempts = 0;
      
      // Pula personagens mortos, mas evita loop infinito
      while (characters[nextIndex]?.status === 'dead' && attempts < characters.length) {
        nextIndex = (nextIndex + 1) % characters.length;
        attempts++;
      }
      
      return nextIndex;
    });
  }
};

      const handleStartBattle = () => {
        setBattleStarted(true);
      };

      const saveLog = () => {
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
      };

      const loadLog = (file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const logData = JSON.parse(event.target.result);
            setCharacters(logData.characters || []);
            setBattleStarted(logData.battleStarted || false);
            setCurrentTurnIndex(logData.currentTurnIndex || 0);
          } catch (error) {
            console.error('Erro ao carregar log:', error);
            alert('Erro ao carregar o arquivo de log. Verifique se o arquivo é válido.');
          }
        };
        reader.readAsText(file);
      };

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
        setBattleStarted: handleStartBattle,
        currentTurnIndex,
        nextTurn,
        saveLog,
        loadLog
      };
    };

    export default useCharacterManager;
