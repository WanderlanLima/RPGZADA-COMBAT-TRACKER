import React, { useState } from 'react';
import { FaHeart, FaSkull } from 'react-icons/fa';
import '../styles/DeathSave.css';

function DeathSave() {
  const [successStates, setSuccessStates] = useState([false, false, false]);
  const [failureStates, setFailureStates] = useState([false, false, false]);

  const toggleSuccess = (index) => {
    setSuccessStates(prev => {
      const newStates = [...prev];
      newStates[index] = !newStates[index];
      return newStates;
    });
  };

  const toggleFailure = (index) => {
    setFailureStates(prev => {
      const newStates = [...prev];
      newStates[index] = !newStates[index];
      return newStates;
    });
  };

  return (
    <div className="death-save-container">
      <div className="death-save-row">
        <div className="death-save-group">
          {successStates.map((isEnabled, index) => (
            <FaHeart 
              key={`success-${index}`}
              className={`death-save-icon ${isEnabled ? 'enabled' : ''}`}
              onClick={() => toggleSuccess(index)}
            />
          ))}
        </div>
        <div className="death-save-group">
          {failureStates.map((isEnabled, index) => (
            <FaSkull 
              key={`failure-${index}`}
              className={`death-save-icon ${isEnabled ? 'enabled' : ''}`}
              onClick={() => toggleFailure(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default DeathSave;
