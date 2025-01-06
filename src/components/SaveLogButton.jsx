import React from 'react';
import { IoCloudUploadOutline } from 'react-icons/io5';

const SaveLogButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick} 
      className="flex items-center justify-center w-full p-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
    >
      <IoCloudUploadOutline className="mr-1" />
      Salvar Log
    </button>
  );
};

export default SaveLogButton;
