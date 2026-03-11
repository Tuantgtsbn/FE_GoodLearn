import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IUser, ILoginResponse } from 'src/types';

interface IAuthState {
  user?: IUser;
  accessToken?: string;
  refreshToken?: string;
  isAuthenticated: boolean;
}

const initialState: IAuthState = {
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<ILoginResponse>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    },
    updateAuthStore: (state, action: PayloadAction<Partial<IAuthState>>) => {
      Object.assign(state, action.payload);
    },
    updateUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },
    logoutUser: () => {
      return initialState;
    },
  },
});

export const { loginUser, logoutUser, updateAuthStore, updateUser } =
  authSlice.actions;
export default authSlice.reducer;
