import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk, RootState } from '@app/store';
import { AddProductSchmema, fetchAddProduct } from './productAPI'

export interface ProductListState {
    isLoading: boolean
    GetPRODUCTLISTerror?: string [],
    LastTimeRequest? : number,
    PRODUCTLIST : ProductList [],
    AddProductState : string,
    AddProductErrors : []
    ChangeProductState : string
    ChangeProductError : [],
}
export interface ProductList {
    // username : string,
    // phoneNumber: string,
    // address: string,
    // email: string,
    // roles: string,
    // policies: [],
    // created: string,
    id: number,
    images : any [],
    name : string,
    description : string,
    sellPrice : number,
    inStock : number,
    display : boolean,
    category : string []
}
export const initialState: ProductListState = {
    isLoading: false,
    GetPRODUCTLISTerror :  [],
    PRODUCTLIST : [] ,
    AddProductState : "wait",
    AddProductErrors : [],
    ChangeProductState : "wait",
    ChangeProductError : [],
    LastTimeRequest : 0
}


//   export const GetAllUser = createAsyncThunk< ProductList [] , any , { rejectValue: string [] }>(
//     'user/all',
//     async ( data ,thunkApi) => {
//       const response = await fetchAllUserList();
//       if (response.responses && response.responses.data)
//       {
//         return   (response.responses.data) as UserList []
//       }
//       else {
//         return thunkApi.rejectWithValue((response.errors) as string[]);
//       }
      
//     }
//   );

  export const AddProduct = createAsyncThunk< boolean , AddProductSchmema , { rejectValue: string [] }>(
    'product/add',
    async ( data ,thunkApi) => {
      const response = await fetchAddProduct(data);
      if (response.responses && response.succeeded)
      {
        return   true;
      }
      else {
        return thunkApi.rejectWithValue((response.errors) as string[]);
      }
      
    }
  );

//   export const ChangeUserRole = createAsyncThunk< boolean , ChangeUserRoleSchema , { rejectValue: string [] }>(
//     'user/update-roles',
//     async ( data ,thunkApi) => {
//       const response = await fetchChangeUserRole(data);
//       if (response.responses && response.succeeded)
//       {
//         return  true;
//       }
//       else {
//         return thunkApi.rejectWithValue((response.errors) as string[]);
//       }
      
//     }
//   );


export const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
      setFinishAddProduct: (state) => {
        state.AddProductState = "wait"
      }
    },
    extraReducers: (builder) => {
        builder
        //   .addCase(GetAllUser.pending, (state) => {
        //     state.isLoading = true;
        //   })
        //   .addCase(GetAllUser.fulfilled, (state,action) => {
        //     state.isLoading = false;
        //     state.LastTimeRequest = Date.now();
        //     state.USERLIST = action.payload
        //   })
        //   .addCase(GetAllUser.rejected, (state, action) => {
        //     state.isLoading = false;
        //     state.GetUSERLISTerror = action.payload
        //   }) // add user
          .addCase(AddProduct.pending, (state) => {
            state.AddProductState = "pending";
          })
          .addCase(AddProduct.fulfilled, (state,action) => {
            state.AddProductState = action ? "success" : "fail"
          })
          .addCase(AddProduct.rejected, (state) => {
            state.AddProductState = "fail"
          })
          ;
          
      },
})
export const { setFinishAddProduct  } = productSlice.actions
export const productSelector = (state: RootState) => state.product
export default productSlice.reducer