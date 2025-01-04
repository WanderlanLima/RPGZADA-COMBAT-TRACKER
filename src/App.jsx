import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

// Icons
import { FaSun, FaMoon, FaGithub, FaRedoAlt } from 'react-icons/fa';
import { IoTrash } from 'react-icons/io5';

// Components
import CharacterForm from './components/CharacterForm';
import InitiativeList from './components/InitiativeList';
import ClearConfirmation from './components/ClearConfirmation';
import Footer from './components/Footer';
import ThemeToggleButton from './components/ThemeToggleButton';
import FileUpload from './components/FileUpload';

// Hooks
import useCharacterManager from './hooks/useCharacterManager';

    function App() {
      // Prop types validation
      App.propTypes = {
        // Add prop types if needed
      };
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

      useEffect(() => {
        document.documentElement.lang = 'pt-BR';
      }, []);

      // Memoized and callback functions
      const toggleDropdown = useCallback(() => {
        setDropdownOpen(prev => !prev);
      }, []);

      const toggleTheme = useCallback(() => {
        setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
      }, []);

      const handleClearAll = useCallback(() => {
        setShowConfirmation(true);
      }, []);

      const confirmClearAll = useCallback(() => {
        try {
          setCharacters([]);
          setShowConfirmation(false);
        } catch (error) {
          console.error('Error clearing characters:', error);
          setErrorMessage('Failed to clear characters');
        }
      }, [setCharacters, setErrorMessage]);

      const cancelClearAll = useCallback(() => {
        setShowConfirmation(false);
      }, []);

      const handleRepoClick = useCallback(() => {
        setShowRepoConfirmation(true);
      }, []);

      const confirmRepoNavigation = useCallback(() => {
        try {
          window.open(repoUrl, '_blank');
          setShowRepoConfirmation(false);
        } catch (error) {
          console.error('Error opening repository:', error);
          setErrorMessage('Failed to open repository');
        }
      }, [repoUrl]);

      const cancelRepoNavigation = useCallback(() => {
        setShowRepoConfirmation(false);
      }, []);

      // Memoized values
      const headerStyle = useMemo(() => ({
        background: 'linear-gradient(to right, #1a1130, #4e2a6b, #1a1130)'
      }), []);

      const mainClasses = useMemo(() => (
        `min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'} font-sans`
      ), [theme]);

      return (
        <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'} font-sans`}>
          <header className="p-4 flex justify-between items-center" style={{ background: 'linear-gradient(to right, #1a1130, #4e2a6b, #1a1130)' }}>
            <h1 className="text-2xl font-bold text-white">RPG Initiative Tracker</h1>
            <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
          </header>
          <div className="container mx-auto p-4 flex flex-col md:flex-row flex-grow">
            <aside className="md:w-1/3 p-4">
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
            </aside>
            <main className="md:w-2/3 p-4">
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
            </main>
          </div>
          <div className="flex justify-start p-4">
            <button onClick={handleClearAll} className="text-gray-400 hover:text-white text-xl" title="Limpar todos os dados">
              <IoTrash />
            </button>
          </div>
          <footer className="bg-gray-800 dark:bg-gray-700 py-2 flex justify-center items-center mt-auto">
            <Footer
              repoUrl={repoUrl}
              projectVersion={projectVersion}
              startYear={startYear}
              currentYear={currentYear}
              handleRepoClick={handleRepoClick}
            />
          </footer>
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
