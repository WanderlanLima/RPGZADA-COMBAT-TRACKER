import React from 'react';
import { IoCloudUploadOutline } from 'react-icons/io5';

const SaveLogButton = ({ onClick }) => {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center justify-center w-full p-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm h-[32.38px]"
    >
      <IoCloudUploadOutline className="mr-1" />
      Salvar Log
    </button>
  );
};

export default SaveLogButton;
