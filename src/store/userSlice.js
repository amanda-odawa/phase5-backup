import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

// Async thunks for user operations
export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message || 'Failed to fetch users');
  }
});

// userSlice.jsx

export const updateUser = createAsyncThunk('users/updateUser', async ({ id, updatedUser }, { getState, rejectWithValue }) => {
  try {
    const users = getState().users.users; // Get the current list of users from the state
    const currentUser = users.find((user) => user.id === id); // Find the user to be updated

    if (currentUser) {
      // Merge current user data with the updated role
      const updatedUserData = { ...currentUser, ...updatedUser }; // Retain all other fields
      const response = await api.put(`/users/${id}`, updatedUserData);
      return response.data;
    } else {
      return rejectWithValue('User not found');
    }
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message || 'Failed to update user');
  }
});


export const deleteUser = createAsyncThunk('users/deleteUser', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/users/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message || 'Failed to delete user');
  }
});

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex((user) => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;