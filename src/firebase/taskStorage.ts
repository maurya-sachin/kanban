import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { Task } from '../types/tasks';

// Add a new task to Firestore
export const addTask = async (uid: string, task: Task): Promise<void> => {
  try {
    const taskRef = doc(collection(doc(db, 'users', uid), 'tasks'), task.id);
    await setDoc(taskRef, task);
    console.log('Task added successfully');
  } catch (error) {
    console.error('Error adding task:', error);
  }
};

// Retrieve all tasks for a user from Firestore
export const getTasks = async (uid: string): Promise<Task[]> => {
  try {
    const tasksRef = collection(doc(db, 'users', uid), 'tasks');
    const snapshot = await getDocs(tasksRef);
    return snapshot.docs.map((doc) => doc.data() as Task);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
};

// Update a task's fields
export const updateTask = async (
  uid: string,
  taskId: string,
  updates: Partial<Task>
): Promise<void> => {
  try {
    const taskRef = doc(collection(doc(db, 'users', uid), 'tasks'), taskId);
    await updateDoc(taskRef, updates);
    console.log('Task updated successfully');
  } catch (error) {
    console.error('Error updating task:', error);
  }
};

// Delete a task from Firestore
export const deleteTask = async (uid: string, taskId: string): Promise<void> => {
  try {
    const taskRef = doc(collection(doc(db, 'users', uid), 'tasks'), taskId);
    await deleteDoc(taskRef);
    console.log('Task deleted successfully');
  } catch (error) {
    console.error('Error deleting task:', error);
  }
};

// Fetch tasks by status
export const getTasksByStatus = async (uid: string, status: string): Promise<Task[]> => {
  try {
    const tasksRef = collection(doc(db, 'users', uid), 'tasks');
    const q = query(tasksRef, where('status', '==', status));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data() as Task);
  } catch (error) {
    console.error('Error fetching tasks by status:', error);
    return [];
  }
};
