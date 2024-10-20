import {createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

const initialState = {
    userOnline: false,
    userInfo: null,
    sellerInfo: null,
    error: null
}

export const LoginRoute = createAsyncThunk(
    'login',
    async(payload, thunkAPI) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/login`, payload, {
                headers : {
                    'Content-Type' : "application/json"
                },
                withCredentials: true, // Include credentials (cookies, etc.) in requests
            })
            const result = await response.data;
            
            return result.success === true ? result.success : false;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const LoginCheckRoute = createAsyncThunk(
    'loginCheck',
    async(payload, thunkAPI) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/login/success`, {
                withCredentials: true, // Include credentials (cookies, etc.) in requests
            })
            const result = await response.data;
            
            return result.success === true ? result.success : false;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const RegisterRoute = createAsyncThunk(
    'register',
    async(payload, thunkAPI) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/register`, payload,
                {
                    headers : {
                        "Content-Type" : "application/json"
                    },
                    withCredentials: true
                }
            )
            const result = await response.data;
            
            return result.success === true ? result.success : false;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const FindSellerDetails = createAsyncThunk(
    'findingSellerInfo',
    async (payload, thunkAPI) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/finduser`,
                payload,
                {
                    headers: {
                        'Content-Type': "application/json"
                    }
                }
            )
            const result = await response.data;
            
            return result.success === true ? result.user : null;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const GetUserDetails = createAsyncThunk(
    'getuserinfo',
    async (payload, thunkAPI) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/`,
                {
                    withCredentials: true
                }
            )
            const result = await response.data;
            
            return result.success === true ? result.user : null;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const UpdateUserRoute = createAsyncThunk(
    'updateUser',
    async({id, payload}, thunkAPI) => {
        try {
            if (!id) {
                return thunkAPI.rejectWithValue('User is not logged in or user info is missing.');
            }

            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/${id}/update`, 
                payload,
                {
                    headers : {
                        "Content-Type" : "application/json"
                    },
                    withCredentials: true
                }
            )
            const result = await response.data;
            
            return result.success === true ? result.user : false;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const LogoutUser = createAsyncThunk(
    'logout',
    async(thunkAPI) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/logout`,
                {
                    withCredentials: true
                }
            )
            const result = await response.data;
            if (result.success) 
            {
                return result.success;
            } 
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const UserInfoSlice = createSlice({
    name : 'userInfo',
    initialState,
    reducers : {    
        userInfoReset : {
            reducer : (state) => {
                state.userOnline = false;
                state.error = null;
                state.userInfo = null;
            }
        },
        setSellerInfo : (state, action) => {
            state.sellerInfo = action.payload;
        }
    },
    extraReducers : (builder) => {
        builder
            .addCase(LoginRoute.pending, (state) => {
                state.userOnline = false;
            })
            .addCase(LoginRoute.fulfilled, (state, action) => {
                state.userOnline = action.payload;
                state.error = null;
            })
            .addCase(LoginRoute.rejected, (state, action) => {
                state.userOnline = false;
                state.error = action.payload;
            })
            .addCase(LoginCheckRoute.pending, (state) => {
                state.userOnline = false;
            })
            .addCase(LoginCheckRoute.fulfilled, (state, action) => {
                state.userOnline = action.payload;
                state.error = null;
            })
            .addCase(LoginCheckRoute.rejected, (state, action) => {
                state.userOnline = false;
                state.error = action.payload;
            })
            .addCase(RegisterRoute.pending, (state) => {
                state.userOnline = false;
            })
            .addCase(RegisterRoute.fulfilled, (state, action) => {
                state.userOnline = action.payload;
                state.error = null;
            })
            .addCase(RegisterRoute.rejected, (state, action) => {
                state.userOnline = false;
                state.error = action.payload;
            })
            .addCase(FindSellerDetails.pending, (state) => {
                state.sellerInfo = null;
            })
            .addCase(FindSellerDetails.fulfilled, (state, action) => {
                state.sellerInfo= action.payload;
                state.error = null;
            })
            .addCase(FindSellerDetails.rejected, (state, action) => {
                state.sellerInfo = null;
                state.error = action.payload;
            })
            .addCase(GetUserDetails.pending, (state) => {
                state.userInfo = null;
            })
            .addCase(GetUserDetails.fulfilled, (state, action) => {
                state.userInfo= action.payload;
                state.error = null;
            })
            .addCase(GetUserDetails.rejected, (state, action) => {
                state.userInfo = null;
                state.error = action.payload;
            })
            .addCase(UpdateUserRoute.pending, (state) => {
                state.userInfo = null;
            })
            .addCase(UpdateUserRoute.fulfilled, (state, action) => {
                state.userInfo= action.payload;
                state.error = null;
            })
            .addCase(UpdateUserRoute.rejected, (state, action) => {
                state.userInfo = null;
                state.error = action.payload;
            })
            .addCase(LogoutUser.pending, (state) => {
                state.error = null;
                state.online = true;
            })
            .addCase(LogoutUser.fulfilled, (state, action) => {
                state.userInfo= null;
                state.online = false;
            })
            .addCase(LogoutUser.rejected, (state, action) => {
                state.online = true;
                state.error = action.payload;
            })
    }
});

export const selectUserOnline = (state) => state.userInfo.userOnline;
export const selectUserInfo = (state) => state.userInfo.userInfo;
export const selectSellerInfo = (state) => state.userInfo.sellerInfo;
export const selectError = (state) => state.userInfo.error;

export const  {userInfoReset, setSellerInfo} = UserInfoSlice.actions;

export default UserInfoSlice.reducer;