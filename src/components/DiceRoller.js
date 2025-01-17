import React, { useState, useEffect } from 'react';
import { GiD20, GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';
import '../styles/DiceRoller.css';

function DiceRoller({ isVisible = false }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [isRolling, setIsRolling] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const diceTypes = [4, 6, 8, 10, 12, 20, 100];
  const diceSound = new Audio('/sounds/dice-roll.mp3');

  useEffect(() => {
    // Pré-carrega o som
    diceSound.load();
  }, []);

  const playDiceSound = () => {
    diceSound.currentTime = 0;
    diceSound.play().catch(e => console.log('Erro ao tocar som:', e));
  };

  const rollDice = async (faces) => {
    setIsRolling(true);
    playDiceSound();

    // Simula a animação de rolagem
    const rolls = [];
    for (let i = 0; i < quantity; i++) {
      const result = Math.floor(Math.random() * faces) + 1;
      rolls.push(result);
    }

    const total = rolls.reduce((a, b) => a + b, 0);
    const newRoll = {
      id: Date.now(),
      faces,
      quantity,
      rolls,
      total,
      timestamp: new Date().toLocaleTimeString()
    };

    // Aguarda a animação
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setHistory(prev => [newRoll, ...prev].slice(0, 10)); // Mantém apenas os últimos 10 resultados
    setIsRolling(false);
    setIsMenuOpen(false);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  if (!isVisible) return null;

  return (
    <div className="dice-roller-container">
      <button 
        className={`dice-roller-button ${isRolling ? 'rolling' : ''}`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        disabled={isRolling}
      >
        {isRolling ? (
          <GiPerspectiveDiceSixFacesRandom className="dice-icon spinning" />
        ) : (
          <GiD20 className="dice-icon" />
        )}
      </button>

      {isMenuOpen && (
        <div className="dice-menu">
          <div className="dice-quantity">
            <label>Quantidade:</label>
            <input
              type="number"
              min="1"
              max="10"
              value={quantity}
              onChange={(e) => setQuantity(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
            />
          </div>
          {diceTypes.map(faces => (
            <button
              key={faces}
              className="dice-option"
              onClick={() => rollDice(faces)}
              disabled={isRolling}
            >
              {quantity}D{faces}
            </button>
          ))}
        </div>
      )}

      {history.length > 0 && (
        <div className="dice-history">
          <div className="history-header">
            <h3>Histórico</h3>
            <button className="clear-history" onClick={clearHistory}>Limpar</button>
          </div>
          {history.map(roll => (
            <div key={roll.id} className="history-item">
              <span className="roll-type">{roll.quantity}D{roll.faces}</span>
              <span className="roll-details">
                [{roll.rolls.join(', ')}] = {roll.total}
              </span>
              <span className="roll-time">{roll.timestamp}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DiceRoller;
