import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  userProfile: null, // ye dynamic hoga, alag alag profile ke liye
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload;
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
    clearAuthUser: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setAuthUser, clearAuthUser, setUserProfile } = authSlice.actions;
export default authSlice.reducer;
