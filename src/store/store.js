import { configureStore } from '@reduxjs/toolkit';
import areaReducer from './areaSlice';
import authReducer from './authSlice';
import diseaseReducer from './diseaseSlice';
import diseaseCaseReducer from './diseaseCaseSlice'
import userReducer from './userSlice';

const store = configureStore({
  reducer: {
    areas: areaReducer,
    auth: authReducer,
    diseases: diseaseReducer,
    users: userReducer,
    diseaseCases: diseaseCaseReducer
  },
});

export default store;