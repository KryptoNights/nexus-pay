import { getStoredAddress, loadStateFromLocalStorage } from "@/core/utils";
import { createSlice } from "@reduxjs/toolkit";
const preloadedState = loadStateFromLocalStorage();
const address = getStoredAddress();

const initialState = {
  idToken: preloadedState || {},
  activeAccountAdress: address || "",
  balance: {},
  selfNexusId: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData: (state, action) => {
      state.idToken = action.payload;
    },
    setActiveAccountAddress: (state, action) => {
      console.log("call");
      state.activeAccountAdress = action.payload;
    },
    setUserBalance: (state, action) => {
      console.log("inside", state);
      state.balance = action.payload;
    },
    setSelfNexusId: (state, action) => {
      state.selfNexusId = action.payload;
    },
  },
});

export const {
  setAuthData,
  setActiveAccountAddress,
  setUserBalance,
  setSelfNexusId,
} = authSlice.actions;

export default authSlice.reducer; // Export the reducer as default
