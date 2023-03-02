import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk } from '../../store/index'
import { RootState } from '../../store/rootReducer'
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
})
export const { setAuthSuccess, setLogOut, setLoading, setAuthFailed} = authSlice.actions
//export const authSelector = (state: RootState) => state.auth
export default authSlice.reducer