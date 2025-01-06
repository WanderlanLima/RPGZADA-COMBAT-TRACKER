import React from 'react';
import { FaFileUpload } from 'react-icons/fa';

const FileUpload = ({ handleTextFileUpload }) => {
  return (
    <div className="mt-4">
      <input
        type="file"
        accept=".txt"
        onChange={handleTextFileUpload}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded cursor-pointer block text-center flex items-center justify-center"
      >
        <FaFileUpload className="mr-2" />
        Importar Personagens
      </label>
    </div>
  );
};

export default FileUpload;
