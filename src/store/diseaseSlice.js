import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchDiseases = createAsyncThunk('diseases/fetchDiseases', async () => {
  const response = await axios.get('http://localhost:5000/diseases');
  return response.data;
});

export const addDisease = createAsyncThunk('diseases/addDisease', async (disease) => {
  const response = await axios.post('http://localhost:5000/diseases', disease);
  return response.data;
});

export const updateDisease = createAsyncThunk('diseases/updateDisease', async ({ id, updatedDisease }) => {
  const response = await axios.put(`http://localhost:5000/diseases/${id}`, updatedDisease);
  return response.data;
});

export const deleteDisease = createAsyncThunk('diseases/deleteDisease', async (id) => {
  await axios.delete(`http://localhost:5000/diseases/${id}`);
  return id;
});

const diseaseSlice = createSlice({
  name: 'diseases',
  initialState: {
    diseases: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiseases.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDiseases.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.diseases = action.payload;
      })
      .addCase(fetchDiseases.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addDisease.fulfilled, (state, action) => {
        state.diseases.push(action.payload);
      })
      .addCase(updateDisease.fulfilled, (state, action) => {
        const index = state.diseases.findIndex((d) => d.id === action.payload.id);
        if (index !== -1) {
          state.diseases[index] = action.payload;
        }
      })
      .addCase(deleteDisease.fulfilled, (state, action) => {
        state.diseases = state.diseases.filter((d) => d.id !== action.payload);
      });
  },
});

export default diseaseSlice.reducer;