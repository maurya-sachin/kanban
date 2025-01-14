// src/firebase/themeStorage.ts
import { doc, setDoc, getDoc, updateDoc, collection } from 'firebase/firestore';
import { db } from './firebase';

// Save user theme to Firestore
export const saveUserTheme = async (uid: string, theme: 'light' | 'dark') => {
  const userRef = doc(db, 'users', uid); // Reference to user document
  const settingsRef = collection(userRef, 'settings');
  const docRef = doc(settingsRef, 'theme'); // Store theme as a document inside 'settings'

  try {
    // Check if theme document exists
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      // If it exists, update the theme
      await updateDoc(docRef, { theme });
    } else {
      // If it doesn't exist, create it with the theme
      await setDoc(docRef, { theme });
    }
    console.log('User  theme saved successfully');
  } catch (error) {
    console.error('Error saving theme:', error);
  }
};

// Retrieve user theme from Firestore
export const getUserTheme = async (uid: string) => {
  const userRef = doc(db, 'users', uid);
  const settingsRef = collection(userRef, 'settings');
  const docRef = doc(settingsRef, 'theme');

  try {
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      return docSnapshot.data().theme; // Return the theme
    } else {
      return null; // No theme found
    }
  } catch (error) {
    console.error('Error retrieving theme:', error);
    return null; // Return null on error
  }
};
