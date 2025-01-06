import React, { useState, useCallback } from 'react';
    import { FaSun, FaMoon, FaGithub, FaRedoAlt } from 'react-icons/fa';
    import { IoTrash } from 'react-icons/io5';
    import CharacterForm from './components/CharacterForm';
    import InitiativeList from './components/InitiativeList';
    import Footer from './components/Footer';
    import useCharacterManager from './hooks/useCharacterManager';
    import useTheme from './hooks/useTheme';
    import ThemeToggleButton from './components/ThemeToggleButton';
    import ClearConfirmation from './components/ClearConfirmation';
    import { IoCloudUploadOutline, IoCloudDownloadOutline, IoHelpCircleOutline } from 'react-icons/io5';
import SaveLogButton from './components/SaveLogButton';
import LoadLogButton from './components/LoadLogButton';
import FloatingButton from './components/FloatingButton';

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
        clearAllCharacters,
        battleStarted,
        setBattleStarted,
        currentTurnIndex,
        nextTurn,
        saveLog,
        loadLog
      } = useCharacterManager();

      const { theme, toggleTheme } = useTheme();
      const [showConfirmation, setShowConfirmation] = useState(false);
      const [showInstructions, setShowInstructions] = useState(false);
      const repoUrl = "https://github.com/WanderlanLima/RPGZADA-COMBAT-TRACKER";
      const projectVersion = "1.5";
      const startYear = 2024;
      const currentYear = new Date().getFullYear();

      const handleClearAll = useCallback(() => {
        setShowConfirmation(true);
      }, []);

      const confirmClearAll = useCallback(() => {
        clearAllCharacters();
        setShowConfirmation(false);
        setBattleStarted(false);
      }, [clearAllCharacters, setBattleStarted]);

      const cancelClearAll = useCallback(() => {
        setShowConfirmation(false);
      }, []);

      const handleRepoClick = useCallback(() => {
        window.open(repoUrl, '_blank');
      }, [repoUrl]);

      return (
        <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'} font-sans`}>
          <header className="p-4 flex justify-between items-center" style={{ background: 'linear-gradient(to right, #1a1130, #4e2a6b, #1a1130)' }}>
            <h1 className="text-2xl font-bold text-white text-center flex-grow">Assistente de Combate</h1>
            <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
          </header>
          <div className="container mx-auto p-4 flex flex-col md:flex-row flex-grow">
            <aside className="md:w-1/3 p-4">
              <div className="relative">
                <CharacterForm
                  characters={characters}
                  setCharacters={setCharacters}
                  newCharacter={newCharacter}
                  handleInputChange={handleInputChange}
                  handleImageUpload={handleImageUpload}
                  errorMessage={errorMessage}
                  npcQuantity={npcQuantity}
                  setNpcQuantity={setNpcQuantity}
                  handleAddCharacter={handleAddCharacter}
                  handleTextFileUpload={handleTextFileUpload}
                  handleClearAll={handleClearAll}
                />
                <button
                  onClick={() => setShowInstructions(true)}
                  className="absolute right-0 bottom-0 p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  title="Instruções de importação"
                >
                  <IoHelpCircleOutline className="w-6 h-6" />
                </button>
              </div>
              <div className="mt-4 flex space-x-2">
                <div className="flex-1">
                  <SaveLogButton onClick={saveLog} />
                </div>
                <div className="flex-1"><LoadLogButton onChange={(e) => e.target.files[0] && loadLog(e.target.files[0])} /></div>
              </div>
              {showInstructions && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 max-w-lg w-full`}>
                    <h2 className="text-xl font-bold mb-4">Instruções de Formato</h2>
                    <div className="prose">
                      <p>O arquivo .txt deve ter um personagem por linha, com as informações separadas por vírgulas:</p>
                      <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                        {`Nome do Personagem, Tipo, Quantidade, Modificador
Guerreiro, pl, 2
Mago, pl, 5
Arqueiro, pl
Goblin, npc, 3, -1
Orc, npc, 2`}
                      </pre>
                      <p className="mt-2">Onde:</p>
                      <ul className="list-disc pl-5">
                        <li><strong>Nome do Personagem</strong>: O nome do personagem</li>
                        <li><strong>Tipo</strong>: "pl" para jogador ou "npc" para NPC</li>
                        <li><strong>Quantidade</strong>: (Opcional, apenas para NPCs) Quantidade de NPCs a serem criados. Padrão: 1</li>
                        <li><strong>Modificador</strong>: Modificador de iniciativa do personagem</li>
                      </ul>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => setShowInstructions(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        Fechar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </aside>
            <main className="md:w-2/3 p-4">
              <InitiativeList
                sortedCharacters={sortedCharacters}
                theme={theme}
                handleRollInitiative={handleRollInitiative}
                handleDeleteCharacter={handleDeleteCharacter}
                handleResetInitiatives={handleResetInitiatives}
                handleRollAll={handleRollAll}
                handleRollAllInitiatives={handleRollAllInitiatives}
                setCharacters={setCharacters}
                characters={characters}
                setBattleStarted={setBattleStarted}
                battleStarted={battleStarted}
                currentTurnIndex={currentTurnIndex}
                nextTurn={nextTurn}
              />
            </main>
          </div>
          <div className="flex justify-start p-4">
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
          <FloatingButton onClick={nextTurn} battleStarted={battleStarted} />
        </div>
      );
    }

    export default App;
