import React, { useEffect, useState } from 'react'
import List from '../components/List';
import Map from '../components/Map';
import { useDispatch, useSelector } from 'react-redux';
import { filterPosts, GetAllPost, GetUserPosts, GetUserSavedPost, selectAllPost } from '../redux/slices/postSlice';
import { Link, useLocation } from 'react-router-dom';
import { FindSellerDetails, selectSellerInfo, selectUserInfo } from '../redux/slices/userInfoSlice';
import ChatComponent from '../components/ChatComponent';
import { addConversationDetails, addProperty, GetSinglePropertyChat, removeConversationDetails, removeProperty } from '../redux/slices/chatSlice';

export default function ListPage() {
    const allPost = useSelector(selectAllPost);
    const userInfo = useSelector(selectUserInfo);
    const sellerInfo = useSelector(selectSellerInfo);
    const { state } = useLocation();
    const dispatch = useDispatch();
    const [posts, setPosts] = useState([])
    const [searchDetails, setSearchDetails] = useState({
        city: state?.city || "",
        type: "",
        minPrice: state?.minPrice || "",
        maxPrice: state?.maxPrice || "",
        bedRoom: ""
    })

    const [chatMode, setChatMode] = useState(false);
    const [chatUser, setChatUser] = useState(null);
    const [userProperty, setProperty] = useState(null);

    const handleChatMode = () => {
        setChatMode(true);
    }

    const handleSearchChange = (e) => {
        setSearchDetails({ ...searchDetails, [e.target.name]: e.target.value });
    }

    const handleSearch = (e) => {
        e.preventDefault();
        dispatch(filterPosts(searchDetails));
    }
    
    useEffect( () => {
        dispatch(addConversationDetails({friend_id : sellerInfo, property_id : userProperty}))
    }, [sellerInfo])

    useEffect( () => {
        setPosts(allPost)
    }, [allPost])

    useEffect(() => {
        if (userInfo) {
            dispatch(GetUserSavedPost());
            dispatch(GetUserPosts());
        }
    }, [])

    useEffect( () => {
        if(chatUser){
            dispatch(FindSellerDetails(chatUser));
            dispatch(addProperty(userProperty));
            dispatch(GetSinglePropertyChat({friendId : chatUser?.id}));
        }
    }, [chatUser]);


    return (
        <div className='flex md:flex-row flex-col w-full h-full md:px-4'>
            <div className='basis:1/2 md:basis-8/12 flex w-full flex-col pt-4 xl:pl-44 lg:pl-36 md:pl-20 pl-5 lg:pr-10 pr-5 gap-4'>
                <div className='flex justify-between w-full text-2xl'>
                    <div className='flex'>Search for Result</div>
                    <div className='flex border-1 border-black p-1 rounded w-max h-8 items-center hover:bg-gray-100'>
                        <Link to={(-1)}><i className='fa-solid fa-backward fa-lg' /></Link>
                    </div>
                </div>
                <div className='flex flex-col w-full gap-2'>
                    <label>Location</label>
                    <input className='flex border-2 border-black rounded p-1' type='text' id='city' name='city' placeholder='City Location' value={searchDetails.city} onChange={handleSearchChange} />
                </div>
                <div className='flex w-full justify-between'>
                    <div className='flex flex-col gap-1'>
                        <label>Type</label>
                        <select className='flex lg:w-32 md:w-24 border-2 border-black rounded p-1' type='text' id='type' name='type' value={searchDetails.type} onChange={handleSearchChange}>
                            <option value="appartement">Appartement</option>
                            <option value="house">House</option>
                            <option value="commercial">Commercial</option>
                        </select>
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label>MinPrice</label>
                        <input className='flex xl:w-36 md:w-24 w-32 border-2 border-black rounded p-1' min={0} type='number' id='minPrice' name='minPrice' placeholder='any' value={searchDetails.minPrice} onChange={handleSearchChange} />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label>MaxPrice</label>
                        <input className='flex xl:w-36 md:w-24 w-32 border-2 border-black rounded p-1' min={0} type='number' id='maxPrice' name='maxPrice' placeholder='any' value={searchDetails.maxPrice} onChange={handleSearchChange} />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label>BedRooms</label>
                        <input className='flex xl:w-36 md:w-24 w-32 border-2 border-black rounded p-1' min={0} type='number' id='bedRoom' name='bedRoom' placeholder='any' value={searchDetails.bedRoom} onChange={handleSearchChange} />
                    </div>
                    <div className='flex justify-center items-center pt-4 h-full'>
                        <i className='fa fa-search fa-lg cursor-pointer' onClick={handleSearch} />
                    </div>
                </div>
                <div className='flex flex-col gap-3 overflow-scroll hide-scrollbar'>
                    {
                        allPost ? (
                            allPost.map((item) =>
                                <List key={item?._id} property={item} chatFunt={handleChatMode} chatUser={setChatUser} setPro={setProperty}/>
                            )
                        )
                            :
                            (
                                <div className='flex justify-content-center text-2xl font-medium p-5 w-full'>
                                    No post found. Please Update your search
                                </div>
                            )
                    }
                </div>
            </div>
            <div className='md:basis-4/12 flex flex-col md:py-3 lg:px-2 md:px-1 p-4 w-full h-full md:bg-zinc-300'>
                <div className={`flex w-full h-full`}>
                    <Map posts={posts} />
                </div>
                <div className={`w-full ${chatMode && sellerInfo ? "flex" : "hidden"} flex-col pt-3 gap-3 h-full`}>
                    {/* <div className='flex basis-11/12'> */}
                        <ChatComponent />
                    {/* </div> */}
                    <div className='flex items-center'>
                        <i className='fa-solid fa-backward fa-2xl cursor-pointer bg-white p-1 py-4 rounded-lg' onClick={() => 
                            {
                                removeProperty();
                                setChatMode(false);
                                dispatch(removeConversationDetails());
                            }
                        } />
                    </div>
                </div>
            </div>
        </div>
    )
}
