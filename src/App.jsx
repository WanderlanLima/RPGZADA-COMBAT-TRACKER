import React, { useState, useCallback, useContext } from 'react';
import { FaSun, FaMoon, FaGithub, FaRedoAlt } from 'react-icons/fa';
import { IoTrash } from 'react-icons/io5';
import CharacterForm from './components/CharacterForm';
import InitiativeList from './components/InitiativeList';
import Footer from './components/Footer';
import useCharacterManager from './hooks/useCharacterManager';
import useTheme from './hooks/useTheme';
import ThemeToggleButton from './components/ThemeToggleButton';
import { IoCloudUploadOutline, IoCloudDownloadOutline, IoHelpCircleOutline } from 'react-icons/io5';
import SaveLogButton from './components/SaveLogButton';
import LoadLogButton from './components/LoadLogButton';
import { CombatContext } from './contexts/CombatContext';


function App() {
    const { startNewCombat, combatId } = useContext(CombatContext);
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
        loadLog,
        handleRollInitiativesByType
    } = useCharacterManager();

    const { theme, toggleTheme } = useTheme();
    const [showInstructions, setShowInstructions] = useState(false);
    const repoUrl = "https://github.com/WanderlanLima/RPGZADA-COMBAT-TRACKER";
    const projectVersion = "1.5";
    const startYear = 2024;
    const currentYear = new Date().getFullYear();

    const handleClearAll = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        clearAllCharacters();
        setBattleStarted(false);
    }, [clearAllCharacters, setBattleStarted]);

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
                            setShowInstructions={setShowInstructions}
                        />

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
                                <h2 className="text-xl font-bold mb-4">Como Importar Personagens</h2>
                                <div className="prose dark:prose-invert">
                                    <p className="mb-4">
                                        Para importar vários personagens de uma vez, crie um arquivo .txt com um personagem por linha, seguindo este formato:
                                    </p>

                                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md mb-4 font-mono text-sm">
                                        Nome, Tipo, [Quantidade], Modificador
                                    </div>

                                    <p className="mb-2">Onde:</p>
                                    <ul className="list-disc pl-5 mb-4">
                                        <li><strong>Nome:</strong> Nome do personagem</li>
                                        <li><strong>Tipo:</strong> "pl" para jogador ou "npc" para NPC</li>
                                        <li><strong>Quantidade:</strong> (Opcional, apenas para NPCs) Número de cópias</li>
                                        <li><strong>Modificador:</strong> Modificador de iniciativa</li>
                                    </ul>

                                    <p className="mb-2">Exemplos:</p>
                                    <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md mb-4 whitespace-pre-wrap">
                                        {`Gandalf, pl, 2
Aragorn, pl, 1
Orc, npc, 3, 1
Goblin, npc, 5, 0
Dragão, npc, 1, 4`}
                                    </pre>

                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Dica: Você pode criar o arquivo em qualquer editor de texto (como Bloco de Notas) e salvá-lo com extensão .txt
                                    </p>
                                </div>
                                <div className="mt-6 flex justify-end">
                                    <button
                                        onClick={() => setShowInstructions(false)}
                                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
                                    >
                                        Fechar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </aside>
                <main className="md:w-2/3 p-4">
                     <div>
                        <button onClick={startNewCombat}>Novo Combate</button>
                        {combatId &&  <p>Compartilhe este link para convidar outros jogadores: <br/> {window.location.href}</p>}
                    </div>
                    <InitiativeList
                        sortedCharacters={sortedCharacters}
                        theme={theme}
                        handleRollInitiative={handleRollInitiative}
                        handleDeleteCharacter={handleDeleteCharacter}
                        handleResetInitiatives={handleResetInitiatives}
                        handleRollAll={handleRollAll}
                        handleRollAllInitiatives={handleRollAllInitiatives}
                        handleRollInitiativesByType={handleRollInitiativesByType}
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
        </div>
    );
}

export default App;