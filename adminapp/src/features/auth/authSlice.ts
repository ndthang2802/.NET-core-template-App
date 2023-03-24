import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk, RootState } from '@app/store';
import { fetchAdminLogin, getCurrentUserInformation, LoginData, refreshToken } from './authAPI'
// export interface AuthError {
//     message: string[]
// }
export interface AuthState {
    isAuth: boolean
    currentUser?: CurrentUser
    isLoading: boolean
    error?: string [],
    token : string,
    level? : number
    readyToGetInfomation : boolean,
}
export interface CurrentUser {
    Id: number
    Name: string
    listRoles : any []
}
export const initialState: AuthState = {
    isAuth: false,
    isLoading: false,
    token : "",
    readyToGetInfomation : false,
}

export const LoginAsync = createAsyncThunk<CurrentUser, LoginData , { rejectValue: string [] }>(
    'user/login',
    async (data  , thunkApi) => {
      const response = await fetchAdminLogin(data);
      if (response.responses && response.responses.data.user && response.responses.data.access_token)
      {
        thunkApi.dispatch(setAuthSuccess(response.responses.data.access_token))
        return (response.responses.data.user) as CurrentUser
      }
      else {
        return thunkApi.rejectWithValue((response.errors) as string[]);
      }
      
    }
  );

  export const GetUserInformation = createAsyncThunk<CurrentUser, any , { rejectValue: string [] }>(
    'user/getInformation',
    async ( data ,thunkApi) => {
      const response = await getCurrentUserInformation();
      if (response.responses && response.responses.data)
      {
        return (response.responses.data) as CurrentUser
      }
      else {
        return thunkApi.rejectWithValue((response.errors) as string[]);
      }
      
    }
  );
  export const fetchRefreshToken = createAsyncThunk(
    'user/refreshtoken',
    async ( data ,thunkApi) => {
      const response = await refreshToken();
      if (response == 200)
      {
        thunkApi.dispatch(setRefreshTokenSuccess(true));
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
        setAuthSuccess: (state, { payload }: PayloadAction<string>) => {
            state.token = payload
        },
        setLogOut: (state) => {
            state.isAuth = false
            state.currentUser = undefined
        },
        setAuthFailed: (state, { payload }: PayloadAction<string[]>) => {
            state.error = payload
            state.isAuth = false
        },
        setRefreshTokenSuccess: (state, {payload}: PayloadAction<boolean>) => {
          state.readyToGetInfomation = payload
        }
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
          }) //
          .addCase(GetUserInformation.pending, (state) => {
            state.isLoading = true;
            state.isAuth = false;
          })
          .addCase(GetUserInformation.fulfilled, (state,action) => {
            state.isLoading = false;
            state.isAuth = true;
            state.currentUser = action.payload;
            state.level = Math.min(...action.payload?.listRoles?.map(r => r.level))
          })
          .addCase(GetUserInformation.rejected, (state, action) => {
            state.isLoading = false;
            state.isAuth = false;
            state.error = action.payload;
          });
          
      },
})
export const { setAuthSuccess, setLogOut, setLoading, setAuthFailed ,setRefreshTokenSuccess} = authSlice.actions
export const authSelector = (state: RootState) => state.auth
export default authSlice.reducer