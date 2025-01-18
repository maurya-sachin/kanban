// src/components/ListView/ListView.tsx
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
  const [expandedSection, setExpandedSection] = useState<
    'TODO' | 'IN-PROGRESS' | 'COMPLETED' | null
  >('TODO');

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
        isExpanded={expandedSection === 'TODO'}
        onToggle={() => setExpandedSection(expandedSection === 'TODO' ? null : 'TODO')}
        accentColor="bg-pink-100"
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
        isExpanded={expandedSection === 'IN-PROGRESS'}
        onToggle={() =>
          setExpandedSection(expandedSection === 'IN-PROGRESS' ? null : 'IN-PROGRESS')
        }
        accentColor="bg-blue-100"
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
        isExpanded={expandedSection === 'COMPLETED'}
        onToggle={() => setExpandedSection(expandedSection === 'COMPLETED' ? null : 'COMPLETED')}
        accentColor="bg-green-100"
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
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg px-6 py-3 flex items-center space-x-4"
          >
            <span>{selectedTasks.length} tasks selected</span>
            <select className="px-3 py-1 rounded border">
              <option value="">Change Status</option>
              <option value="TO-DO">To Do</option>
              <option value="IN-PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
            <button className="text-red-500">Delete</button>
            <button className="text-gray-500" onClick={() => setSelectedTasks([])}>
              Cancel
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ListView;
