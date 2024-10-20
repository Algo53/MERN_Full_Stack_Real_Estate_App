import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";
import { selectUserInfo } from "./userInfoSlice";

const initialState = {
    allPost: [],
    singlePost: [],
    savedPostList: [],
    allUserPost: [],
    savedPost: [],
    error: null
}

export const GetSinglePost = createAsyncThunk(
    'singel post',
    async (payload, thunkAPI) => {
        try {
            const { property } = payload;
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/post/${property}`);

            const result = await response.data;
            if (result.success) {
                return result.post;
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const GetAllPost = createAsyncThunk(
    'allposts',
    async (payload, thunkAPI) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/post/`);

            const result = await response.data;
            if (result.success) {
                return result.post;
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const AddPostRoute = createAsyncThunk(
    'addnewPost',
    async (payload, thunkAPI) => {
        const state = thunkAPI.getState();
        const userInfo = selectUserInfo(state);
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/post/${userInfo._id}/addpost`, payload, {
                headers: {
                    'Content-Type': "application/json"
                },
                withCredentials: true
            })

            const result = await response.data;
            if (result.success) {
                return result.post;
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const updatePost = createAsyncThunk(
    'updatePost',
    async (payload, thunkAPI) => {
        const state = thunkAPI.getState();
        const userInfo = selectUserInfo(state);
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/post/${userInfo._id}/updatepost`, payload, {
                headers: {
                    'Content-Type': "application/json"
                },
                withCredentials: true
            })

            const result = await response.data;
            if (result.success) {
                return result.post;
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const GetUserPosts = createAsyncThunk(
    'alluserposts',
    async (payload, thunkAPI) => {
        const state = thunkAPI.getState();
        const userInfo = selectUserInfo(state);
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/post/${userInfo._id}`,
                {
                    withCredentials: true
                }
            );

            const result = await response.data;
            if (result.success) {
                return result.post;
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const AddPostToSaved = createAsyncThunk(
    'addingpostToBookmark',
    async (payload, thunkAPI) => {
        try {
            const state = thunkAPI.getState();
            const userInfo = selectUserInfo(state);

            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/post/${userInfo._id}/bookmark`,
                payload, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            }
            )
            const result = response.data;
            if (result.success) {
                return result.savedList;
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const RemoveFromSaved = createAsyncThunk(
    'RemovingPostFromBookmark',
    async (payload, thunkAPI) => {
        try {
            const state = thunkAPI.getState();
            const userInfo = selectUserInfo(state);

            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/post/${userInfo._id}/remove`,
                payload, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            }
            )
            const result = response.data;
            if (result.success) {
                return result.savedList;
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const GetUserSavedPost = createAsyncThunk(
    'GettingUserFavoritePosts',
    async (payload, thunkAPI) => {
        const state = thunkAPI.getState();
        const userInfo = selectUserInfo(state);
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/post/${userInfo._id}/savedpost`,
                {
                    withCredentials: true,
                }
            )
            const result = response.data;
            if (result.success) {
                return result.savedList;
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const PostSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        //Creating a reducer for filtering the post based on the user search
        filterPosts: (state, action) => {
            let { city, type, minPrice, maxPrice, bedRoom } = action.payload;


            minPrice = Number(minPrice) || 0;
            maxPrice = Number(maxPrice) || 100000000;
            bedRoom = Number(bedRoom) || 0;

            // Rearrange posts based on the applied filters
            state.allPost.sort((a, b) => {
                let scoreA = 0;
                let scoreB = 0;

                // Increase score based on how well it matches the filters

                // City match
                if (city) {
                    if (typeof a.city === 'string' && a.city.toLowerCase() === city.toLowerCase()) scoreA += 1;
                    if (typeof b.city === 'string' && b.city.toLowerCase() === city.toLowerCase()) scoreB += 1;
                }

                // Type match
                if (type) {
                    if (a.type.toLowerCase() === type.toLowerCase()) scoreA += 1;
                    if (b.type.toLowerCase() === type.toLowerCase()) scoreB += 1;
                }

                // Price match
                if (a.price >= minPrice && a.price <= maxPrice) scoreA += 1;
                if (b.price >= minPrice && b.price <= maxPrice) scoreB += 1;

                // Bedroom match
                if (a.bedRoom >= bedRoom) scoreA += 1;
                if (b.bedRoom >= bedRoom) scoreB += 1;

                // Sort by score (higher score first)
                return scoreB - scoreA;
            });
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(AddPostRoute.fulfilled, (state, action) => {
                state.allUserPost = action.payload;
                state.error = null;
            })
            .addCase(AddPostRoute.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                state.allUserPost = action.payload;
                state.error = null;
            })
            .addCase(updatePost.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(GetUserPosts.fulfilled, (state, action) => {
                state.allUserPost = action.payload;
                state.error = null;
            })
            .addCase(GetUserPosts.rejected, (state, action) => {
                state.allUserPost = [];
                state.error = action.payload;
            })
            .addCase(GetAllPost.fulfilled, (state, action) => {
                state.allPost = action.payload;
                state.error = null;
            })
            .addCase(GetAllPost.rejected, (state, action) => {
                state.allPost = [];
                state.error = action.payload;
            })
            .addCase(GetSinglePost.fulfilled, (state, action) => {
                state.singlePost = action.payload;
                state.error = null;
            })
            .addCase(GetSinglePost.rejected, (state, action) => {
                state.singlePost = [];
                state.error = action.payload;
            })
            .addCase(AddPostToSaved.fulfilled, (state, action) => {
                state.savedPostList = action.payload;
                state.error = null;
            })
            .addCase(AddPostToSaved.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(RemoveFromSaved.fulfilled, (state, action) => {
                state.savedPostList = action.payload;
                state.error = null;
            })
            .addCase(RemoveFromSaved.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(GetUserSavedPost.fulfilled, (state, action) => {
                state.savedPostList = action.payload;
                state.error = null;
            })
            .addCase(GetUserSavedPost.rejected, (state, action) => {
                state.savedPostList = [];
                state.error = action.payload;
            })
    }
})

export const selectSinglePost = (state) => state.posts.singlePost;
export const selectAllPost = (state) => state.posts.allPost;
export const selectFilteredPost = (state) => state.posts.filteredPost;
export const selectSavedPostList = (state) => state.posts.savedPostList;
export const selectAllUserPost = (state) => state.posts.allUserPost;
export const selectSavedPost = (state) => state.posts.savedPost;

export const { filterPosts } = PostSlice.actions;
export default PostSlice.reducer;
