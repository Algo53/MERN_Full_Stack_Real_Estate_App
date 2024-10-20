import {configureStore} from '@reduxjs/toolkit';
import userInfoReducer from './slices/userInfoSlice';
import postReducer from './slices/postSlice';
import chatReducer from './slices/chatSlice';

export const reduxStore = configureStore({
    reducer : {
        userInfo : userInfoReducer,
        posts: postReducer,
        conversation: chatReducer
    }
});