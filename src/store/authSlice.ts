// src/store/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { auth, provider, db } from '../firebase/firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore'; // Firestore methods

interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

// Async thunk for signing in
export const signIn = createAsyncThunk<User>('auth/signIn', async () => {
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  // Save user data to Firestore on sign in
  await saveUserData(user.uid, user.displayName, user.email, user.photoURL);

  return user as User; // Return user object
});

// Async thunk for signing out
export const logOut = createAsyncThunk<void>('auth/logOut', async () => {
  await signOut(auth);
});

// Function to save user data to Firestore
const saveUserData = async (
  uid: string,
  displayName: string | null,
  email: string | null,
  photoURL: string | null
) => {
  const userRef = doc(db, 'users', uid); // Reference to user document
  const userData = {
    displayName,
    email,
    photoURL,
  };

  try {
    const docSnapshot = await getDoc(userRef);
    if (!docSnapshot.exists()) {
      await setDoc(userRef, userData); // Save user data if document does not exist
    }
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to sign in';
      })
      .addCase(logOut.fulfilled, (state) => {
        state.user = null;
      });
  },
});

// Export the action to set user
export const { setUser } = authSlice.actions;

// Export the reducer
export default authSlice.reducer;
