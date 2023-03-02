import { combineReducers } from '@reduxjs/toolkit'
import  authSliceReducer from '../features/auth/authSlicer'
import  productSliceReducer  from '../features/products/productSlicer'

const rootReducer = combineReducers({
    auth : authSliceReducer,
    product : productSliceReducer
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer