import React from 'react';
import { IoCloudDownloadOutline } from 'react-icons/io5';

const LoadLogButton = ({ onChange }) => {
  return (
    <div className="w-full">
      <label className="flex items-center justify-center w-full p-2 text-white bg-green-600 rounded-md cursor-pointer hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm">
        <IoCloudDownloadOutline className="mr-1" />
        Carregar Log
        <input
          type="file"
          className="hidden" 
          accept=".json"
          onChange={onChange}
        />
      </label>
    </div>
  );
};

export default LoadLogButton;
