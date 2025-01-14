// src/store/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { auth, provider } from '../firebase';
import { signInWithPopup, signOut } from 'firebase/auth';

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
  return result.user as User; // Cast to User
});

// Async thunk for signing out
export const logOut = createAsyncThunk<void>('auth/logOut', async () => {
  await signOut(auth);
});

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
