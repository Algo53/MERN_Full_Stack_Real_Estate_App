import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, selectConversation, selectFriendConversationDetails, selectProperty, selectSocket } from '../redux/slices/chatSlice';
import { selectUserInfo } from '../redux/slices/userInfoSlice';
import SingleMessagePrint from './SingleMessagePrint';


export default function ChatComponent(user) {
    const userInfo = useSelector(selectUserInfo);
    const conversation = useSelector(selectConversation);
    const friendConversation = useSelector(selectFriendConversationDetails)
    const p_id = useSelector(selectProperty);
    const socket = useSelector(selectSocket);

    const dispatch = useDispatch();

    const [owner, setOwner] = useState(friendConversation?.friend_id || user.user);
    const [propertyId, setpropertyId] = useState(friendConversation?.property_id || p_id);

    const [message, setMessage] = useState({
        chat: "",
        audio: "",
        file: ""
    });

    const [chatData, setChatData] = useState([]);
    const handleMessageInput = (e) => {
        setMessage({ ...message, [e.target.name]: e.target.value })
    }

    const handleMessageSent = (e) => {
        e.preventDefault();

        if (message.chat.trim() === "") return; // Prevent sending empty messages

        const newChat = {
            sender: userInfo?._id,
            receiver: owner?._id,
            chat: message.chat,
            audio: message.audio,
            file: message.file
        }
        setChatData((prevChatData) => [...prevChatData, newChat]);
        dispatch(addMessage({ newChat, propertyId }));
        // Emit the message to the server via socket
        socket?.emit('sendMessage', { newChat, propertyId });
        setMessage((prev) => {
            return {
                ...prev,
                chat: "",
                audio: "",
                file: ""
            }
        })

        // console.log(chatData);
    }

    useEffect(() => {
        if (userInfo) {
            socket?.on("receiveMessage", (data) => {
                // console.log("received message from the another user : ", data);
                dispatch(addMessage({newChat : data.newMessage, propertyId: data.propertyId})); 
                // Update chatData directly when a new message is received
                setChatData((prevChatData) => [...prevChatData, data]);
            })
        }
        // Cleanup on unmount
        return () => {
            socket?.off("receiveMessage");
        };
    }, [socket])

    useEffect(() => {
        if (socket)
            socket.emit('newUser', userInfo?._id);
    }, [])

    useEffect(() => {
        const chats = conversation.filter((item) => item?.property?._id === propertyId);
        setChatData(chats[0]?.messages || []);  // Initialize chat data
    }, [conversation]);

    useEffect( () => {
        setOwner(friendConversation?.friend_id)
        setpropertyId(friendConversation?.property_id)
    }, [friendConversation])

    return (
        <div className='flex flex-col w-full bg-white lg:p-2 p-1 rounded-lg h-full'>
            <div className='basis-1/12 flex bg-black text-white px-2 py-1 gap-2 rounded-t-lg'>
                <div className='flex items-center'>
                    {
                        owner?.avatar ?
                            <img className="rounded-full w-10 h-10" src={owner?.avatar} alt='' />
                            :
                            <i className='fa fa-user fa-md' />
                    }
                </div>
                <div className='flex items-center font-bold'>{owner?.name || "username"}</div>
            </div>
            
            <div className=' basis-10/12 flex flex-col border-x-black border-2 lg:p-2 p-2 pb-3 w-full gap-2 overflow-scroll hide-scrollbar'>
                {
                    chatData ? <SingleMessagePrint chatData={chatData} /> : <div>No message yet! Start messaging now and get more info about the property</div>
                }
            </div>

            <div className='basis-1/12 flex items-center gap-1 bg-black lg:p-2 p-1 w-full'>
                <input className='flex rounded-lg w-full px-2 py-1' id='chat' name='chat' value={message.chat} onChange={handleMessageInput} />
                <div className='bg-white p-1 rounded'>
                    <i className="fa-regular fa-paper-plane fa-lg" onClick={handleMessageSent} />
                </div>
            </div>
        </div >

    )
}
