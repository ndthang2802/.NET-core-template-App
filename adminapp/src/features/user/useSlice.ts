import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk, RootState } from '@app/store';
import { AddUserSchmema, ChangeUserRoleSchema, fetchAddUser, fetchAllUserList, fetchChangeUserRole } from './userAPI'

export interface UserListState {
    isLoading: boolean
    GetUSERLISTerror?: string [],
    LastTimeRequest? : Date,
    USERLIST : UserList [],
    AddUserState : string,
    AddUserErrors : []
    ChangeUserRoleState : string
    ChangeUserRoleError : [],
}
export interface UserList {
    username : string,
    phoneNumber: string,
    address: string,
    email: string,
    roles: string,
    policies: [],
    created: string,
    id: number,
}
export const initialState: UserListState = {
    isLoading: false,
    GetUSERLISTerror :  [],
    USERLIST : [] ,
    AddUserState : "wait",
    AddUserErrors : [],
    ChangeUserRoleState : "wait",
    ChangeUserRoleError : []
}


  export const GetAllUser = createAsyncThunk< UserList [] , any , { rejectValue: string [] }>(
    'user/all',
    async ( data ,thunkApi) => {
      const response = await fetchAllUserList();
      if (response.responses && response.responses.data)
      {
        return   (response.responses.data) as UserList []
      }
      else {
        return thunkApi.rejectWithValue((response.errors) as string[]);
      }
      
    }
  );

  export const AddUser = createAsyncThunk< boolean , AddUserSchmema , { rejectValue: string [] }>(
    'user/add',
    async ( data ,thunkApi) => {
      const response = await fetchAddUser(data);
      if (response.responses && response.succeeded)
      {
        return   true;
      }
      else {
        return thunkApi.rejectWithValue((response.errors) as string[]);
      }
      
    }
  );

  export const ChangeUserRole = createAsyncThunk< boolean , ChangeUserRoleSchema , { rejectValue: string [] }>(
    'user/update-roles',
    async ( data ,thunkApi) => {
      const response = await fetchChangeUserRole(data);
      if (response.responses && response.succeeded)
      {
        return  true;
      }
      else {
        return thunkApi.rejectWithValue((response.errors) as string[]);
      }
      
    }
  );


export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
      setFinishAddUser: (state) => {
        state.AddUserState = "wait"
      },
      setFinishChangeUserRole: (state) => {
      state.ChangeUserRoleState = "wait"
      }
    },
    extraReducers: (builder) => {
        builder
          .addCase(GetAllUser.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(GetAllUser.fulfilled, (state,action) => {
            state.isLoading = false;
            //state.LastTimeRequest = new Date();
            state.USERLIST = action.payload
          })
          .addCase(GetAllUser.rejected, (state, action) => {
            state.isLoading = false;
            state.GetUSERLISTerror = action.payload
          }) // add user
          .addCase(AddUser.pending, (state) => {
            state.AddUserState = "pending";
          })
          .addCase(AddUser.fulfilled, (state,action) => {
            state.AddUserState = action ? "success" : "fail"
          })
          .addCase(AddUser.rejected, (state) => {
            state.AddUserState = "fail"
          })// change role
          .addCase(ChangeUserRole.pending, (state) => {
            state.AddUserState = "pending";
          })
          .addCase(ChangeUserRole.fulfilled, (state,action) => {
            state.AddUserState = action ? "success" : "fail"
          })
          .addCase(ChangeUserRole.rejected, (state) => {
            state.AddUserState = "fail"
          })
          ;
          
      },
})
export const { setFinishAddUser , setFinishChangeUserRole } = userSlice.actions
export const userSelector = (state: RootState) => state.user
export default userSlice.reducer