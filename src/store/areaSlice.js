import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

// Async thunks for area operations
export const fetchAreas = createAsyncThunk('areas/fetchAreas', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/areas');
    return response.data;
  } catch (error) {
    console.error('Error fetching areas:', error);
    return rejectWithValue(error.message);
  }
});

export const addArea = createAsyncThunk('areas/addArea', async (area, { rejectWithValue }) => {
  try {
    const response = await api.post('/areas', area);
    return response.data;
  } catch (error) {
    console.error('Error adding area:', error);
    return rejectWithValue(error.message);
  }
});

export const updateArea = createAsyncThunk('areas/updateArea', async ({ id, updatedArea }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/areas/${id}`, updatedArea);
    return response.data;
  } catch (error) {
    console.error('Error updating area:', error);
    return rejectWithValue(error.message);
  }
});

export const deleteArea = createAsyncThunk('areas/deleteArea', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/areas/${id}`);
    return id;
  } catch (error) {
    console.error('Error deleting area:', error);
    return rejectWithValue(error.message);
  }
});

const areaSlice = createSlice({
  name: 'areas',
  initialState: {
    areas: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Areas
      .addCase(fetchAreas.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAreas.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.areas = action.payload;
      })
      .addCase(fetchAreas.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch areas';
      })
      // Add Area
      .addCase(addArea.fulfilled, (state, action) => {
        state.areas.push(action.payload);
      })
      .addCase(addArea.rejected, (state, action) => {
        state.error = action.payload || 'Failed to add area';
      })
      // Update Area
      .addCase(updateArea.fulfilled, (state, action) => {
        const index = state.areas.findIndex((area) => area.id === action.payload.id);
        if (index !== -1) {
          state.areas[index] = action.payload;
        }
      })
      .addCase(updateArea.rejected, (state, action) => {
        state.error = action.payload || 'Failed to update area';
      })
      // Delete Area
      .addCase(deleteArea.fulfilled, (state, action) => {
        state.areas = state.areas.filter((area) => area.id !== action.payload);
      })
      .addCase(deleteArea.rejected, (state, action) => {
        state.error = action.payload || 'Failed to delete area';
      });
  },
});

export default areaSlice.reducer;