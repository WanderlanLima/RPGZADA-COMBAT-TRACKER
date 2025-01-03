import React, { useState, useRef, useEffect } from 'react';
    import { IoInformationCircleOutline } from 'react-icons/io5';

    const FileUpload = ({ handleTextFileUpload }) => {
      const fileInputRef = useRef(null);
      const [showInstructions, setShowInstructions] = useState(false);
      const instructionsRef = useRef(null);

      const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'text/plain') {
          handleTextFileUpload(file);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        } else if (file) {
          alert('Por favor, selecione um arquivo .txt válido.');
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      };

      const toggleInstructions = () => {
        setShowInstructions(!showInstructions);
      };

      useEffect(() => {
        const handleClick = (event) => {
          setShowInstructions(false);
        };

        if (showInstructions) {
          document.addEventListener('mousedown', handleClick);
        }

        return () => {
          document.removeEventListener('mousedown', handleClick);
        };
      }, [showInstructions]);

      return (
        <div className="mb-2 relative">
          <label htmlFor="file-upload" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded mt-2 cursor-pointer block text-center">
            Carregar Personagens (.txt)
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".txt"
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
          />
          <button
            onClick={toggleInstructions}
            className="mt-2 p-1 text-gray-400 hover:text-white focus:outline-none flex items-center justify-center w-full"
            title="Instruções de Formato"
          >
            <IoInformationCircleOutline className="text-xl mr-1" />
            Instruções de Formato
          </button>
          {showInstructions && (
            <div
              ref={instructionsRef}
              className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50"
              onClick={toggleInstructions}
            >
              <div className="bg-gray-700 text-white p-4 rounded shadow-md w-80 z-50">
                <h3 className="font-bold mb-2">Instruções de Formato</h3>
                <p className="text-sm">
                  O arquivo .txt deve ter um personagem por linha, com as informações separadas por vírgulas.
                </p>
                <ul className="list-disc list-inside text-sm mt-2">
                  <li><strong>Nome do Personagem:</strong> O nome do personagem.</li>
                  <li><strong>Tipo:</strong> "pl" para jogador ou "npc" para NPC.</li>
                  <li><strong>Quantidade:</strong> (Opcional, apenas para NPCs) A quantidade de NPCs a serem criados com esse nome. Se não for especificado, o padrão é 1.</li>
                  <li><strong>Modificador:</strong> O modificador de iniciativa do personagem.</li>
                </ul>
                <p className="text-sm mt-2">
                  <strong>Exemplo:</strong><br/>
                  Guerreiro, pl, 2<br/>
                  Mago, pl, 5<br/>
                  Arqueiro, pl<br/>
                  Goblin, npc, 3, -1<br/>
                  Orc, npc, 2
                </p>
              </div>
              <div className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-40 blur-sm"></div>
            </div>
          )}
        </div>
      );
    };

    export default FileUpload;
