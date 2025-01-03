import React, { useState, useRef, useEffect } from 'react';
    import { FaSun, FaMoon, FaGithub, FaRedoAlt } from 'react-icons/fa';
    import { IoTrash } from 'react-icons/io5';
    import CharacterForm from './components/CharacterForm';
    import InitiativeList from './components/InitiativeList';
    import ClearConfirmation from './components/ClearConfirmation';
    import useCharacterManager from './hooks/useCharacterManager';
    import Footer from './components/Footer';
    import ThemeToggleButton from './components/ThemeToggleButton';
    import FileUpload from './components/FileUpload';

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
        setCharacters,
        handleTextFileUpload,
      } = useCharacterManager();

      const [dropdownOpen, setDropdownOpen] = useState(false);
      const dropdownRef = useRef(null);
      const [theme, setTheme] = useState('dark');
      const [showConfirmation, setShowConfirmation] = useState(false);
      const [showRepoConfirmation, setShowRepoConfirmation] = useState(false);
      const repoUrl = "https://github.com/WanderlanLima/RPGZADA-COMBAT-TRACKER";
      const projectVersion = "1.1";
      const startYear = 2024;
      const currentYear = new Date().getFullYear();

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

      const handleRepoClick = () => {
        setShowRepoConfirmation(true);
      };

      const confirmRepoNavigation = () => {
        window.open(repoUrl, '_blank');
        setShowRepoConfirmation(false);
      };

      const cancelRepoNavigation = () => {
        setShowRepoConfirmation(false);
      };

      return (
        <div className={`flex flex-col min-h-screen ${theme === 'dark' ? 'bg-dark-navy text-white' : 'bg-gray-100 text-gray-800'} font-sans`} onClick={(e) => {
          if (dropdownOpen && !dropdownRef.current?.contains(e.target)) {
            setDropdownOpen(false);
          }
        }}>
          <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
          <div className="flex flex-col md:flex-row flex-grow">
            <CharacterForm
              newCharacter={newCharacter}
              handleInputChange={handleInputChange}
              handleImageUpload={handleImageUpload}
              errorMessage={errorMessage}
              npcQuantity={npcQuantity}
              setNpcQuantity={setNpcQuantity}
              handleAddCharacter={handleAddCharacter}
              handleTextFileUpload={handleTextFileUpload}
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
          </div>
          <div className="flex justify-between items-center p-4">
            <button onClick={handleClearAll} className="text-gray-400 hover:text-white text-xl" title="Limpar todos os dados">
              <IoTrash />
            </button>
          </div>
          <Footer
            repoUrl={repoUrl}
            projectVersion={projectVersion}
            startYear={startYear}
            currentYear={currentYear}
            handleRepoClick={handleRepoClick}
          />
          <ClearConfirmation
            showConfirmation={showConfirmation}
            confirmClearAll={confirmClearAll}
            cancelClearAll={cancelClearAll}
            theme={theme}
          />
          {showRepoConfirmation && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-md">
                <p className="mb-4 dark:text-white">Deseja realmente ir para a página do repositório?</p>
                <div className="flex justify-end">
                  <button onClick={cancelRepoNavigation} className="bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 px-4 rounded mr-2">Cancelar</button>
                  <button onClick={confirmRepoNavigation} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">Confirmar</button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    export default App;
