import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk, RootState } from '@app/store';
import { _GetImageProductLink, AddProductSchmema, DeleteProductSchema, fetchAddProduct, fetchDeleteProduct, fetchQueryProductList, QueryProduct } from './productAPI'

export interface ProductListState {
    isLoading: boolean
    GetPRODUCTLISTerror?: string [],
    LastTimeRequestProduct? : number,
    PRODUCTLIST : ProductList [],
    AddProductState : string,
    AddProductErrors : []
    ChangeProductState : string
    ChangeProductError : [],
    DeleteProductState : string,
    DeleteProductError? : string []
}
export interface ProductList {
    // username : string,
    // phoneNumber: string,
    // address: string,
    // email: string,
    // roles: string,
    // policies: [],
    created: string,
    id: number,
    code : string,
    imagesName : any [],
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
    LastTimeRequestProduct : 0,
    DeleteProductState : 'wait',
}


  export const GetProductList = createAsyncThunk< ProductList [] , QueryProduct , { rejectValue: string [] }>(
    'product/query',
    async ( data ,thunkApi) => {
      const response = await fetchQueryProductList(data);
      if (response.responses && response.responses.data)
      {
        return   (response.responses.data.items) as ProductList []
      }
      else {
        return thunkApi.rejectWithValue((response.errors) as string[]);
      }
      
    }
  );

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

  export const GetImageProductLink = (link : string) => {
    return _GetImageProductLink(link);
  }

  export const DeleteProduct = createAsyncThunk< boolean , DeleteProductSchema , { rejectValue: string [] }>(
    'product/delete',
    async ( data ,thunkApi) => {
      const response = await fetchDeleteProduct(data);
      if (response.responses && response.succeeded)
      {
        return  true;
      }
      else {
        return thunkApi.rejectWithValue((response.errors) as string[]);
      }
      
    }
  );


export const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
      setFinishAddProduct: (state) => {
        state.AddProductState = "wait"
      },
      setFinishDeleteProduct: (state) => {
        state.DeleteProductState = "wait"
      }
    },
    extraReducers: (builder) => {
        builder
          .addCase(GetProductList.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(GetProductList.fulfilled, (state,action) => {
            state.isLoading = false;
            state.LastTimeRequestProduct = Date.now();
            state.PRODUCTLIST = action.payload
          })
          .addCase(GetProductList.rejected, (state, action) => {
            state.isLoading = false;
            state.GetPRODUCTLISTerror = action.payload
          }) // add product
          .addCase(AddProduct.pending, (state) => {
            state.AddProductState = "pending";
          })
          .addCase(AddProduct.fulfilled, (state,action) => {
            state.AddProductState = action ? "success" : "fail"
          })
          .addCase(AddProduct.rejected, (state) => {
            state.AddProductState = "fail"
          }) // Delete product
          .addCase(DeleteProduct.pending, (state) => {
            state.DeleteProductState = "pending";
          })
          .addCase(DeleteProduct.fulfilled, (state,action) => {
            state.DeleteProductState = action ? "success" : "fail"
          })
          .addCase(DeleteProduct.rejected, (state, action) => {
            state.DeleteProductState = "fail";
            state.DeleteProductError = action.payload;
          })
          ;
          
      },
})
export const { setFinishAddProduct, setFinishDeleteProduct  } = productSlice.actions
export const productSelector = (state: RootState) => state.product
export default productSlice.reducer