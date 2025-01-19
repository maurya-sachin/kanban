import React, { useMemo, useState } from 'react';
import ListHeader from './ListHeader';
import TaskAccordion from './TaskAccordian';
import AddTaskRow from './AddTaskRow';
import { motion, AnimatePresence } from 'framer-motion';
import TaskRow from './TaskRow';
import { Dropdown, DropdownItem } from '../../components/ui/Dropdown';
import { Button } from '../../components/ui/Button';
import { useTasks } from '../../hooks/useTask';
import { TaskStatus } from '../../types/tasks';

interface ListViewProps {
  uid: string;
  filters: { category: string; dueDate: string; searchQuery: string };
}

const ListView: React.FC<ListViewProps> = ({ uid, filters }) => {
  const {
    todoTasks,
    inProgressTasks,
    completedTasks,
    updateTask,
    deleteTask,
    bulkUpdateTasks,
    bulkDeleteTasks,
    isLoading,
  } = useTasks(uid);

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

  const handleChangeStatus = (status: TaskStatus) => {
    bulkUpdateTasks({ taskIds: selectedTasks, updates: { status } });
    setSelectedTasks([]);
  };

  const handleDelete = async () => {
    bulkDeleteTasks(selectedTasks);
    setSelectedTasks([]);
  };

  const filteredTasks = useMemo(() => {
    let tasks = [...todoTasks, ...inProgressTasks, ...completedTasks];

    // Filter by category
    if (filters.category !== 'all') {
      tasks = tasks.filter((task) => {
        const normalizedTaskCategory = task.category?.toLowerCase() || '';
        const normalizedFilterCategory = filters.category.toLowerCase();
        return normalizedTaskCategory === normalizedFilterCategory; // Compare lowercased values
      });
    }

    // Filter by due date
    if (filters.dueDate === 'today') {
      tasks = tasks.filter(
        (task) => new Date(task.dueDate || '').toDateString() === new Date().toDateString()
      );
    } else if (filters.dueDate === 'this-week') {
      const currentDate = new Date();
      const dayOfWeek = currentDate.getDay(); // 0 (Sunday) to 6 (Saturday)

      // Start of the week: subtracted the day of the week value and got the previous Sunday.
      const weekStart = new Date(currentDate);
      weekStart.setDate(currentDate.getDate() - dayOfWeek);
      weekStart.setHours(0, 0, 0, 0); // Reset to midnight

      // End of the week: Added the days left until Saturday
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999); // End of the day

      tasks = tasks.filter((task) => {
        const taskDueDate = task.dueDate ? new Date(task.dueDate) : null;
        return taskDueDate && taskDueDate >= weekStart && taskDueDate <= weekEnd;
      });
    }

    if (filters.searchQuery) {
      tasks = tasks.filter((task) =>
        task.title.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }

    return tasks;
  }, [todoTasks, inProgressTasks, completedTasks, filters]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <ListHeader />

      {/* TODO Section */}
      <TaskAccordion
        title="Todo"
        // count={todoTasks.length}
        count={filteredTasks.filter((task) => task.status === 'TO-DO').length}
        isExpanded={expandedSections.TODO}
        onToggle={() => toggleSection('TODO')}
        accentColor="bg-indigo-200 dark:bg-indigo-800"
      >
        <AddTaskRow uid={uid} />
        {filteredTasks
          .filter((task) => task.status === 'TO-DO')
          .map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              selected={selectedTasks.includes(task.id)}
              onSelect={(id) => {
                setSelectedTasks((prev) =>
                  prev.includes(id) ? prev.filter((taskId) => taskId !== id) : [...prev, id]
                );
              }}
              onUpdateTask={(updates) => updateTask({ taskId: task.id, updates })}
              onDeleteTask={() => deleteTask(task.id)}
            />
          ))}
      </TaskAccordion>

      {/* IN-PROGRESS Section */}
      <TaskAccordion
        title="In-Progress"
        count={filteredTasks.filter((task) => task.status === 'IN-PROGRESS').length}
        isExpanded={expandedSections['IN-PROGRESS']}
        onToggle={() => toggleSection('IN-PROGRESS')}
        accentColor="bg-teal-200 dark:bg-teal-800"
      >
        {filteredTasks
          .filter((task) => task.status === 'IN-PROGRESS')
          .map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              selected={selectedTasks.includes(task.id)}
              onSelect={(id) => {
                setSelectedTasks((prev) =>
                  prev.includes(id) ? prev.filter((taskId) => taskId !== id) : [...prev, id]
                );
              }}
              onUpdateTask={(updates) => updateTask({ taskId: task.id, updates })}
              onDeleteTask={() => deleteTask(task.id)}
            />
          ))}
      </TaskAccordion>

      {/* COMPLETED Section */}
      <TaskAccordion
        title="Completed"
        count={filteredTasks.filter((task) => task.status === 'COMPLETED').length}
        isExpanded={expandedSections.COMPLETED}
        onToggle={() => toggleSection('COMPLETED')}
        accentColor="bg-lime-200 dark:bg-lime-800"
      >
        {filteredTasks
          .filter((task) => task.status === 'COMPLETED')
          .map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              selected={selectedTasks.includes(task.id)}
              onSelect={(id) => {
                setSelectedTasks((prev) =>
                  prev.includes(id) ? prev.filter((taskId) => taskId !== id) : [...prev, id]
                );
              }}
              onUpdateTask={(updates) => updateTask({ taskId: task.id, updates })}
              onDeleteTask={() => deleteTask(task.id)}
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

            <Button onClick={handleDelete} variant="ghost" className="text-red-500">
              Delete
            </Button>

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
