import {
  getStoredAddress,
  loadStateFromLocalStorage,
} from "@/core/utils";
import { createSlice } from "@reduxjs/toolkit";
const preloadedState = loadStateFromLocalStorage();
const address = getStoredAddress();
console.log(address);

const initialState = {
  idToken: preloadedState || {},
  activeAccount: address || {},
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData: (state, action) => {
      state.idToken = action.payload;
    },
    setActiveAccount: (state, action) => {
      state.activeAccount = action.payload;
    },
  },
});

export const { setAuthData, setActiveAccount } = authSlice.actions;

export default authSlice.reducer; // Export the reducer as default
