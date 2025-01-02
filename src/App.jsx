import React, { useState, useRef, useEffect } from 'react';
    import { FaSun, FaMoon } from 'react-icons/fa';
    import { IoTrash } from 'react-icons/io5';
    import CharacterForm from './components/CharacterForm';
    import InitiativeList from './components/InitiativeList';
    import ClearConfirmation from './components/ClearConfirmation';
    import useCharacterManager from './hooks/useCharacterManager';

    function App() {
      const {
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
      } = useCharacterManager();

      const [dropdownOpen, setDropdownOpen] = useState(false);
      const dropdownRef = useRef(null);
      const [theme, setTheme] = useState('dark');
      const [showConfirmation, setShowConfirmation] = useState(false);

      useEffect(() => {
        localStorage.setItem('theme', theme);
        document.documentElement.classList.toggle('dark', theme === 'dark');
      }, [theme]);

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
          <CharacterForm
            newCharacter={newCharacter}
            handleInputChange={handleInputChange}
            handleImageUpload={handleImageUpload}
            errorMessage={errorMessage}
            npcQuantity={npcQuantity}
            setNpcQuantity={setNpcQuantity}
            handleAddCharacter={handleAddCharacter}
          />
          <InitiativeList
            sortedCharacters={sortedCharacters}
            theme={theme}
            handleRollInitiative={handleRollInitiative}
            handleDeleteCharacter={handleDeleteCharacter}
            handleResetInitiatives={handleResetInitiatives}
            handleRollAll={handleRollAll}
            dropdownOpen={dropdownOpen}
            toggleDropdown={toggleDropdown}
            handleRollAllInitiatives={handleRollAllInitiatives}
            dropdownRef={dropdownRef}
          />
          <button onClick={handleClearAll} className="absolute bottom-4 left-4 text-gray-400 hover:text-white text-xl">
            <IoTrash />
          </button>
          <ClearConfirmation
            showConfirmation={showConfirmation}
            confirmClearAll={confirmClearAll}
            cancelClearAll={cancelClearAll}
            theme={theme}
          />
          <button onClick={toggleTheme} className={`absolute bottom-4 right-4 text-gray-400 hover:text-white text-xl ${theme === 'dark' ? 'mr-2' : 'mr-0'}`}>
            {theme === 'dark' ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      );
    }

    export default App;
