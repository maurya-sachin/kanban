// src/components/ui/Input.tsx
import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input: React.FC<InputProps> = ({ className = '', ...props }) => {
  return (
    <div className="relative flex-1">
      <input
        type="text"
        className={`px-3 py-1 border rounded focus:ring-2 focus:ring-purple-500 outline-none  bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10 ${className}`}
        {...props}
      />
    </div>
  );
};
