import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

const API_URL = '/users'; // Relative to baseURL in api.js

// Async thunk for signup
export const signup = createAsyncThunk('auth/signup', async ({ username, password }, { rejectWithValue }) => {
  try {
    const response = await api.get(`${API_URL}?username=${username}`);
    if (response.data.length > 0) {
      return rejectWithValue('Username already exists');
    }
    const newUser = { username, password, role: 'user' };
    const postResponse = await api.post(API_URL, newUser);
    return postResponse.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message || 'Signup failed');
  }
});

// Async thunk for login
export const login = createAsyncThunk('auth/login', async ({ username, password }, { rejectWithValue }) => {
  try {
    const response = await api.get(`${API_URL}?username=${username}&password=${password}`);
    if (response.data.length === 0) {
      return rejectWithValue('Invalid username or password');
    }
    return response.data[0];
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message || 'Login failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Signup
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;