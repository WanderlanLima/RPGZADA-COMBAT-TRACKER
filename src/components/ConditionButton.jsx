import React from 'react';
import { IoCheckmarkCircle } from 'react-icons/io5';

const ConditionButton = ({ condition, character, onClick }) => {
  const isActive = character.conditions?.some(c => {
    const [type, details] = c.split(':');
    if (type === 'Buff') {
      const [name] = details.split('|');
      return name.trim() === condition;
    }
    return type === condition;
  });

  const getBuffColor = () => {
    if (!isActive || condition !== 'Buff') return '#9333ea';
    
    const buffCondition = character.conditions.find(c => {
      const [type, details] = c.split(':');
      return type === 'Buff' && details.split('|')[0].trim() === condition;
    });
    
    return buffCondition?.split('|')[1] || '#9333ea';
  };

  const buttonClasses = `
    gamer-button p-2 rounded-lg text-sm font-medium cursor-pointer
    transition-all duration-200 transform hover:scale-105 min-h-[40px]
    flex items-center justify-center text-center min-w-[60px] space-x-1
    ${
      isActive
        ? condition === 'Buff'
          ? `bg-[${getBuffColor()}] text-white shadow-purple border border-purple-300`
          : 'bg-purple-900 text-white shadow-purple border border-purple-600'
        : condition === 'Buff'
          ? 'bg-purple-400 text-white hover:bg-purple-300 border border-purple-200'
          : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
    }
  `;

  return (
    <div
      onClick={onClick}
      className={buttonClasses}
    >
      <span>{condition}</span>
      {isActive && (
        <IoCheckmarkCircle className="text-purple-400 text-xl" />
      )}
    </div>
  );
};

export default ConditionButton;
