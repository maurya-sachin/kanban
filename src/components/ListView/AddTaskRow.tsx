// src/components/ListView/AddTaskRow.tsx
import React, { useState } from 'react';
import { Task } from '../../types/tasks';
import { motion } from 'motion/react';
import { FaPlus } from 'react-icons/fa';

interface AddTaskRowProps {
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const AddTaskRow: React.FC<AddTaskRowProps> = ({ setTasks }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    dueDate: '',
    status: 'TO-DO' as const,
    category: 'WORK' as const,
  });

  const handleSubmit = () => {
    if (!newTask.title) return;

    setTasks((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        ...newTask,
      },
    ]);

    setNewTask({
      title: '',
      dueDate: '',
      status: 'TO-DO',
      category: 'WORK',
    });
    setIsAdding(false);
  };

  return (
    <div className="border-b py-2">
      {!isAdding ? (
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center space-x-2 text-purple-600 px-4 py-2"
        >
          <FaPlus className="text-sm" />
          <span>ADD TASK</span>
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-5 gap-4 px-4 py-2"
        >
          <input
            type="text"
            placeholder="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask((prev) => ({ ...prev, title: e.target.value }))}
            className="px-3 py-1 border rounded focus:ring-2 focus:ring-purple-500 outline-none"
          />
          <input
            type="date"
            value={newTask.dueDate}
            onChange={(e) => setNewTask((prev) => ({ ...prev, dueDate: e.target.value }))}
            className="px-3 py-1 border rounded"
          />
          <select
            value={newTask.status}
            onChange={(e) =>
              setNewTask((prev) => ({ ...prev, status: e.target.value as Task['status'] }))
            }
            className="px-3 py-1 border rounded"
          >
            <option value="TO-DO">To Do</option>
            <option value="IN-PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <select
            value={newTask.category}
            onChange={(e) =>
              setNewTask((prev) => ({ ...prev, category: e.target.value as Task['category'] }))
            }
            className="px-3 py-1 border rounded"
          >
            <option value="WORK">Work</option>
            <option value="PERSONAL">Personal</option>
          </select>
          <div className="flex space-x-2">
            <button
              onClick={handleSubmit}
              className="px-4 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Add
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AddTaskRow;
