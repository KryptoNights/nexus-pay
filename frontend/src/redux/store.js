import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/authReducer"; // Adjust the path as needed
import { loadStateFromLocalStorage } from "@/core/utils";

const preloadedState = loadStateFromLocalStorage();
console.log(preloadedState);


const store = configureStore({
  reducer: {
    authSlice: authSlice, // Correctly reference the reducer
  },
  preloadedState,
});

export const RootState = store.getState;
export const AppDispatch = store.dispatch;
export default store;
