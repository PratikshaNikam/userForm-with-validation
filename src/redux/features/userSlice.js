import {createSlice} from "@reduxjs/toolkit";

const initialState={
    users:[],
    editIndex:null
};


const userSlice=createSlice({
    name:'users',
    initialState,
    reducers:{
        addUser:(state,action)=>{
            state.users.push(action.payload)
        },
        deleteUser: (state, action) => {
            state.users.splice(action.payload, 1);
        },
        setEditIndex: (state, action) => {
            state.editIndex = action.payload;
        },
        updateUser: (state, action) => {
            const { index, updatedUser } = action.payload;
            state.users[index] = updatedUser;
            state.editIndex=null;
        },
        clearEditIndex: (state) => {
            state.editIndex = null;
          }
    }

})

export const { addUser, deleteUser, setEditIndex, updateUser,clearEditIndex } = userSlice.actions;
export default userSlice.reducer;