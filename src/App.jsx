import React, { useState, useMemo, useRef, useEffect } from 'react';
    import { FaSun, FaDiceD20, FaRedoAlt, FaMoon } from 'react-icons/fa';
    import { IoTrashOutline, IoImageOutline, IoPersonOutline, IoCaretDown, IoTrash } from 'react-icons/io5';

    function App() {
      const [characters, setCharacters] = useState([]);
      const [newCharacter, setNewCharacter] = useState({
        name: '',
        type: 'Jogador',
        modifier: 0,
        image: null,
      });
      const [npcQuantity, setNpcQuantity] = useState(1);
      const [dropdownOpen, setDropdownOpen] = useState(false);
      const dropdownRef = useRef(null);
      const [theme, setTheme] = useState('dark');
      const [showConfirmation, setShowConfirmation] = useState(false);

      useEffect(() => {
        localStorage.setItem('theme', theme);
        document.documentElement.classList.toggle('dark', theme === 'dark');
      }, [theme]);

      const handleInputChange = (e) => {
        setNewCharacter({ ...newCharacter, [e.target.name]: e.target.value });
        if (e.target.name === 'type' && e.target.value === 'NPC') {
          setNpcQuantity(1);
        }
      };

      const handleAddCharacter = () => {
        const newCharacters = [];
        if (newCharacter.type === 'NPC') {
          for (let i = 0; i < npcQuantity; i++) {
            newCharacters.push({
              ...newCharacter,
              id: Date.now() + i,
              name: newCharacter.name ? `${newCharacter.name} ${i + 1}` : `NPC ${i + 1}`,
              initiative: 0,
            });
          }
        } else {
          newCharacters.push({ ...newCharacter, id: Date.now(), initiative: 0 });
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
        setDropdownOpen(false);
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

      const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
      };

      const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
      };

      const handleClearAll = () => {
        setShowConfirmation(true);
      };

      const confirmClearAll = () => {
        setCharacters([]);
        setShowConfirmation(false);
      };

      const cancelClearAll = () => {
        setShowConfirmation(false);
      };

      return (
        <div className={`flex h-screen  ${theme === 'dark' ? 'bg-dark-navy text-white' : 'bg-gray-100 text-gray-800'} font-sans`} onClick={(e) => {
          if (dropdownOpen && !dropdownRef.current?.contains(e.target)) {
            setDropdownOpen(false);
          }
        }}>
          {/* Left Panel - Add Character */}
          <div className="w-1/3 p-6 border-r border-gray-700">
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
            </div>
            <button onClick={handleAddCharacter} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded">
              Adicionar Personagem
            </button>
          </div>

          {/* Right Panel - Initiative List */}
          <div className="w-2/3 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Lista de Iniciativa</h2>
              <div className="flex items-center" ref={dropdownRef}>
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
                    <div className="absolute top-10 right-0 bg-gray-700 rounded shadow-md z-10">
                      <button onClick={() => handleRollAllInitiatives('SOMENTE NPCS')} className="block w-full text-left py-2 px-4 hover:bg-gray-600">SOMENTE NPCS</button>
                      <button onClick={() => handleRollAllInitiatives('SOMENTE JOGADORES')} className="block w-full text-left py-2 px-4 hover:bg-gray-600">SOMENTE JOGADORES</button>
                    </div>
                  )}
                <button onClick={toggleTheme} className={`text-gray-400 hover:text-white text-xl ml-4 ${theme === 'dark' ? 'mr-2' : 'mr-0'}`}>
                  {theme === 'dark' ? <FaSun /> : <FaMoon />}
                </button>
              </div>
            </div>
            <ul className="space-y-2">
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
              <button onClick={handleResetInitiatives} className="text-gray-400 hover:text-white text-xl"><FaRedoAlt /></button>
            </div>
          </div>
          {/* Clear All Button */}
          <button onClick={handleClearAll} className="absolute bottom-4 left-4 text-gray-400 hover:text-white text-xl">
            <IoTrash />
          </button>
          {/* Confirmation Modal */}
          {showConfirmation && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-md">
                <p className="mb-4 dark:text-white">Tem certeza que deseja apagar todos os dados?</p>
                <div className="flex justify-end">
                  <button onClick={cancelClearAll} className="bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 px-4 rounded mr-2">Cancelar</button>
                  <button onClick={confirmClearAll} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">Confirmar</button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    export default App;
