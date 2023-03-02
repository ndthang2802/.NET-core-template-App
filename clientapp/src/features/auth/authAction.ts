import { AppThunk } from '../../store/index';
import { RootState } from '../../store/rootReducer';
import { setAuthSuccess,setAuthFailed,setLoading } from './authSlicer';

export const login = (): AppThunk => async (dispatch) => {
    try {
        dispatch(setLoading(true))
        const currentUser = { Id : 1, Name : "Test" };    //getCurrentUserFromAPI('https://auth-end-point.com/login')
        dispatch(setAuthSuccess(currentUser))
    } catch (error) {
        dispatch(setAuthFailed({message : "Login Failed"}))
    } finally {
        dispatch(setLoading(false))
    }
}

export const logOut = (): AppThunk => async (dispatch) => {
    try {
        dispatch(setLoading(true))
        //await {}// endUserSession('https://auth-end-point.com/log-out')
    } catch (error) {
        dispatch(setAuthFailed({message : "Logout Failed"}))
    } finally {
        dispatch(setLoading(false))
    }
}

export const authSelector = (state: RootState) => state.auth