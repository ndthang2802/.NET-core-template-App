import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk, RootState } from '../../app/store';
import { fetchAdminLogin, LoginData } from './authAPI'
export interface AuthError {
    message: string
}
export interface AuthState {
    isAuth: boolean
    currentUser?: CurrentUser
    isLoading: boolean
    error: AuthError
}
export interface CurrentUser {
    Id: number
    Name: string
}
export const initialState: AuthState = {
    isAuth: false,
    isLoading: false,
    error: {message: 'An Error occurred'},
}

export const LoginAsync = createAsyncThunk<CurrentUser, LoginData>(
    'user/login',
    async (data) => {
      const response = await fetchAdminLogin(data);
      // The value we return becomes the `fulfilled` action payload
      return  (await response.json()) as CurrentUser  ;
    }
  );


export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLoading: (state, {payload}: PayloadAction<boolean>) => {
            state.isLoading = payload
        },
        setAuthSuccess: (state, { payload }: PayloadAction<CurrentUser>) => {
            state.currentUser = payload
            state.isAuth = true
        },
        setLogOut: (state) => {
            state.isAuth = false
            state.currentUser = undefined
        },
        setAuthFailed: (state, { payload }: PayloadAction<AuthError>) => {
            state.error = payload
            state.isAuth = false
        },
    },
    extraReducers: (builder) => {
        builder
          .addCase(LoginAsync.pending, (state) => {
            state.isLoading = true;
            state.isAuth = false;
          })
          .addCase(LoginAsync.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isAuth = true;
            state.currentUser = action.payload
          })
          .addCase(LoginAsync.rejected, (state) => {
            state.isLoading = false;
            state.isAuth = false;
          });
      },
})
export const { setAuthSuccess, setLogOut, setLoading, setAuthFailed} = authSlice.actions
export const authSelector = (state: RootState) => state.auth
export default authSlice.reducer