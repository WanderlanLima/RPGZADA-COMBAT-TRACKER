import React, { useState } from 'react';
import { FaFileUpload, FaSpinner } from 'react-icons/fa';

const FileUpload = ({ handleTextFileUpload }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await handleTextFileUpload(e);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        accept=".txt"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
        disabled={isUploading}
      />
      <label
        htmlFor="file-upload"
        className={`flex items-center justify-center w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors ${
          isUploading ? 'opacity-75 cursor-wait' : 'cursor-pointer'
        }`}
      >
        {isUploading ? (
          <FaSpinner className="mr-2 animate-spin" />
        ) : (
          <FaFileUpload className="mr-2" />
        )}
        <span>{isUploading ? 'Carregando...' : 'Importar Personagens'}</span>
      </label>

      {isUploading && (
        <p className="mt-2 text-sm text-gray-400 text-center">
          Processando arquivo...
        </p>
      )}
    </div>
  );
};

export default FileUpload;
