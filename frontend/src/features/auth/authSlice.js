import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem("jwt_token");
const storedUser = localStorage.getItem("auth_user");

const initialState =
{
    token,
    user: storedUser ? JSON.parse(storedUser) : null,
    isAuthenticated: !!token
};

const setCredReducer = (state,action) =>
{
    const {token,user} = action.payload;

    state.token = token;
    state.user = user;
    state.isAuthenticated = true;

    localStorage.setItem("jwt_token",token);
    localStorage.setItem("auth_user",JSON.stringify(user));
};

const logoutReducer = (state) =>
{
    state.token = null;
    state.user = null;
    state.isAuthenticated = false;

    localStorage.removeItem("jwt_token");
    localStorage.removeItem("auth_user");
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