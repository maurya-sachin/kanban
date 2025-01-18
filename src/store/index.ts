// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import viewReducer from './viewSlice';

const store = configureStore({
  reducer: {
    view: viewReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
