import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk, RootState } from '@app/store';
import { fetchAlllLowerRoleOfUser, fetchEditRole , EditRoleSchmema } from './role_policyAPI'

export interface RoleListState {
    isLoading: boolean
    GetROLELISTerror?: string [],
    LastTimeRequest? : Date,
    ROLELIST : Role [],
    AddRoleState : string,
    AddRoleErrors : [],
    EditRoleState : string,
    EditRoleErrors? : string [],
}
export interface Role {
    code : string,
    description: string,
    level: string,
    policies: string,
    created: string,
    id: number,
}
export const initialState: RoleListState = {
    isLoading: false,
    GetROLELISTerror :  [],
    ROLELIST : [] ,
    AddRoleState : "wait",
    AddRoleErrors : [],
    EditRoleState : "wait",
    EditRoleErrors :  []
}


  export const GetAllLowerRoleOfUser = createAsyncThunk< Role [] , any , { rejectValue: string [] }>(
    'Role/get',
    async ( data ,thunkApi) => {
      const response = await fetchAlllLowerRoleOfUser();
      if (response.responses && response.responses.data)
      {
        return   (response.responses.data) as Role []
      }
      else {
        return thunkApi.rejectWithValue((response.errors) as string[]);
      }
      
    }
  );

  export const EditRole = createAsyncThunk< boolean , EditRoleSchmema , { rejectValue: string [] }>(
    'Role/update',
    async ( data ,thunkApi) => {
      const response = await fetchEditRole(data);
      if (response.responses && response.succeeded)
      {
        return   true;
      }
      else {
        return thunkApi.rejectWithValue((response.errors) as string[]);
      }
      
    }
  );


export const roleSlice = createSlice({
    name: 'role',
    initialState,
    reducers: {
      setFinishEditRole: (state) => {
        state.AddRoleState = "wait";
        state.EditRoleErrors = [];
    },
    },
    extraReducers: (builder) => {
        builder
          .addCase(GetAllLowerRoleOfUser.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(GetAllLowerRoleOfUser.fulfilled, (state,action) => {
            state.isLoading = false;
            //state.LastTimeRequest = new Date();
            state.ROLELIST = action.payload
          })
          .addCase(GetAllLowerRoleOfUser.rejected, (state, action) => {
            state.isLoading = false;
            state.GetROLELISTerror = action.payload
          }) // edit role
          .addCase(EditRole.pending, (state) => {
            state.EditRoleState = "pending";
          })
          .addCase(EditRole.fulfilled, (state,action) => {
            state.EditRoleState = action ? "success" : "fail"
          })
          .addCase(EditRole.rejected, (state, action) => {
            state.EditRoleState = "fail";
            state.EditRoleErrors = action.payload;
          });
          
      },
})
export const { setFinishEditRole } = roleSlice.actions
export const roleSelector = (state: RootState) => state.role
export default roleSlice.reducer