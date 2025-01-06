import { useState, useRef, useCallback } from 'react';

const useDropdown = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = useCallback(() => {
    setDropdownOpen(prev => !prev);
  }, []);

  return { dropdownOpen, toggleDropdown, dropdownRef };
};

export default useDropdown;
