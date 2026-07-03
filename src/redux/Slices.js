import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  header: null,
  role: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    setHeader: (state, action) => {
      state.header = action.payload;
    },
    setClearStore: (state, action) => {
      return initialState;
    },
  },
});

export const { setUser, setToken, setRole, setHeader, setClearStore } = authSlice.actions;

export const selectUser = state => state?.auth?.user;
export const selectToken = state => state?.auth?.token;
export const selectRole = state => state?.auth?.role;
export const selectHeader = state => state?.auth?.header;
export default authSlice.reducer;
