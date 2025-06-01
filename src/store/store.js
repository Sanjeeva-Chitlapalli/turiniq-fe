import { configureStore } from '@reduxjs/toolkit';
import businessReducer from './businessSlice';

export const store = configureStore({
  reducer: {
    business: businessReducer,
  },
});