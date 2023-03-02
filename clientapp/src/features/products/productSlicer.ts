import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk } from '../../store/index'
import { RootState } from '../../store/rootReducer'
export interface ProductError {
    message: string
}
export interface ProductState {
    Products: Product[]
    isLoading: boolean
    error: ProductError
}
export interface Product {
    Id: number
    Name: string
    Description: string
    SellPrice: number,
    InStock : number,
    PurchasedCount : number,
    NumberSoldCount : number
}
export const initialState: ProductState = {
    Products : [],
    isLoading: false,
    error: {message: 'An Error occurred'},
}
export const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        setLoading: (state, {payload}: PayloadAction<ProductState>) => {
            state.isLoading = payload.isLoading
        },
        setLoadProductSuccess: (state, { payload }: PayloadAction<ProductState>) => {
            state.Products = payload.Products
        },
        setLoadFailed: (state, { payload }: PayloadAction<ProductState>) => {
            state.error = payload.error
        },
    },
})
export const { setLoadProductSuccess, setLoadFailed, setLoading} = productSlice.actions
//export const productSliceSelector = (state: RootState) => state.product
export default productSlice.reducer