// src/types/task.ts
export type TaskStatus = 'TO-DO' | 'IN-PROGRESS' | 'COMPLETED';
export type TaskCategory = 'WORK' | 'PERSONAL';

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  status: TaskStatus;
  category: TaskCategory;
}

export interface TaskGroup {
  status: TaskStatus;
  tasks: Task[];
}
