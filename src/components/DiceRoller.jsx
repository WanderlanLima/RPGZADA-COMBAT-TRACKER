import React, { useState, useEffect } from 'react';
import { FaTrash, FaRedo } from 'react-icons/fa';
import { GiDiceEightFacesEight } from 'react-icons/gi';
import '../styles/DiceRoller.css';

const DiceRoller = ({ isVisible }) => {
  const [command, setCommand] = useState('');
  const [rollMode, setRollMode] = useState('normal');
  const [history, setHistory] = useState([]);
  const [showRepeatDialog, setShowRepeatDialog] = useState(false);
  const [repeatCount, setRepeatCount] = useState(2);
  const [tooltipFormula, setTooltipFormula] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showModifierDialog, setShowModifierDialog] = useState(false);
  const [modifierValue, setModifierValue] = useState(1);
  const [lastCalculation, setLastCalculation] = useState('');
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 20, y: 20 });

  // Inicializa o som dos dados
  const diceSound = new Audio('/sounds/dice-roll.mp3');
  diceSound.preload = 'auto';

  const parseCommand = (cmd) => {
    // Verifica se tem o comando de repetição (#)
    const repeatMatch = cmd.match(/^(\d+)#(.+)/);
    if (repeatMatch) {
      const repetitions = parseInt(repeatMatch[1]);
      const diceCommand = repeatMatch[2];
      const results = [];
      
      // Executa a rolagem o número de vezes especificado
      for (let i = 0; i < repetitions; i++) {
        const singleResult = parseSingleRoll(diceCommand);
        results.push({
          ...singleResult,
          formula: diceCommand
        });
      }

      return {
        isMultiRoll: true,
        results,
        formula: cmd
      };
    }

    return parseSingleRoll(cmd);
  };

  // Função que processa uma única rolagem
  const parseSingleRoll = (cmd) => {
    const regex = /(\d+)d(\d+)(?![0-9])|([+-]\d+)(?![d])/g;
    let total = 0;
    let diceGroups = new Map();
    let formula = cmd;
    let match;

    while ((match = regex.exec(cmd)) !== null) {
      if (match[1] && match[2]) {
        const quantity = parseInt(match[1]);
        const faces = parseInt(match[2]);
        let diceRolls = [];

        if (faces === 20 && rollMode !== 'normal' && quantity === 1) {
          const roll1 = Math.floor(Math.random() * faces) + 1;
          const roll2 = Math.floor(Math.random() * faces) + 1;
          const chosenRoll = rollMode === 'advantage' ? Math.max(roll1, roll2) : Math.min(roll1, roll2);
          diceRolls.push(chosenRoll);
          total += chosenRoll;

          if (!diceGroups.has(faces)) {
            diceGroups.set(faces, {
              rolls: [],
              modifier: 0,
              advantageRolls: { roll1, roll2, chosen: chosenRoll }
            });
          }
          diceGroups.get(faces).rolls.push(...diceRolls);
        } else {
          for (let i = 0; i < quantity; i++) {
            const roll = Math.floor(Math.random() * faces) + 1;
            diceRolls.push(roll);
            total += roll;
          }

          if (!diceGroups.has(faces)) {
            diceGroups.set(faces, {
              rolls: [],
              modifier: 0
            });
          }
          diceGroups.get(faces).rolls.push(...diceRolls);
        }
      } else if (match[3]) {
        const mod = parseInt(match[3]);
        total += mod;
        const lastFace = Array.from(diceGroups.keys()).pop();
        if (lastFace) {
          diceGroups.get(lastFace).modifier += mod;
        }
      }
    }

    const rolls = Array.from(diceGroups.entries()).map(([faces, data]) => ({
      faces,
      rolls: data.rolls,
      modifier: data.modifier,
      advantageRolls: data.advantageRolls
    }));

    return { total, rolls, formula };
  };

  const handleRoll = () => {
    if (command) {
      const result = evaluateExpression(command);
      if (result !== null) {
        const historyItem = {
          id: Date.now(),
          formula: command,
          isCalculation: true,
          total: result
        };
        setHistory(prev => [historyItem, ...prev].slice(0, 10));
        setCommand('');
      } else {
        const diceResult = parseCommand(command);
        
        if (diceResult.isMultiRoll) {
          const historyItems = diceResult.results.map((roll, index) => ({
            id: Date.now() + index,
            formula: `Rolagem ${index + 1}: ${roll.formula}`,
            rolls: roll.rolls,
            total: roll.total,
            rollMode
          }));

          setHistory(prev => [...historyItems, ...prev].slice(0, 10));
        } else {
          const historyItem = {
            id: Date.now(),
            formula: diceResult.formula,
            rolls: diceResult.rolls,
            total: diceResult.total,
            rollMode
          };

          setHistory(prev => [historyItem, ...prev].slice(0, 10));
        }

        setCommand('');
        setRollMode('normal');
        
        // Reproduz o som da rolagem apenas para rolagens de dados
        diceSound.currentTime = 0;
        diceSound.play().catch(() => {});
      }
    }
  };

  const handleDiceClick = (faces) => {
    const diceToAdd = `1d${faces}`;
    if (command) {
      const lastChar = command[command.length - 1];
      const separator = lastChar === '+' ? '' : '+';
      setCommand(prev => `${prev}${separator}${diceToAdd}`);
    } else {
      setCommand(diceToAdd);
    }
  };

  const handleModifierClick = () => {
    setModifierValue(1);
    setShowModifierDialog(true);
  };

  const handleModifierConfirm = () => {
    if (command && command.length > 0) {
      const lastChar = command[command.length - 1];
      if (lastChar !== '+') {
        setCommand(prev => `${prev}+${modifierValue}`);
      }
    } else {
      setCommand(`${modifierValue}`);
    }
    setShowModifierDialog(false);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const renderRollResult = (roll) => {
    if (roll.advantageRolls) {
      const { roll1, roll2, chosen } = roll.advantageRolls;
      return (
        <div className="advantage-rolls">
          <div className="roll-value">Primeiro d20: {roll1}</div>
          <div className="roll-value">Segundo d20: {roll2}</div>
          <div className="chosen-value">Resultado: {chosen}</div>
          {roll.modifier ? <div className="roll-value">Modificador: {roll.modifier}</div> : null}
        </div>
      );
    }

    const rollSum = roll.rolls.reduce((sum, r) => sum + r, 0);
    return (
      <div className="roll-result">
        <div className="roll-details">
          {`${roll.rolls.length}d${roll.faces}[${roll.rolls.join(' + ')}]`}
        </div>
        <div className="roll-sum">
          {`= ${rollSum}${roll.modifier ? ` + ${roll.modifier}` : ''}`}
        </div>
      </div>
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipFormula && !event.target.closest('.formula-tooltip')) {
        setTooltipFormula(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [tooltipFormula]);

  const handleFormulaClick = (formula, event) => {
    event.stopPropagation();
    const rect = event.target.getBoundingClientRect();
    setTooltipFormula({
      text: formula,
      x: rect.left + window.scrollX,
      y: rect.bottom + window.scrollY
    });
  };

  const handleDragStart = (e) => {
    if (e.type === 'mousedown') {
      e.preventDefault();
    }
    setIsDragging(true);
    const touch = e.type === 'touchstart' ? e.touches[0] : e;
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    });
  };

  const handleDrag = (e) => {
    if (!isDragging) return;
    
    const touch = e.type === 'touchmove' ? e.touches[0] : e;
    const x = touch.clientX - dragOffset.x;
    const y = touch.clientY - dragOffset.y;
    
    // Limita a posição dentro da janela
    const maxX = window.innerWidth - 56; // largura do botão
    const maxY = window.innerHeight - 56; // altura do botão
    
    setButtonPosition({
      x: Math.max(0, Math.min(x, maxX)),
      y: Math.max(0, Math.min(y, maxY))
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDrag);
      window.addEventListener('touchmove', handleDrag);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchend', handleDragEnd);
      
      return () => {
        window.removeEventListener('mousemove', handleDrag);
        window.removeEventListener('touchmove', handleDrag);
        window.removeEventListener('mouseup', handleDragEnd);
        window.removeEventListener('touchend', handleDragEnd);
      };
    }
  }, [isDragging]);

  const closeTooltip = () => {
    setTooltipFormula(null);
  };

  const renderHistoryItem = (item) => {
    if (item.isCalculation) {
      return (
        <div key={item.id} className="history-item">
          <div className="roll-line">
            <span 
              className="roll-formula"
              onClick={(e) => handleFormulaClick(item.formula, e)}
              style={{ cursor: 'pointer' }}
            >
              {item.formula}
            </span>
          </div>
          <div className="roll-total">
            = {item.total}
          </div>
        </div>
      );
    }

    if (item.formula.startsWith('Rolagem')) {
      return (
        <div key={item.id} className="history-item">
          <div className="roll-line">
            <span 
              className="roll-formula" 
              onClick={(e) => handleFormulaClick(item.formula, e)}
              style={{ cursor: 'pointer' }}
            >
              {item.formula}
            </span>
            {item.rollMode !== 'normal' && (
              <span className={`roll-tag ${item.rollMode}-tag`}>
                {item.rollMode === 'advantage' ? 'Vantagem' : 'Desvantagem'}
              </span>
            )}
          </div>
          {item.rolls.map((roll, index) => (
            <div key={index} className="roll-group">
              {renderRollResult(roll)}
            </div>
          ))}
          <div className="roll-total">
            Total: {item.rolls.reduce((sum, roll) => {
              const diceSum = roll.rolls.reduce((acc, r) => acc + r, 0);
              return sum + diceSum + (roll.modifier || 0);
            }, 0)}
          </div>
        </div>
      );
    }

    return (
      <div key={item.id} className="history-item">
        <div className="roll-line">
          <span 
            className="roll-formula"
            onClick={(e) => handleFormulaClick(item.formula, e)}
            style={{ cursor: 'pointer' }}
          >
            {item.formula}
          </span>
          {item.rollMode !== 'normal' && (
            <span className={`roll-tag ${item.rollMode}-tag`}>
              {item.rollMode === 'advantage' ? 'Vantagem' : 'Desvantagem'}
            </span>
          )}
        </div>
        {item.rolls.map((roll, index) => (
          <div key={index} className="roll-group">
            {renderRollResult(roll)}
          </div>
        ))}
        <div className="roll-total">Total: {item.total}</div>
      </div>
    );
  };

  const handleRepeatClick = () => {
    if (command) {
      setRepeatCount(2);
      setShowRepeatDialog(true);
    }
  };

  const handleRepeatConfirm = () => {
    if (command && repeatCount > 0) {
      const results = [];
      
      for (let i = 0; i < repeatCount; i++) {
        const result = parseSingleRoll(command);
        results.push({
          id: Date.now() + i,
          formula: `Rolagem ${i + 1}: ${command}`,
          rolls: result.rolls,
          total: result.total,
          rollMode
        });
      }

      setHistory(prev => [...results, ...prev].slice(0, 10));
      setShowRepeatDialog(false);
      setCommand('');
      setRollMode('normal');
      setRepeatCount(2);
      
      // Reproduz o som da rolagem
      diceSound.currentTime = 0;
      diceSound.play().catch(() => {});
    }
  };

  const evaluateExpression = (expr) => {
    try {
      // Remove todos os espaços e valida a expressão
      const sanitizedExpr = expr.replace(/\s+/g, '');
      if (!/^[\d+\-*/()d]+$/.test(sanitizedExpr)) {
        return null;
      }

      // Se a expressão contém 'd', não calcula
      if (sanitizedExpr.includes('d')) {
        return null;
      }

      // Avalia a expressão
      // eslint-disable-next-line no-new-func
      const result = Function('"use strict";return (' + sanitizedExpr + ')')();
      return result;
    } catch (e) {
      return null;
    }
  };

  const handleCommandChange = (e) => {
    const value = e.target.value;
    setCommand(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const result = evaluateExpression(command);
      if (result !== null) {
        const historyItem = {
          id: Date.now(),
          formula: command,
          isCalculation: true,
          total: result
        };
        setHistory(prev => [historyItem, ...prev].slice(0, 10));
        setCommand('');
      } else {
        handleRoll();
      }
    }
  };

  const isMobile = window.innerWidth <= 768;

  if (!isVisible) return null;

  return (
    <div className="dice-roller-container">
      {isMobile ? (
        <>
          <button
            className="floating-dice-button"
            style={{
              transform: isDragging ? 'scale(0.95)' : 'scale(1)',
              left: buttonPosition.x + 'px',
              top: buttonPosition.y + 'px'
            }}
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            onClick={() => !isDragging && setIsChatbotOpen(prev => !prev)}
          >
            <GiDiceEightFacesEight size={32} />
          </button>

          <div className={`dice-chatbot ${isChatbotOpen ? 'visible' : ''}`}>
            {showRepeatDialog && (
              <div className="repeat-dialog">
                <div className="repeat-dialog-content">
                  <h3>Repetir Rolagem</h3>
                  <p>Quantas vezes você quer repetir "{command}"?</p>
                  <input
                    type="number"
                    min="2"
                    max="10"
                    value={repeatCount}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '') {
                        setRepeatCount('');
                      } else {
                        const num = parseInt(value);
                        if (!isNaN(num)) {
                          setRepeatCount(num);
                        }
                      }
                    }}
                    onFocus={(e) => e.target.select()}
                    onBlur={(e) => {
                      if (e.target.value === '') {
                        setRepeatCount(2);
                      }
                    }}
                    className="repeat-input"
                  />
                  <div className="repeat-dialog-buttons">
                    <button 
                      onClick={() => {
                        setShowRepeatDialog(false);
                        setRepeatCount(2);
                      }} 
                      className="cancel-button"
                    >
                      Cancelar
                    </button>
                    <button onClick={handleRepeatConfirm} className="confirm-button">
                      Confirmar
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="chatbot-header">
              <span className="chatbot-title">Rolador de Dados</span>
              <button className="chatbot-close" onClick={() => setIsChatbotOpen(false)}>×</button>
            </div>

            <div className="chatbot-history">
              {history.map(renderHistoryItem)}
            </div>

            <div className="dice-grid">
              <button className="dice-button" onClick={() => handleDiceClick(4)}>d4</button>
              <button className="dice-button" onClick={() => handleDiceClick(6)}>d6</button>
              <button className="dice-button" onClick={() => handleDiceClick(8)}>d8</button>
              <button className="dice-button" onClick={() => handleDiceClick(10)}>d10</button>
              <button className="dice-button" onClick={() => handleDiceClick(12)}>d12</button>
              <button className="dice-button" onClick={() => handleDiceClick(20)}>d20</button>
              <button className="dice-button" onClick={() => handleDiceClick(100)}>d100</button>
              <button className="modifier-button" onClick={handleModifierClick}>+</button>
              <button 
                className={`roll-mode-button advantage ${rollMode === 'advantage' ? 'active' : ''}`}
                onClick={() => setRollMode(prev => prev === 'advantage' ? 'normal' : 'advantage')}
              >
                ▲
              </button>
              <button 
                className={`roll-mode-button disadvantage ${rollMode === 'disadvantage' ? 'active' : ''}`}
                onClick={() => setRollMode(prev => prev === 'disadvantage' ? 'normal' : 'disadvantage')}
              >
                ▼
              </button>
              <button 
                className="repeat-button" 
                onClick={handleRepeatClick}
                disabled={!command}
              >
                <FaRedo size={18} />
              </button>
            </div>

            <div className="chatbot-input-area">
              <input
                type="text"
                className="chatbot-input"
                value={command}
                onChange={handleCommandChange}
                onKeyDown={handleKeyDown}
                placeholder="1d20+5 ou 2*3+4"
              />
              <button className="chatbot-send" onClick={handleRoll}>
                ▶
              </button>
            </div>
          </div>
        </>
      ) : (
        // Versão desktop original
        <>
          {tooltipFormula && (
            <div 
              className="formula-tooltip"
              style={{
                left: tooltipFormula.x + 'px',
                top: tooltipFormula.y + 'px'
              }}
              onClick={closeTooltip}
            >
              {tooltipFormula.text}
            </div>
          )}
          {showRepeatDialog && (
            <div className="repeat-dialog">
              <div className="repeat-dialog-content">
                <h3>Repetir Rolagem</h3>
                <p>Quantas vezes você quer repetir "{command}"?</p>
                <input
                  type="number"
                  min="2"
                  max="10"
                  value={repeatCount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      setRepeatCount('');
                    } else {
                      const num = parseInt(value);
                      if (!isNaN(num)) {
                        setRepeatCount(num);
                      }
                    }
                  }}
                  onFocus={(e) => e.target.select()}
                  onBlur={(e) => {
                    if (e.target.value === '') {
                      setRepeatCount(2);
                    }
                  }}
                  className="repeat-input"
                />
                <div className="repeat-dialog-buttons">
                  <button 
                    onClick={() => {
                      setShowRepeatDialog(false);
                      setRepeatCount(2);
                    }} 
                    className="cancel-button"
                  >
                    Cancelar
                  </button>
                  <button onClick={handleRepeatConfirm} className="confirm-button">
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          )}
          {showModifierDialog && (
            <div className="repeat-dialog">
              <div className="repeat-dialog-content">
                <h3>Adicionar Modificador</h3>
                <p>Digite o valor do modificador:</p>
                <input
                  type="number"
                  value={modifierValue}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      setModifierValue('');
                    } else {
                      const num = parseInt(value);
                      if (!isNaN(num)) {
                        setModifierValue(num);
                      }
                    }
                  }}
                  onFocus={(e) => e.target.select()}
                  onBlur={(e) => {
                    if (e.target.value === '') {
                      setModifierValue(1);
                    }
                  }}
                  className="repeat-input"
                />
                <div className="repeat-dialog-buttons">
                  <button 
                    onClick={() => {
                      setShowModifierDialog(false);
                      setModifierValue(1);
                    }} 
                    className="cancel-button"
                  >
                    Cancelar
                  </button>
                  <button onClick={handleModifierConfirm} className="confirm-button">
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          )}
          {history.length > 0 && (
            <div className="dice-history">
              {history.map(renderHistoryItem)}
            </div>
          )}
          <div className="dice-tray">
            <div className="input-group">
              <button className="clear-history-button" onClick={clearHistory} title="Limpar histórico">
                <FaTrash size={14} />
              </button>
              <input
                type="text"
                className="command-input"
                value={command}
                onChange={handleCommandChange}
                onKeyDown={handleKeyDown}
                placeholder="1d20+5 ou 2*3+4"
              />
              <button 
                className="repeat-button" 
                onClick={handleRepeatClick}
                title="Repetir rolagem"
                disabled={!command}
              >
                <FaRedo size={14} />
              </button>
            </div>
            <div className="dice-grid">
              <button className="dice-button" onClick={() => handleDiceClick(4)}>d4</button>
              <button className="dice-button" onClick={() => handleDiceClick(6)}>d6</button>
              <button className="dice-button" onClick={() => handleDiceClick(8)}>d8</button>
              <button className="dice-button" onClick={() => handleDiceClick(10)}>d10</button>
              <button className="dice-button" onClick={() => handleDiceClick(12)}>d12</button>
              <button className="dice-button" onClick={() => handleDiceClick(20)}>d20</button>
              <button className="dice-button" onClick={() => handleDiceClick(100)}>d100</button>
              <button className="modifier-button" onClick={handleModifierClick}>+</button>
              <button 
                className={`roll-mode-button advantage ${rollMode === 'advantage' ? 'active' : ''}`}
                onClick={() => setRollMode(prev => prev === 'advantage' ? 'normal' : 'advantage')}
              >
                ▲
              </button>
              <button 
                className={`roll-mode-button disadvantage ${rollMode === 'disadvantage' ? 'active' : ''}`}
                onClick={() => setRollMode(prev => prev === 'disadvantage' ? 'normal' : 'disadvantage')}
              >
                ▼
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DiceRoller;
