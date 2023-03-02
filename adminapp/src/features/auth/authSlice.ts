import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk, RootState } from '../../app/store';
import { fetchAdminLogin, LoginData } from './authAPI'
// export interface AuthError {
//     message: string[]
// }
export interface AuthState {
    isAuth: boolean
    currentUser?: CurrentUser
    isLoading: boolean
    error?: string []
}
export interface CurrentUser {
    Id: number
    Name: string
}
export const initialState: AuthState = {
    isAuth: false,
    isLoading: false,
}

export const LoginAsync = createAsyncThunk<CurrentUser, LoginData , { rejectValue: string [] }>(
    'user/login',
    async (data  , thunkApi) => {
      const response = await fetchAdminLogin(data);
      if (response.responses && response.responses.data.user)
      {
        
        return (response.responses.data.user) as CurrentUser
      }
      else {
        return thunkApi.rejectWithValue((response.errors) as string[]);
      }
      
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
            //state.isAuth = true
        },
        setLogOut: (state) => {
            state.isAuth = false
            state.currentUser = undefined
        },
        setAuthFailed: (state, { payload }: PayloadAction<string[]>) => {
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
          .addCase(LoginAsync.fulfilled, (state,action) => {
            state.isLoading = false;
            state.isAuth = true;
            state.currentUser = action.payload
          })
          .addCase(LoginAsync.rejected, (state, action) => {
            state.isLoading = false;
            state.isAuth = false;
            state.error = action.payload
          });
      },
})
export const { setAuthSuccess, setLogOut, setLoading, setAuthFailed} = authSlice.actions
export const authSelector = (state: RootState) => state.auth
export default authSlice.reducer