import React from 'react';

const D20Button = ({ onClick, isVisible }) => {
  if (!isVisible) return null;

  const handleClick = () => {
    const roll = Math.floor(Math.random() * 20) + 1;
    onClick(roll);
  };

  return (
    <button
      onClick={handleClick}
      className="gamer-button px-4 py-2 rounded-lg bg-purple-900/50 text-white hover:bg-purple-800/50 transition-all duration-200 border-2 border-purple-500 hover:border-purple-400 text-sm hover:brightness-110 flex items-center justify-center gap-2 shadow-[0_0_8px_rgba(147,51,234,0.3)] hover:shadow-[0_0_12px_rgba(147,51,234,0.5)]"
    >
      <span>Rolar D20</span>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className="w-5 h-5"
      >
        <path d="M13 3v7.267l6.294-3.633 1 1.732-6.293 3.633 6.293 3.635-1 1.732-6.294-3.634v7.267h-2v-7.267l-6.294 3.634-1-1.732 6.293-3.635-6.293-3.633 1-1.732 6.294 3.633v-7.267h2zm-1 4c-.552 0-1-.448-1-1s.448-1 1-1 1 .448 1 1-.448 1-1 1z"/>
      </svg>
    </button>
  );
};

export default D20Button;
