import React, { useState } from 'react';
import { Task } from '../../types/tasks';
import ListHeader from './ListHeader';
import TaskAccordion from './TaskAccordian';
import AddTaskRow from './AddTaskRow';
import { motion, AnimatePresence } from 'motion/react';
import TaskRow from './TaskRow';

interface ListViewProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const ListView: React.FC<ListViewProps> = ({ tasks, setTasks }) => {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    TODO: true,
    'IN-PROGRESS': false,
    COMPLETED: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const todoTasks = tasks.filter((task) => task.status === 'TO-DO');
  const inProgressTasks = tasks.filter((task) => task.status === 'IN-PROGRESS');
  const completedTasks = tasks.filter((task) => task.status === 'COMPLETED');

  return (
    <div className="space-y-4">
      <ListHeader />

      {/* TODO Section */}
      <TaskAccordion
        title="Todo"
        count={todoTasks.length}
        isExpanded={expandedSections.TODO}
        onToggle={() => toggleSection('TODO')}
        accentColor="bg-pink-100 dark:bg-pink-900"
      >
        <AddTaskRow setTasks={setTasks} />
        {todoTasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            selected={selectedTasks.includes(task.id)}
            onSelect={(id) => {
              setSelectedTasks((prev) =>
                prev.includes(id) ? prev.filter((taskId) => taskId !== id) : [...prev, id]
              );
            }}
            setTasks={setTasks}
          />
        ))}
      </TaskAccordion>

      {/* IN-PROGRESS Section */}
      <TaskAccordion
        title="In-Progress"
        count={inProgressTasks.length}
        isExpanded={expandedSections['IN-PROGRESS']}
        onToggle={() => toggleSection('IN-PROGRESS')}
        accentColor="bg-blue-100 dark:bg-blue-900"
      >
        {inProgressTasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            selected={selectedTasks.includes(task.id)}
            onSelect={(id) => {
              setSelectedTasks((prev) =>
                prev.includes(id) ? prev.filter((taskId) => taskId !== id) : [...prev, id]
              );
            }}
            setTasks={setTasks}
          />
        ))}
      </TaskAccordion>

      {/* COMPLETED Section */}
      <TaskAccordion
        title="Completed"
        count={completedTasks.length}
        isExpanded={expandedSections.COMPLETED}
        onToggle={() => toggleSection('COMPLETED')}
        accentColor="bg-green-100 dark:bg-green-900"
      >
        {completedTasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            selected={selectedTasks.includes(task.id)}
            onSelect={(id) => {
              setSelectedTasks((prev) =>
                prev.includes(id) ? prev.filter((taskId) => taskId !== id) : [...prev, id]
              );
            }}
            setTasks={setTasks}
          />
        ))}
      </TaskAccordion>

      {/* Multi-select Action Bar */}
      <AnimatePresence>
        {selectedTasks.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 shadow-lg rounded-lg px-6 py-3 flex items-center space-x-4"
          >
            <span>{selectedTasks.length} tasks selected</span>
            <select className="px-3 py-1 rounded border dark:bg-gray-700 dark:text-gray-300">
              <option value="">Change Status</option>
              <option value="TO-DO">To Do</option>
              <option value="IN-PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
            <button className="text-red-500">Delete</button>
            <button
              className="text-gray-500 dark:text-gray-300"
              onClick={() => setSelectedTasks([])}
            >
              Cancel
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ListView;
