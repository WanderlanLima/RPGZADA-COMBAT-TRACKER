import { useState, useMemo } from 'react';
    import { nanoid } from 'nanoid';

    const useCharacterManager = () => {
      const [characters, setCharacters] = useState([]);
      const [newCharacter, setNewCharacter] = useState({
        name: '',
        type: 'Jogador',
        modifier: 0,
        image: null,
      });
      const [npcQuantity, setNpcQuantity] = useState(1);
      const [errorMessage, setErrorMessage] = useState('');

      const handleInputChange = (e) => {
        setNewCharacter({ ...newCharacter, [e.target.name]: e.target.value });
        if (e.target.name === 'type' && e.target.value === 'NPC') {
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
            });
          }
        } else {
          newCharacters.push({ ...newCharacter, id: nanoid(), initiative: 0 });
        }
        setCharacters([...characters, ...newCharacters]);
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
        setCharacters(characters.map(char =>
          char.id === id ? { ...char, initiative: roll + parseInt(char.modifier) } : char
        ));
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

      const sortedCharacters = useMemo(() => {
        return [...characters].sort((a, b) => b.initiative - a.initiative);
      }, [characters]);

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
      };
    };

    export default useCharacterManager;
