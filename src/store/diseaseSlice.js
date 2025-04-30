import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

// Async thunks for disease operations
export const fetchDiseases = createAsyncThunk('diseases/fetchDiseases', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/diseases');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message || 'Failed to fetch diseases');
  }
});

export const addDisease = createAsyncThunk('diseases/addDisease', async (disease, { rejectWithValue }) => {
  try {
    const response = await api.post('/diseases', disease);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message || 'Failed to add disease');
  }
});

export const updateDisease = createAsyncThunk('diseases/updateDisease', async ({ id, updatedDisease }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/diseases/${id}`, updatedDisease);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message || 'Failed to update disease');
  }
});

export const deleteDisease = createAsyncThunk('diseases/deleteDisease', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/diseases/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message || 'Failed to delete disease');
  }
});

const diseaseSlice = createSlice({
  name: 'diseases',
  initialState: {
    diseases: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Diseases
      .addCase(fetchDiseases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDiseases.fulfilled, (state, action) => {
        state.loading = false;
        state.diseases = action.payload;
      })
      .addCase(fetchDiseases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Disease
      .addCase(addDisease.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addDisease.fulfilled, (state, action) => {
        state.loading = false;
        state.diseases.push(action.payload);
      })
      .addCase(addDisease.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Disease
      .addCase(updateDisease.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDisease.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.diseases.findIndex((disease) => disease.id === action.payload.id);
        if (index !== -1) {
          state.diseases[index] = action.payload;
        }
      })
      .addCase(updateDisease.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Disease
      .addCase(deleteDisease.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDisease.fulfilled, (state, action) => {
        state.loading = false;
        state.diseases = state.diseases.filter((disease) => disease.id !== action.payload);
      })
      .addCase(deleteDisease.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default diseaseSlice.reducer;