// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import animationsReducer from './animationsSlice';

export const store = configureStore({
  reducer: {
    animations: animationsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
