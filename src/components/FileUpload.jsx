import React, { useState } from 'react';
import { FaFileUpload, FaSpinner } from 'react-icons/fa';

const FileUpload = ({ handleTextFileUpload }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e) => {
    setIsUploading(true);
    try {
      await handleTextFileUpload(e);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mt-4">
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
        className={`bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg cursor-pointer block text-center flex items-center justify-center touch:active-scale transition-all ${
          isUploading ? 'opacity-75 cursor-wait' : ''
        }`}
        aria-label={isUploading ? 'Carregando...' : 'Importar Personagens'}
      >
        {isUploading ? (
          <FaSpinner className="mr-2 animate-spin" />
        ) : (
          <FaFileUpload className="mr-2" />
        )}
        <span className="text-base">
          {isUploading ? 'Carregando...' : 'Importar Personagens'}
        </span>
      </label>
      
      {/* Feedback de sucesso/erro */}
      <div className="mt-2 text-sm text-center">
        {isUploading && (
          <p className="text-gray-500 dark:text-gray-400">
            Por favor, aguarde enquanto processamos o arquivo...
          </p>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
