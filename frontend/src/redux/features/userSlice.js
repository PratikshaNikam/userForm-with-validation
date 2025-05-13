import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Add user
    addUserRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    addUserSuccess: (state, action) => {
      state.users.push(action.payload);
      state.loading = false;
    },
    addUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update user
    updateUserRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateUserSuccess: (state, action) => {
      const { id, updatedUser } = action.payload;
      const index = state.users.findIndex((user) => user.id === id);
      if (index !== -1) {
        state.users[index] = updatedUser;
      }
      state.loading = false;
    },
    updateUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete user
    deleteUserRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteUserSuccess: (state, action) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
      state.loading = false;
    },
    deleteUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  addUserRequest,
  addUserSuccess,
  addUserFailure,
  updateUserRequest,
  updateUserSuccess,
  updateUserFailure,
  deleteUserRequest,
  deleteUserSuccess,
  deleteUserFailure,
} = userSlice.actions;

export default userSlice.reducer;
