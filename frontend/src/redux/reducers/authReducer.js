import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    idToken: {},
};

export const authSlice = createSlice({
    name: "authSlice",
    initialState,
    reducers: {
        setAuthData: (state, action) => {
            state.idToken = action.payload;
        },
    }
});

export const { setAuthData } = authSlice.actions;

export default authSlice.reducer;
