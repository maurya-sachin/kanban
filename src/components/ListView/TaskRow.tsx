// src/components/ListView/TaskRow.tsx
import React, { useState } from 'react';
import { Task } from '../../types/tasks';
import { format } from 'date-fns';
import { FaEllipsisV } from 'react-icons/fa';
import { motion, AnimatePresence } from 'motion/react';

interface TaskRowProps {
  task: Task;
  selected: boolean;
  onSelect: (id: string) => void;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TaskRow: React.FC<TaskRowProps> = ({ task, selected, onSelect, setTasks }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const handleSave = () => {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? editedTask : t)));
    setIsEditing(false);
  };

  const handleDelete = () => {
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'TO-DO':
        return 'bg-gray-200 text-gray-800';
      case 'IN-PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div
      className={`grid grid-cols-5 gap-4 px-4 py-3 border-b ${selected ? 'bg-purple-50' : 'bg-white'} hover:bg-gray-50`}
    >
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(task.id)}
          className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
        />
        {isEditing ? (
          <input
            type="text"
            value={editedTask.title}
            onChange={(e) => setEditedTask((prev) => ({ ...prev, title: e.target.value }))}
            className="px-2 py-1 border rounded"
          />
        ) : (
          <span className={task.status === 'COMPLETED' ? 'line-through text-gray-500' : ''}>
            {task.title}
          </span>
        )}
      </div>

      <div>
        {isEditing ? (
          <input
            type="date"
            value={editedTask.dueDate}
            onChange={(e) => setEditedTask((prev) => ({ ...prev, dueDate: e.target.value }))}
            className="px-2 py-1 border rounded"
          />
        ) : (
          <span>{format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
        )}
      </div>

      <div>
        {isEditing ? (
          <select
            value={editedTask.status}
            onChange={(e) =>
              setEditedTask((prev) => ({ ...prev, status: e.target.value as Task['status'] }))
            }
            className="px-2 py-1 border rounded"
          >
            <option value="TO-DO">To Do</option>
            <option value="IN-PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        ) : (
          <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(task.status)}`}>
            {task.status}
          </span>
        )}
      </div>

      <div>
        {isEditing ? (
          <select
            value={editedTask.category}
            onChange={(e) =>
              setEditedTask((prev) => ({ ...prev, category: e.target.value as Task['category'] }))
            }
            className="px-2 py-1 border rounded"
          >
            <option value="WORK">Work</option>
            <option value="PERSONAL">Personal</option>
          </select>
        ) : (
          <span className="text-gray-600">{task.category}</span>
        )}
      </div>

      <div className="relative">
        {isEditing ? (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditedTask(task);
              }}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <FaEllipsisV className="text-gray-500" />
            </button>

            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10"
                >
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskRow;
