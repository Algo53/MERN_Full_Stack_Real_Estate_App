import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { selectUserInfo } from "./userInfoSlice";
import axios from "axios";
import io from 'socket.io-client';


const initialState = {
    socket: null,
    onlineUsers: [],
    property: null,
    conversation: [],
    friendConversation: {
        friend_id : null,
        property_id : null
    },
    friends: [],
    loading: false,
    error: null,
}

export const GetSingleUserChat = createAsyncThunk(
    'getting single user all messages',
    async (payload, thunkAPI) => {
        const state = thunkAPI.getState();
        const userInfo = selectUserInfo(state);
        try {
            const { friendId } = payload;
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/conversation/${userInfo?._id}/${friendId}`, { friendId }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            })
            const result = await response.data;
            if (result.success) {
                return result.messages
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const GetSinglePropertyChat = createAsyncThunk(
    'getting single user single property all messages',
    async (payload, thunkAPI) => {
        const state = thunkAPI.getState();
        const userInfo = selectUserInfo(state);
        const friendConversation = selectFriendConversationDetails(state);
        
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/conversation/${userInfo?._id}/property`, {friendId : friendConversation.friend_id, propertyId: friendConversation.property_id}, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            })
            const result = await response.data;
            if (result.success) {
                return result.messages
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const GetUserChats = createAsyncThunk(
    'getting user all messages',
    async (payload, thunkAPI) => {
        const state = thunkAPI.getState();
        const userInfo = selectUserInfo(state);
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/conversation/${userInfo?._id}`, {
                withCredentials: true
            })
            const result = await response.data;
            if (result.success) {
                return result.messages
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const ChatSlice = createSlice({
    name: 'conversation',
    initialState,
    reducers: {
        setSocket: (state) => {
            if (!state.socket)  // Check if the socket is already initialized
            {
                const newsocket = io(`${process.env.REACT_APP_BACKEND_URL_FOR_SOCKET}`);
                state.socket = newsocket;
            }
        },
        removeSocket: (state) => {
            if (state.socket) {
                state.socket.disconnect(); // Disconnect the socket
                state.socket = null; // Remove the reference to the socket
            }
        },
        setMessages: (state, action) => {
            state.messages = action.payload; // Set initial messages
        },
        addConversationDetails : (state, action) => {
            state.friendConversation = action.payload
        },
        removeConversationDetails : (state) => {
            state.friendConversation = { friend_id : null, property_id : null }
        },
        addMessage: (state, action) => {
            const { newChat, propertyId } = action.payload;

            const conversation = state.conversation.find(item => item.property?._id === propertyId);
            if (conversation) {
                conversation.messages.push(newChat); // Add the new message to the existing conversation
            } else {
                // Optionally handle the case where the conversation does not exist
                console.log(conversation)
                console.log(newChat)
                console.error("Conversation not found for the given propertyId.");
            }
        },
        addOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload; // set the online users
        },
        addProperty: (state, action) => {
            state.property = action.payload; // Add selected property id
        },
        removeProperty: (state) => {
            state.property = null; // Remove the previous selected property id
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetUserChats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(GetUserChats.fulfilled, (state, action) => {
                state.friends = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(GetUserChats.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
                state.friends = [];
            })
            .addCase(GetSinglePropertyChat.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(GetSinglePropertyChat.fulfilled, (state, action) => {
                state.conversation = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(GetSinglePropertyChat.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
                state.conversation = [];
            })
            .addCase(GetSingleUserChat.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(GetSingleUserChat.fulfilled, (state, action) => {
                state.conversation = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(GetSingleUserChat.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
                state.conversation = [];
            })
    }
})

export const selectSocket = (state) => state.conversation.socket;
export const selectProperty = (state) => state.conversation.property;
export const selectAllOnlineUsers = (state) => state.conversation.onlineUsers;
export const selectConversation = (state) => state.conversation.conversation;
export const selectFriendConversationDetails = (state) => state.conversation.friendConversation;
export const selectFriends = (state) => state.conversation.friends;
export const selectChatLoading = (state) => state.conversation.loading;
export const selectChatError = (state) => state.conversation.error;

export const { setSocket, removeSocket, setMessages, addMessage, addConversationDetails, removeConversationDetails, addOnlineUsers, addProperty, removeProperty } = ChatSlice.actions;

export default ChatSlice.reducer;