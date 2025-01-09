import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const DropdownMenu = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Todos');

  const options = [
    { value: 'all', label: 'Todos' },
    { value: 'npc', label: 'Somente NPCs' },
    { value: 'player', label: 'Somente Jogadores' }
  ];

  const handleOptionClick = (option) => {
    setSelectedOption(option.label);
    setIsOpen(false);
    onFilterChange(option.value);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="gamer-button text-white py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-opacity-90 transition-all"
      >
        <span>{selectedOption}</span>
        <FaChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-48 rounded-lg shadow-lg gamer-bg">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleOptionClick(option)}
                className="block w-full px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors text-left"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
