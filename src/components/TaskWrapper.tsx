import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { Task } from '../types/tasks';
import ListView from './ListView/ListView';
// import BoardView from './BoardView';
import Filter from './Filter';
import { useAuth } from '../hooks/useAuth';
import { useView } from '../hooks/useView';

const TaskWrapper: React.FC = () => {
  const { user } = useAuth();
  const { view } = useView(user?.uid);
  const [tasks, setTasks] = React.useState<Task[]>([
    {
      id: '1',
      title: 'Interview with Design Team',
      dueDate: new Date().toISOString(),
      status: 'TO-DO',
      category: 'WORK',
    },
    {
      id: '2',
      title: 'Interview with Design Team',
      dueDate: new Date().toISOString(),
      status: 'IN-PROGRESS',
      category: 'WORK',
    },
    {
      id: '3',
      title: 'Interview with Design Team',
      dueDate: new Date().toISOString(),
      status: 'COMPLETED',
      category: 'WORK',
    },
    // More mock tasks can go here
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Filter />
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {view === 'list' ? (
            <ListView tasks={tasks} setTasks={setTasks} />
          ) : (
            // Future BoardView rendering
            <div>Board View</div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TaskWrapper;
