import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  user: any;
  currentUser: any;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  currentUser: null,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginUser: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    registerUser: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    /*getCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },*/
    logoutSuccess: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.currentUser = null;
      state.error = null;
    },
    loginUserError: (state, action) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload || 'Login failed';
    },
    registerUserError: (state, action) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload || 'Registration failed';
    },
  },
});

export const { loginUser, registerUser,  /*getCurrentUser*/ logoutSuccess, loginUserError, registerUserError } = authSlice.actions;
export default authSlice.reducer;