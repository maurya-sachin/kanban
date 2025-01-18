import React, { useState } from 'react';
import { Task } from '../../types/tasks';
import ListHeader from './ListHeader';
import TaskAccordion from './TaskAccordian';
import AddTaskRow from './AddTaskRow';
import { motion, AnimatePresence } from 'motion/react';
import TaskRow from './TaskRow';
import { Dropdown, DropdownItem } from '../../components/ui/Dropdown';
import { Button } from '../../components/ui/Button';

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

  const handleChangeStatus = (status: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (selectedTasks.includes(task.id) ? { ...task, status } : task))
    );
  };

  const handleDelete = () => {
    setTasks((prevTasks) => prevTasks.filter((task) => !selectedTasks.includes(task.id)));
    setSelectedTasks([]);
  };

  return (
    <div className="space-y-4">
      <ListHeader />

      {/* TODO Section */}
      <TaskAccordion
        title="Todo"
        count={todoTasks.length}
        isExpanded={expandedSections.TODO}
        onToggle={() => toggleSection('TODO')}
        accentColor="bg-indigo-200 dark:bg-indigo-800"
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
        accentColor="bg-teal-200 dark:bg-teal-800"
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
        accentColor="bg-lime-200 dark:bg-lime-800"
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

            {/* Dropdown for Change Status */}
            <Dropdown
              trigger={
                <Button variant="outline" className="px-3 py-1 rounded text-left">
                  Change Status
                </Button>
              }
            >
              <DropdownItem
                label="To Do"
                value="TO-DO"
                onClick={() => handleChangeStatus('TO-DO')}
              />
              <DropdownItem
                label="In Progress"
                value="IN-PROGRESS"
                onClick={() => handleChangeStatus('IN-PROGRESS')}
              />
              <DropdownItem
                label="Completed"
                value="COMPLETED"
                onClick={() => handleChangeStatus('COMPLETED')}
              />
            </Dropdown>

            {/* Delete Button */}
            <Button onClick={handleDelete} variant="ghost" className="text-red-500">
              Delete
            </Button>

            {/* Cancel Button */}
            <Button
              onClick={() => setSelectedTasks([])}
              variant="ghost"
              className="text-gray-500 dark:text-gray-300"
            >
              Cancel
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ListView;
