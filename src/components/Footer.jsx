import React from 'react';
    import { FaGithub } from 'react-icons/fa';

    const Footer = ({ repoUrl, projectVersion, startYear, currentYear, handleRepoClick }) => {
      return (
        <footer className="p-4 text-gray-500 text-xs mt-auto border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-center items-center text-center">
            <div className="flex items-center pb-2 md:pb-0 md:pr-4">
              <button onClick={handleRepoClick} className="flex items-center hover:text-gray-300">
                <FaGithub className="mr-1" />
                Repositório do Projeto
              </button>
              <span className="ml-1">v{projectVersion}</span>
            </div>
            <div className="py-2 md:py-0 md:pr-4">
              <span>Desenvolvido por: </span>
              <span>Wanderlan Lima - </span>
              <a href="mailto:wanderlan1991@gmail.com" className="hover:text-gray-300">wanderlan1991@gmail.com</a>
            </div>
            <div className="py-2 md:py-0">
              <span>Copyright © {startYear} - {currentYear} Todos os direitos reservados</span>
            </div>
          </div>
        </footer>
      );
    };

    export default Footer;
