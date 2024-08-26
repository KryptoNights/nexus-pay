import { getStoredAddress, loadStateFromLocalStorage } from "@/core/utils";
import { createSlice } from "@reduxjs/toolkit";
const preloadedState = loadStateFromLocalStorage();
const address = getStoredAddress();
console.log(address);

const initialState = {
  idToken: preloadedState || {},
  activeAccountAdress: address || "",
  balance: 0,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData: (state, action) => {
      state.idToken = action.payload;
    },
    setActiveAccountAddress: (state, action) => {
      state.activeAccountAdress = action.payload;
    },
    setUserBalance: (state, action) => {
      state.balance = action.payload;
    },
  },
});

export const { setAuthData, setActiveAccountAddress, setUserBalance } =
  authSlice.actions;

export default authSlice.reducer; // Export the reducer as default
