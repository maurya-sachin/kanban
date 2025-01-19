// src/lib/taskStorage.ts
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  Timestamp,
  getDoc, // Added for single document retrieval
} from 'firebase/firestore';
import { db } from './firebase';
import supabase from '../supabase/supabaseClient';
import { Task } from '../types/tasks';

const STORAGE_BUCKET = 'kanban-doc';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Improved helper function with validation
async function uploadImageToSupabase(file: File, userId: string): Promise<string> {
  // Validate file size and type
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds 5MB limit');
  }
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed');
  }

  const fileExt = file.name.split('.').pop()?.toLowerCase();
  const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${STORAGE_BUCKET}/${fileName}`;

  // Removed unused 'data' from destructuring
  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);

  return publicUrl;
}

// Improved delete helper with proper error handling
async function deleteImageFromSupabase(imageUrl: string): Promise<void> {
  if (!imageUrl) return;

  try {
    // Extract the path after the bucket name
    const urlParts = imageUrl.split(`${STORAGE_BUCKET}/`);
    if (urlParts.length !== 2) return;

    const filePath = urlParts[1];
    const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([filePath]);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error('Failed to delete image from storage');
  }
}

// Improved task operations with better error handling and validation
export const addTask = async (uid: string, task: Task, files?: File[]): Promise<void> => {
  if (!uid || !task.id) {
    throw new Error('Invalid user ID or task ID');
  }

  try {
    const imageUrls: string[] = [];
    if (files?.length) {
      await Promise.all(
        files.map(async (file) => {
          try {
            const url = await uploadImageToSupabase(file, uid);
            imageUrls.push(url);
          } catch (error) {
            console.error(`Failed to upload image: ${file.name}`, error);
            // Continue with other files
          }
        })
      );
    }

    const taskRef = doc(collection(doc(db, 'users', uid), 'tasks'), task.id);
    await setDoc(taskRef, {
      ...task,
      imageUrls,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error adding task:', error);
    throw new Error('Failed to add task');
  }
};

export const updateTask = async (
  uid: string,
  taskId: string,
  updates: Partial<Task>,
  newFiles?: File[],
  deletedImageUrls?: string[]
): Promise<void> => {
  if (!uid || !taskId) {
    throw new Error('Invalid user ID or task ID');
  }

  const taskRef = doc(collection(doc(db, 'users', uid), 'tasks'), taskId);

  try {
    // Get existing task data
    const taskDoc = await getDoc(taskRef);
    if (!taskDoc.exists()) {
      throw new Error('Task not found');
    }

    const existingTask = taskDoc.data() as Task;

    // Handle image deletions
    if (deletedImageUrls?.length) {
      await Promise.all(deletedImageUrls.map(deleteImageFromSupabase));
    }

    // Handle new images
    const newImageUrls: string[] = [];
    if (newFiles?.length) {
      await Promise.all(
        newFiles.map(async (file) => {
          try {
            const url = await uploadImageToSupabase(file, uid);
            newImageUrls.push(url);
          } catch (error) {
            console.error(`Failed to upload image: ${file.name}`, error);
          }
        })
      );
    }

    // Update image URLs array
    const updatedImageUrls = [
      ...(existingTask.imageUrls || []).filter((url) => !deletedImageUrls?.includes(url)),
      ...newImageUrls,
    ];

    await updateDoc(taskRef, {
      ...updates,
      imageUrls: updatedImageUrls,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating task:', error);
    throw new Error('Failed to update task');
  }
};

// Rest of the code remains the same...

// Delete task with image handling
export const deleteTask = async (uid: string, taskId: string): Promise<void> => {
  try {
    // Get task data to find image URLs
    const taskRef = doc(collection(doc(db, 'users', uid), 'tasks'), taskId);
    const taskSnapshot = await getDocs(query(collection(taskRef.parent)));
    const task = taskSnapshot.docs.find((doc) => doc.id === taskId)?.data() as Task;

    // Delete images from Supabase
    if (task.imageUrls && task.imageUrls.length > 0) {
      await Promise.all(task.imageUrls.map((url) => deleteImageFromSupabase(url)));
    }

    // Delete task from Firebase
    await deleteDoc(taskRef);
    console.log('Task and associated images deleted successfully');
  } catch (error) {
    console.error('Error deleting task and images:', error);
    throw error;
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

// Fetch tasks based on filters
export const getFilteredTasks = async (
  uid: string,
  filters: {
    category?: string;
    dueDate?: string;
    searchQuery?: string;
  }
): Promise<Task[]> => {
  try {
    const tasksRef = collection(doc(db, 'users', uid), 'tasks');
    let taskQuery = query(tasksRef);

    // Filter by category
    if (filters.category && filters.category !== 'all') {
      taskQuery = query(taskQuery, where('category', '==', filters.category.toUpperCase()));
    }

    // Filter by due date
    if (filters.dueDate && filters.dueDate !== 'all') {
      const today = new Date();
      const startOfToday = Timestamp.fromDate(
        new Date(today.getFullYear(), today.getMonth(), today.getDate())
      );
      const startOfTomorrow = Timestamp.fromDate(
        new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
      );
      const endOfWeek = Timestamp.fromDate(
        new Date(today.getFullYear(), today.getMonth(), today.getDate() + (7 - today.getDay()))
      );

      if (filters.dueDate === 'today') {
        taskQuery = query(
          taskQuery,
          where('dueDate', '>=', startOfToday),
          where('dueDate', '<', startOfTomorrow)
        );
      } else if (filters.dueDate === 'tomorrow') {
        taskQuery = query(
          taskQuery,
          where('dueDate', '>=', startOfTomorrow),
          where('dueDate', '<', Timestamp.fromMillis(startOfTomorrow.toMillis() + 86400000))
        );
      } else if (filters.dueDate === 'this-week') {
        taskQuery = query(
          taskQuery,
          where('dueDate', '>=', startOfToday),
          where('dueDate', '<=', endOfWeek)
        );
      }
    }

    // Filter by search query
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      // Firestore doesn't support `contains` or full-text search out-of-the-box
      console.warn(
        'Search filtering should ideally be handled via a dedicated search index (like Algolia or Elasticsearch).'
      );
    }

    const snapshot = await getDocs(taskQuery);
    return snapshot.docs.map((doc) => doc.data() as Task);
  } catch (error) {
    console.error('Error fetching filtered tasks:', error);
    return [];
  }
};
