import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import './output.css';
import { CombatProvider } from './contexts/CombatContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CombatProvider>
      <App />
    </CombatProvider>
  </React.StrictMode>
);
