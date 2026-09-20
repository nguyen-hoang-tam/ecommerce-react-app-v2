import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  profile: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    authSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    authFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    authLogout: (state) => {
      state.user = null;
      state.profile = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
});

export const {
  authStart,
  authSuccess,
  authFailure,
  setProfile,
  authLogout,
} = authSlice.actions;

export default authSlice.reducer;