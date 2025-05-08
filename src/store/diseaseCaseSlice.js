// store/diseaseCaseSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const fetchDiseaseCases = createAsyncThunk(
  'diseaseCases/fetchDiseaseCases',
  async () => {
    const response = await api.get('/diseaseCase');
    return response.data;
  }
);

const diseaseCaseSlice = createSlice({
  name: 'diseaseCases',
  initialState: {
    cases: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiseaseCases.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDiseaseCases.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cases = action.payload;
      })
      .addCase(fetchDiseaseCases.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default diseaseCaseSlice.reducer;
