import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/authReducer"; // Adjust the path as needed

const store = configureStore({
  reducer: {
    authSlice: authSlice, // Correctly reference the reducer
  },
});

export const RootState = store.getState;
export const AppDispatch = store.dispatch;
export default store;
