import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { LogoutUser, selectUserInfo } from '../redux/slices/userInfoSlice'
import { useEffect, useState } from 'react';
import ChatComponent from '../components/ChatComponent';
import ConversationIcon from '../components/ConversationIcon';
import { GetUserPosts, GetUserSavedPost, selectAllUserPost, selectSavedPostList } from '../redux/slices/postSlice';
import List from '../components/List';
import { GetSinglePropertyChat, GetUserChats, removeConversationDetails, removeProperty, removeSocket, selectFriendConversationDetails, selectFriends } from '../redux/slices/chatSlice';

export default function ProfilePage() {
    const userInfo = useSelector(selectUserInfo);
    const userPosts = useSelector(selectAllUserPost);
    const userSavedPost = useSelector(selectSavedPostList);
    const friendConversation = useSelector(selectFriendConversationDetails);
    const friend = useSelector(selectFriends);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    console.log("user saved list ", userSavedPost)
    const [state, setState] = useState("user")
    const [user, setUser] = useState(false);
    const handleLogout = () => {
        dispatch(LogoutUser());
        dispatch(removeSocket());
    }

    const handleChatClose = () => {
        dispatch(removeConversationDetails());
    }

    useEffect(() => {
        if (friendConversation?.property_id && friendConversation?.friend_id) {
            setUser(true)
        }
        else {
            setUser(false)
        }
    }, [friendConversation])

    useEffect(() => {
        if (userInfo) {
            dispatch(GetUserPosts());
            dispatch(GetUserSavedPost());
        }
    }, [])

    useEffect(() => {
        if (userInfo) { dispatch(GetUserChats()); }
    }, [])

    useEffect(() => {
        if (userInfo === null) {
            navigate('/login');
        }
    }, [userInfo])

    useEffect(() => {
        if (user) {
            dispatch(GetSinglePropertyChat({ friendId: friendConversation?.friend_id }));
        }
    }, [user])

    return (
        <div className='flex md:flex-row flex-col md:pl-4 pl-20 w-full h-full md:px-4'>
            <div className='md:basis-8/12 flex w-full h-full py-5'>
                <div className='flex flex-col w-full h-full gap-3 lg:pl-40 md:pl-28 pl-15 pr-10 pb-4'>
                    <div className='flex w-full justify-between items-center'>
                        <div className='flex font-normal text-3xl'>User Information</div>
                    </div>
                    <div className='flex flex-col p-2 gap-3'>
                        <div className='flex gap-3 h-20 items-center'>
                            <div className='flex font-medium text-lg'>Avatar :</div>
                            <div className='flex items-center'>
                                {
                                    userInfo?.avatar ? <> <img className="w-20 h-20 rounded-lg" src={userInfo.avatar} alt='' /></>
                                        : <i className='fa fa-user fa-lg' />
                                }
                            </div>
                        </div>
                        <div className='flex gap-3'>
                            <div className='flex font-medium text-lg'>Username :</div>
                            <div className='flex items-center'>{userInfo?.name}</div>
                        </div>
                        <div className='flex gap-3'>
                            <div className='flex font-medium text-lg'>Email :</div>
                            <div className='flex items-center'>{userInfo?.email}</div>
                        </div>
                    </div>
                    <div className='flex gap-4'>
                        <div className='flex border-1 border-black p-1 rounded hover:bg-gray-200'>
                            <Link to={(-1)}><i className="fa-solid fa-backward fa-lg"></i></Link>
                        </div>
                        <div className='flex border-1 border-black p-1 rounded hover:bg-gray-200'>
                            <Link to={`/${userInfo?._id}/update`}>Update Profile</Link>
                        </div>
                        <div className='flex border-1 border-black p-1 rounded hover:bg-gray-200'>
                            <button type='click' onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                    <div className='flex justify-between items-center'>
                        <div className={`flex text-2xl font-medium border-black border-1 px-1  rounded-md hover:bg-gray-200 cursor-pointer ${state === "user" ? "bg-black text-white" : ""}`} onClick={() => {setState("user")}}>My Post</div>
                        <div className={`flex text-2xl font-medium border-black border-1 px-1 rounded-md hover:bg-gray-200 cursor-pointer ${state === "saved" ? "bg-black text-white" : ""}`} onClick={() => {setState("saved")}}>Saved List</div>
                        <Link to={`/${userInfo?._id}/add`} className='flex p-1 border-2 border-black rounded hover:bg-gray-200'>Create New Post</Link>
                    </div>
                    <div className={`flex ${state === "user" ? "flex" : "hidden"}  flex-col gap-4 h-full overflow-scroll hide-scrollbar`}>
                        {
                            userPosts ? (
                                userPosts.map((item) =>
                                    <List key={item._id} property={item} />
                                )
                            )
                                :
                                (
                                    <div className='flex justify-content-center text-2xl font-medium p-5 w-full'>
                                        No post found. Post some properties
                                    </div>
                                )
                        }
                    </div>
                    <div className={`flex ${state === "saved" ? "flex" : "hidden"}  flex-col gap-4 h-ful overflow-scroll hide-scrollbar`}>
                        {
                            userSavedPost ? (
                                userSavedPost.map((item) =>
                                    <List key={item._id} property={item} />
                                )
                            )
                                :
                                (
                                    <div className='flex justify-content-center text-2xl font-medium p-5 w-full'>
                                        No saved post found.Explore and add them to saved if you like them
                                    </div>
                                )
                        }
                    </div>
                </div>
            </div>
            <div className={`${user ? "hidden" : "flex"} md:basis-4/12 pr-10 md:pr-0 flex md:flex-col h-full w-full`}>
                <div className={` flex-col gap-4 p-4 w-full h-full md:overflow-scroll hide-scrollbar bg-zinc-300`}>
                    {
                        friend.map((item, index) =>
                        (
                            <i className='flex w-full overflow-hidden' key={index}><ConversationIcon userId={item} setUser={setUser} /></i>
                        ))
                    }
                </div>
            </div>
            <div className={`${user ? "flex" : "hidden"} md:basis-4/12 pr-10 md:pr-0 flex md:flex-col h-full w-full`}>
                <div className={`flex-col gap-3 pb-3 w-full h-full`}>
                    <ChatComponent />
                    <div className='flex border-1 border-black py-3 px-2 rounded w-max h-8 items-center hover:bg-gray-100'>
                        <i className='fa-solid fa-backward fa-lg cursor-pointer' onClick={handleChatClose} />
                    </div>
                </div>
            </div>
        </div >
    )
}
