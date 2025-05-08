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

export const addArea = createAsyncThunk('areas/addArea', async (areaData, { dispatch, rejectWithValue }) => {
  try {
    // Step 1: Create Area
    const response = await api.post('/areas', areaData);
    const area = response.data;

    // Step 2: Add Disease Cases (if any)
    if (Object.keys(areaData.diseaseCases).length > 0) {
      await dispatch(addDiseaseCases({ areaId: area.id, diseaseCases: areaData.diseaseCases }));
    }

    return area; // Return the area data
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

export const addDiseaseCases = createAsyncThunk(
  'areas/addDiseaseCases',
  async ({ areaId, diseaseCases }, { rejectWithValue }) => {
    try {
      const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

      // Create each disease case
      const diseaseCasePromises = Object.entries(diseaseCases).map(
        async ([diseaseId, caseCount]) => {
          if (caseCount > 0) {
            return await api.post('/diseaseCase', {
              disease_id: parseInt(diseaseId),
              area_id: areaId,
              case_count: caseCount,
              reported_date: today,
              notes: '',
            });
          }
        }
      );

      // Wait for all promises to resolve
      await Promise.all(diseaseCasePromises);

      return { areaId, diseaseCases }; // Return data to update the state if needed
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message || 'Failed to add disease cases');
    }
  }
);


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
      // Fetch Area by ID (for editing)//edited
      .addCase(fetchAreaById.fulfilled, (state, action) => {
        console.log(action.payload); // Check the data returned here
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
