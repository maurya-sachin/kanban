// src/components/ui/Dropdown.tsx
import React from 'react';
import { FaCheck } from 'react-icons/fa';

export interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
}

export interface DropdownItemProps {
  label: string;
  value: string;
  selected?: boolean;
  onClick?: () => void;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({ label, value, selected, onClick }) => (
  <button
    onClick={onClick}
    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 dark:text-gray-200 dark:hover:bg-gray-700"
  >
    <FaCheck className={`h-3 w-3 ${selected ? 'opacity-100' : 'opacity-0'}`} />
    {label}
  </button>
);

export const Dropdown: React.FC<DropdownProps> = ({ trigger, children }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10 z-10">
          <div className="py-1">{children}</div>
        </div>
      )}
    </div>
  );
};
