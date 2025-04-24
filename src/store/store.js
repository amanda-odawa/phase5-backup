import { configureStore } from '@reduxjs/toolkit';
import diseaseReducer from './diseaseSlice';
import areaReducer from './areaSlice';
import authReducer from './authSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    diseases: diseaseReducer,
    areas: areaReducer,
    auth: authReducer,
    users: userReducer,
  },
});