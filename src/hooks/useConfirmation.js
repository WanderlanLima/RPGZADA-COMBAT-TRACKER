import { useState, useCallback } from 'react';

const useConfirmation = (setCharacters, setErrorMessage) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const confirmClearAll = useCallback(() => {
    try {
      setCharacters([]);
      setShowConfirmation(false);
    } catch (error) {
      console.error('Error clearing characters:', error);
      setErrorMessage('Failed to clear characters');
    }
  }, [setCharacters, setErrorMessage]);

  const cancelClearAll = useCallback(() => {
    setShowConfirmation(false);
  }, []);

  return { showConfirmation, setShowConfirmation, confirmClearAll, cancelClearAll };
};

export default useConfirmation;
