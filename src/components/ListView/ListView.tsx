import React, { useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDrop } from 'react-dnd';
import ListHeader from './ListHeader';
import TaskAccordion from './TaskAccordian';
import AddTaskRow from './AddTaskRow';
import DraggableTaskRow from './DraggableTaskRow'; // Use the new draggable component
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

  // Create drop targets for each section
  const [, todoDropRef] = useDrop({
    accept: 'TASK',
    drop: (item: { id: string; status: TaskStatus }) => {
      if (item.status !== 'TO-DO') {
        updateTask({
          taskId: item.id,
          updates: { status: 'TO-DO' },
        });
      }
    },
  });

  const [, inProgressDropRef] = useDrop({
    accept: 'TASK',
    drop: (item: { id: string; status: TaskStatus }) => {
      if (item.status !== 'IN-PROGRESS') {
        updateTask({
          taskId: item.id,
          updates: { status: 'IN-PROGRESS' },
        });
      }
    },
  });

  const [, completedDropRef] = useDrop({
    accept: 'TASK',
    drop: (item: { id: string; status: TaskStatus }) => {
      if (item.status !== 'COMPLETED') {
        updateTask({
          taskId: item.id,
          updates: { status: 'COMPLETED' },
        });
      }
    },
  });

  const moveTask = useCallback((dragIndex: number, hoverIndex: number, status: TaskStatus) => {
    // Implement task reordering logic here if needed
    // This would require adding an 'order' field to your tasks
  }, []);

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

    if (filters.category !== 'all') {
      tasks = tasks.filter(
        (task) => task.category?.toLowerCase() === filters.category.toLowerCase()
      );
    }

    if (filters.dueDate === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      tasks = tasks.filter((task) => {
        const taskDate = new Date(task.dueDate || '');
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === today.getTime();
      });
    } else if (filters.dueDate === 'this-week') {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      tasks = tasks.filter((task) => {
        const taskDate = task.dueDate ? new Date(task.dueDate) : null;
        return taskDate && taskDate >= startOfWeek && taskDate <= endOfWeek;
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
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ListHeader />

      {/* TODO Section */}
      <div ref={todoDropRef}>
        <TaskAccordion
          title="Todo"
          count={filteredTasks.filter((task) => task.status === 'TO-DO').length}
          isExpanded={expandedSections.TODO}
          onToggle={() => toggleSection('TODO')}
          accentColor="bg-indigo-200 dark:bg-indigo-800"
        >
          <AddTaskRow uid={uid} />
          {filteredTasks
            .filter((task) => task.status === 'TO-DO')
            .map((task, index) => (
              <DraggableTaskRow
                key={task.id}
                task={task}
                index={index}
                moveTask={(dragIndex, hoverIndex) => moveTask(dragIndex, hoverIndex, 'TO-DO')}
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
      </div>

      {/* IN-PROGRESS Section */}
      <div ref={inProgressDropRef}>
        <TaskAccordion
          title="In-Progress"
          count={filteredTasks.filter((task) => task.status === 'IN-PROGRESS').length}
          isExpanded={expandedSections['IN-PROGRESS']}
          onToggle={() => toggleSection('IN-PROGRESS')}
          accentColor="bg-teal-200 dark:bg-teal-800"
        >
          {filteredTasks
            .filter((task) => task.status === 'IN-PROGRESS')
            .map((task, index) => (
              <DraggableTaskRow
                key={task.id}
                task={task}
                index={index}
                moveTask={(dragIndex, hoverIndex) => moveTask(dragIndex, hoverIndex, 'IN-PROGRESS')}
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
      </div>

      {/* COMPLETED Section */}
      <div ref={completedDropRef}>
        <TaskAccordion
          title="Completed"
          count={filteredTasks.filter((task) => task.status === 'COMPLETED').length}
          isExpanded={expandedSections.COMPLETED}
          onToggle={() => toggleSection('COMPLETED')}
          accentColor="bg-lime-200 dark:bg-lime-800"
        >
          {filteredTasks
            .filter((task) => task.status === 'COMPLETED')
            .map((task, index) => (
              <DraggableTaskRow
                key={task.id}
                task={task}
                index={index}
                moveTask={(dragIndex, hoverIndex) => moveTask(dragIndex, hoverIndex, 'COMPLETED')}
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
      </div>

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
