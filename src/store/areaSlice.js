import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchAreas = createAsyncThunk('areas/fetchAreas', async () => {
  const response = await axios.get('http://localhost:5000/areas');
  return response.data;
});

export const addArea = createAsyncThunk('areas/addArea', async (area) => {
  const response = await axios.post('http://localhost:5000/areas', area);
  return response.data;
});

export const updateArea = createAsyncThunk('areas/updateArea', async ({ id, updatedArea }) => {
  const response = await axios.put(`http://localhost:5000/areas/${id}`, updatedArea);
  return response.data;
});

export const deleteArea = createAsyncThunk('areas/deleteArea', async (id) => {
  await axios.delete(`http://localhost:5000/areas/${id}`);
  return id;
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
      .addCase(fetchAreas.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAreas.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.areas = action.payload;
      })
      .addCase(fetchAreas.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addArea.fulfilled, (state, action) => {
        state.areas.push(action.payload);
      })
      .addCase(updateArea.fulfilled, (state, action) => {
        const index = state.areas.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.areas[index] = action.payload;
        }
      })
      .addCase(deleteArea.fulfilled, (state, action) => {
        state.areas = state.areas.filter((a) => a.id !== action.payload);
      });
  },
});

export default areaSlice.reducer;