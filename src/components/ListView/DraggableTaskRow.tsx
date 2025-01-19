import { useDrag, useDrop } from 'react-dnd';
import type { Task } from '../types/tasks';
import TaskRow from './TaskRow';

interface DraggableTaskRowProps extends TaskRowProps {
  moveTask: (dragIndex: number, hoverIndex: number) => void;
  index: number;
}

const DraggableTaskRow: React.FC<DraggableTaskRowProps> = ({ task, index, moveTask, ...props }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id: task.id, index, status: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'TASK',
    hover: (item: { id: string; index: number; status: string }, monitor) => {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      moveTask(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const ref = useRef<HTMLDivElement>(null);
  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className={`${props.className} ${isOver ? 'border-purple-500' : ''}`}
    >
      <TaskRow {...props} task={task} />
    </div>
  );
};

export default DraggableTaskRow;
