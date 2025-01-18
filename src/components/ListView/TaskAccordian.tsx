// src/components/ListView/TaskAccordion.tsx
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface TaskAccordionProps {
  title: string;
  count: number;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  accentColor: string;
}

const TaskAccordion: React.FC<TaskAccordionProps> = ({
  title,
  count,
  isExpanded,
  onToggle,
  children,
  accentColor,
}) => {
  return (
    <div className={`border rounded-lg ${accentColor}`}>
      <button onClick={onToggle} className="w-full px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="font-medium">{title}</span>
          <span className="text-sm text-gray-500">({count})</span>
        </div>
        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden bg-white"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskAccordion;
