import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

// Async thunks for area operations
export const fetchAreas = createAsyncThunk('areas/fetchAreas', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/areas');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message || 'Failed to fetch areas');
  }
});

export const fetchAreaById = createAsyncThunk('areas/fetchAreaById', async (id, { rejectWithValue }) => {
  try {
    const response = await api.get(`/areas/${id}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message || 'Failed to fetch area');
  }
});

export const addArea = createAsyncThunk('areas/addArea', async (area, { rejectWithValue }) => {
  try {
    const response = await api.post('/areas', area);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message || 'Failed to add area');
  }
});

export const updateArea = createAsyncThunk('areas/updateArea', async ({ id, updatedArea }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/areas/${id}`, updatedArea);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message || 'Failed to update area');
  }
});

export const deleteArea = createAsyncThunk('areas/deleteArea', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/areas/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message || 'Failed to delete area');
  }
});

const areaSlice = createSlice({
  name: 'areas',
  initialState: {
    areas: [], // List of all areas
    area: null, // Single area being edited
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Areas
      .addCase(fetchAreas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAreas.fulfilled, (state, action) => {
        state.loading = false;
        state.areas = action.payload;
      })
      .addCase(fetchAreas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Area by ID (for editing)
      .addCase(fetchAreaById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAreaById.fulfilled, (state, action) => {
        state.loading = false;
        state.area = action.payload; // Save the area data for editing
      })
      .addCase(fetchAreaById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Area
      .addCase(addArea.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addArea.fulfilled, (state, action) => {
        state.loading = false;
        state.areas.push(action.payload);
      })
      .addCase(addArea.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Area
      .addCase(updateArea.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateArea.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.areas.findIndex((area) => area.id === action.payload.id);
        if (index !== -1) {
          state.areas[index] = action.payload;
        }
      })
      .addCase(updateArea.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Area
      .addCase(deleteArea.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteArea.fulfilled, (state, action) => {
        state.loading = false;
        state.areas = state.areas.filter((area) => area.id !== action.payload);
      })
      .addCase(deleteArea.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default areaSlice.reducer;
