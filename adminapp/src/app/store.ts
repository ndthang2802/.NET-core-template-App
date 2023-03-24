import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import counterReducer from '../features/counter/counterSlice';
import userReducer from '../features/user/useSlice';
import roleReducer from '../features/role_policy/role_policySlice';



export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth : authReducer,
    user : userReducer,
    role : roleReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
