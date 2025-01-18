import React, { useState } from 'react';
import { Task } from '../../types/tasks';
import { format } from 'date-fns';
import { FaEllipsisV, FaCheckCircle, FaClipboardList, FaTasks } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import { Dropdown, DropdownItem } from '../ui/Dropdown';
import { Button } from '../ui/Button';
import 'react-datepicker/dist/react-datepicker.css';
import { Input } from '../ui/Input';

interface TaskRowProps {
  task: Task;
  selected: boolean;
  onSelect: (id: string) => void;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const STATUS_OPTIONS = [
  { id: 'TO-DO', name: 'To Do', icon: <FaClipboardList className="text-gray-500" /> },
  { id: 'IN-PROGRESS', name: 'In Progress', icon: <FaCheckCircle className="text-blue-500" /> },
  { id: 'COMPLETED', name: 'Completed', icon: <FaCheckCircle className="text-green-500" /> },
] as const;

const CATEGORY_OPTIONS = [
  { id: 'WORK', name: 'Work', icon: <FaTasks className="text-gray-500" /> },
  { id: 'PERSONAL', name: 'Personal', icon: <FaTasks className="text-purple-500" /> },
] as const;

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
        return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'IN-PROGRESS':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200';
      default:
        return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div
      className={`grid grid-cols-5 gap-4 px-4 py-3 border-b dark:border-gray-700 ${
        selected ? 'bg-purple-50 dark:bg-purple-900' : 'bg-white dark:bg-gray-800'
      } hover:bg-gray-50 dark:hover:bg-gray-700`}
    >
      {/* Checkbox and Title */}
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(task.id)}
          className="w-4 h-4 rounded border-gray-300 text-purple-600 dark:border-gray-600"
        />
        {isEditing ? (
          <Input
            value={editedTask.title}
            onChange={(e) => setEditedTask((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Task Title"
          />
        ) : (
          <span className={task.status === 'COMPLETED' ? 'line-through text-gray-500' : ''}>
            {task.title}
          </span>
        )}
      </div>

      {/* Due Date */}
      <div>
        {isEditing ? (
          <DatePicker
            selected={new Date(editedTask.dueDate)}
            onChange={(date) =>
              setEditedTask((prev) => ({
                ...prev,
                dueDate: date ? date.toISOString().split('T')[0] : '',
              }))
            }
            dateFormat="yyyy-MM-dd"
            placeholderText="Select date"
            className="px-3 py-1 border rounded focus:ring-2 focus:ring-purple-500 outline-none w-full  bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10"
          />
        ) : (
          <span>{format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
        )}
      </div>

      {/* Status Dropdown */}
      <div>
        {isEditing ? (
          <Dropdown
            trigger={
              <Button variant="outline" className="w-full text-left">
                {STATUS_OPTIONS.find((option) => option.id === editedTask.status)?.name}
              </Button>
            }
          >
            {STATUS_OPTIONS.map((option) => (
              <DropdownItem
                key={option.id}
                label={option.name}
                value={option.id}
                selected={option.id === editedTask.status}
                onClick={() => setEditedTask((prev) => ({ ...prev, status: option.id }))}
                icon={option.icon}
              />
            ))}
          </Dropdown>
        ) : (
          <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(task.status)}`}>
            {STATUS_OPTIONS.find((option) => option.id === task.status)?.name}
          </span>
        )}
      </div>

      {/* Category Dropdown */}
      <div>
        {isEditing ? (
          <Dropdown
            trigger={
              <Button variant="outline" className="w-full text-left">
                {CATEGORY_OPTIONS.find((option) => option.id === editedTask.category)?.name}
              </Button>
            }
          >
            {CATEGORY_OPTIONS.map((option) => (
              <DropdownItem
                key={option.id}
                label={option.name}
                value={option.id}
                selected={option.id === editedTask.category}
                onClick={() => setEditedTask((prev) => ({ ...prev, category: option.id }))}
                icon={option.icon}
              />
            ))}
          </Dropdown>
        ) : (
          <span className="text-gray-600 dark:text-gray-400">
            {CATEGORY_OPTIONS.find((option) => option.id === task.category)?.name}
          </span>
        )}
      </div>

      {/* Actions with Dropdown */}
      <div className="relative">
        {isEditing ? (
          <div className="flex space-x-2">
            <Button onClick={handleSave} variant="default">
              Save
            </Button>
            <Button onClick={() => setIsEditing(false)} variant="secondary">
              Cancel
            </Button>
          </div>
        ) : (
          <Dropdown
            trigger={
              <Button
                onClick={() => setShowMenu(!showMenu)}
                variant="ghost"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FaEllipsisV className="text-gray-500 dark:text-gray-400" />
              </Button>
            }
          >
            <DropdownItem value="Edit" label="Edit" onClick={() => setIsEditing(true)} />
            <DropdownItem
              value="Delete"
              label="Delete"
              onClick={handleDelete}
              className="text-red-600 dark:text-red-400"
            />
          </Dropdown>
        )}
      </div>
    </div>
  );
};

export default TaskRow;
