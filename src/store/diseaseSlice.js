import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

// Async thunks for disease operations
export const fetchDiseases = createAsyncThunk('diseases/fetchDiseases', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/diseases');
    return response.data;
  } catch (error) {
    console.error('Error fetching diseases:', error);
    return rejectWithValue(error.message);
  }
});

export const addDisease = createAsyncThunk('diseases/addDisease', async (disease, { rejectWithValue }) => {
  try {
    const response = await api.post('/diseases', disease);
    return response.data;
  } catch (error) {
    console.error('Error adding disease:', error);
    return rejectWithValue(error.message);
  }
});

export const updateDisease = createAsyncThunk('diseases/updateDisease', async ({ id, updatedDisease }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/diseases/${id}`, updatedDisease);
    return response.data;
  } catch (error) {
    console.error('Error updating disease:', error);
    return rejectWithValue(error.message);
  }
});

export const deleteDisease = createAsyncThunk('diseases/deleteDisease', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/diseases/${id}`);
    return id;
  } catch (error) {
    console.error('Error deleting disease:', error);
    return rejectWithValue(error.message);
  }
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
      // Fetch Diseases
      .addCase(fetchDiseases.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDiseases.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.diseases = action.payload;
      })
      .addCase(fetchDiseases.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch diseases';
      })
      // Add Disease
      .addCase(addDisease.fulfilled, (state, action) => {
        state.diseases.push(action.payload);
      })
      .addCase(addDisease.rejected, (state, action) => {
        state.error = action.payload || 'Failed to add disease';
      })
      // Update Disease
      .addCase(updateDisease.fulfilled, (state, action) => {
        const index = state.diseases.findIndex((disease) => disease.id === action.payload.id);
        if (index !== -1) {
          state.diseases[index] = action.payload;
        }
      })
      .addCase(updateDisease.rejected, (state, action) => {
        state.error = action.payload || 'Failed to update disease';
      })
      // Delete Disease
      .addCase(deleteDisease.fulfilled, (state, action) => {
        state.diseases = state.diseases.filter((disease) => disease.id !== action.payload);
      })
      .addCase(deleteDisease.rejected, (state, action) => {
        state.error = action.payload || 'Failed to delete disease';
      });
  },
});

export default diseaseSlice.reducer;