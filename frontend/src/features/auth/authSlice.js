import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem("jwt_token");

const initialState =
{
    token,
    user: null,
    isAuthenticated: !!token
};

const setCredReducer = (state,action) =>
{
    const {token,user} = action.payload;

    state.token = token;
    state.user = user;
    state.isAuthenticated = true;

    localStorage.setItem("jwt_token",token);
};

const logoutReducer = (state) =>
{
    state.token = null;
    state.user = null;
    state.isAuthenticated = false;

    localStorage.removeItem("jwt_token");
};


const authSlice = createSlice
(
    {
        name: "auth",
        initialState,
        reducers:
        {
            setCredentials: setCredReducer,
            logout: logoutReducer
        }
    }
);

export const {setCredentials,logout} = authSlice.actions;

export default authSlice.reducer;