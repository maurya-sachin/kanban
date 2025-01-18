import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { setView } from '../store/viewSlice';
import { Task } from '../types/tasks';
import ListView from './ListView/ListView';
// import BoardView from './BoardView';
import Filter from './Filter';

const TaskWrapper: React.FC = () => {
  const dispatch = useAppDispatch();
  const view = useAppSelector((state) => state.view.view); // Using custom selector hook for `view`
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
    // Add more initial tasks here...
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Filter view={view} setView={(view) => dispatch(setView(view))} />
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
            // <BoardView tasks={tasks} setTasks={setTasks} />
            <div>Board View</div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TaskWrapper;
