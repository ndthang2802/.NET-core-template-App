import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from '@app/store';
import { AddCategorySchmema,UpdateCategorySchmema ,fetchAddCategory, fetchAllCategoryList, fetchUpdateCategory } from './CategoryApi'

export interface CategoriesListState {
    isLoading: boolean
    GetCATEGORIESLISTerror?: string [],
    LastTimeRequestCategory? : number,
    CATEGORIESLIST : CategoriesList [],
    AddCategoryState : string,
    // AddUserErrors : []
    EditCategoryState : string
    EditCategoryError : [],
}
export interface CategoriesList {
    code : string,
    displayName: string,
    description: string,
    parentId: number,
    iconURL: string,
    created: string,
    id: number,
}
export const initialState: CategoriesListState = {
    isLoading: false,
    GetCATEGORIESLISTerror :  [],
    CATEGORIESLIST : [] ,
    AddCategoryState : 'wait',
    LastTimeRequestCategory : 0,
    EditCategoryState : 'wait',
    EditCategoryError : [],
}


  export const GetAllCategories = createAsyncThunk< CategoriesList [] , any , { rejectValue: string [] }>(
    'category/all',
    async ( data ,thunkApi) => {
      const response = await fetchAllCategoryList();
      if (response.responses && response.responses.data)
      {
        return   (response.responses.data) as CategoriesList []
      }
      else {
        return thunkApi.rejectWithValue((response.errors) as string[]);
      }
      
    }
  );

  export const AddCategory = createAsyncThunk< boolean , AddCategorySchmema , { rejectValue: string [] }>(
    'category/add',
    async ( data ,thunkApi) => {
      const response = await fetchAddCategory(data);
      if (response.responses && response.succeeded)
      {
        return   true;
      }
      else {
        return thunkApi.rejectWithValue((response.errors) as string[]);
      }
      
    }
  );

  export const UpdateCategory = createAsyncThunk< boolean , UpdateCategorySchmema , { rejectValue: string [] }>(
    'category/update',
    async ( data ,thunkApi) => {
      const response = await fetchUpdateCategory(data);
      if (response.responses && response.succeeded)
      {
        return   true;
      }
      else {
        return thunkApi.rejectWithValue((response.errors) as string[]);
      }
      
    }
  );


export const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
      setFinishAddCategory : (state) => {
        state.AddCategoryState = 'wait'
      },
      setFinishUpdateCategory : (state) => {
        state.EditCategoryState = 'wait'
      }
    },
    extraReducers: (builder) => {
        builder
          .addCase(GetAllCategories.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(GetAllCategories.fulfilled, (state,action) => {
            state.isLoading = false;
            state.LastTimeRequestCategory = Date.now();
            state.CATEGORIESLIST = action.payload
          })
          .addCase(GetAllCategories.rejected, (state, action) => {
            state.isLoading = false;
            state.GetCATEGORIESLISTerror = action.payload
          }) // add category
          .addCase(AddCategory.pending, (state) => {
            state.AddCategoryState = "pending";
          })
          .addCase(AddCategory.fulfilled, (state,action) => {
            state.AddCategoryState = action ? "success" : "fail"
          })
          .addCase(AddCategory.rejected, (state) => {
            state.AddCategoryState = "fail"
          })// Update category
          .addCase(UpdateCategory.pending, (state) => {
            state.EditCategoryState = "pending";
          })
          .addCase(UpdateCategory.fulfilled, (state,action) => {
            state.EditCategoryState = action ? "success" : "fail"
          })
          .addCase(UpdateCategory.rejected, (state, action) => {
            state.EditCategoryState = "fail";
            //state.EditCategoryError = action.payload
          })
          ;
          
      },
})
export const { setFinishAddCategory, setFinishUpdateCategory  } = categorySlice.actions
export const categorySelector = (state: RootState) => state.category
export default categorySlice.reducer