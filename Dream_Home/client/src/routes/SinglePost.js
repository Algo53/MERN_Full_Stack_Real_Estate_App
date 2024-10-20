import React, { useEffect, useState } from 'react'
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import Map from '../components/Map';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS styles
import { selectSellerInfo, selectUserInfo, selectUserOnline } from '../redux/slices/userInfoSlice';
import { AddPostToSaved, RemoveFromSaved, selectSavedPostList } from '../redux/slices/postSlice';
import ChatComponent from '../components/ChatComponent';
import { addConversationDetails, addProperty, GetSinglePropertyChat, removeConversationDetails, removeProperty } from '../redux/slices/chatSlice';
import PhotoSlider from '../components/PhotoSlider';

export default function SinglePost() {
    const userOnline = useSelector(selectUserOnline);
    const userSavedList = useSelector(selectSavedPostList);
    const userInfo = useSelector(selectUserInfo);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const post = useLoaderData();
    const property = post.post;
    const user = property.owner;

    const [photoSlider, setPhotoSlider] = useState(false);
    const [isSaved, setSaved] = useState(false);
    const [chatMode, setChatMode] = useState(false);

    const handleBookmarkIcon = () => {
        if (userOnline) {
            if (isSaved) {
                dispatch(RemoveFromSaved({ postId: property?._id }));
            }
            else {
                dispatch(AddPostToSaved({ postId: property?._id }));
            }
        }
        else {
            try {
                toast.error("Please login first!", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                }); // Display toast if possible
            } catch (error) {
                console.error("Error displaying toast:", error); // Log error if toast fails
            }
        }
    }

    const handleMessageIcon = () => {
        if (userOnline) {
            dispatch(addProperty(property?._id))
            dispatch(addConversationDetails({
                friend_id : user,
                property_id : property?._id
            }))
            dispatch(GetSinglePropertyChat({friendId : user?.id}))
            setChatMode(true);
        }
        else {
            try {
                toast.error("Please login first!", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                }); // Display toast if possible
            } catch (error) {
                console.error("Error displaying toast:", error); // Log error if toast fails
            }
        }
    }

    const handlePostUpdate = () => {
        navigate(`/${userInfo._id}/updatepost`, { state: { post } })
    }

    useEffect(() => {
        let a = userSavedList?.some(obj => obj?._id.includes(property?._id))
        setSaved(a);
    }, [userSavedList])


    return (
        <>
            <div className='flex md:flex-row flex-col md:pl-4 pl-16 w-full h-full md:px-4'>
                <div className='md:basis-8/12 flex h-full w-full py-5'>
                    <div className='flex flex-col h-full gap-5 w-full lg:pl-44 md:pl-20 pl-15 pr-10 pb-5 overflow-scroll hide-scrollbar'>
                        <div className='flex justify-between w-full gap-4'>
                            <div className='basis-3/5 flex rounded-lg w-full'>
                                <img src={property.images[0]} alt='' className='rounded-lg cursor-pointer' onClick={() => {setPhotoSlider(true)}}/>
                            </div>
                            <div className='flex flex-col gap-4 rounded-lg basis:1/5 xl:w-64 lg:w-44 md:16 w-60 overflow-scroll hide-scrollbar'>
                                {
                                    property?.images.slice(1).map((item, index) => (
                                        <img key={index} src={item} alt='' className='rounded-lg w-full h-24 cursor-pointer' onClick={() => {setPhotoSlider(true)}}/>
                                    )
                                    )
                                }
                            </div>
                        </div>
                        <div className='flex justify-between'>
                            <div className='flex flex-col gap-3'>
                                <div className='flex font-medium text-xl'>{property.title}</div>
                                <div className='flex italic gap-2'>
                                    <div className='flex justify-content-center items-center'>
                                        <i className='fa fa-location-dot fa-lg' />
                                    </div>
                                    {property.address.street},
                                    {property.address.state},
                                    {property.address.country}
                                </div>
                                <div className='flex p-1 w-max rounded items-center gap-1 font-bold bg-yellow-100'>
                                    <i className="fa-solid fa-dollar-sign"></i>
                                    {property.price}
                                </div>
                            </div>
                            <div className='flex gap-2 flex-col justify-content-center items-center bg-yellow-200 rounded-lg p-2'>
                                <div className='flex w-10 h-10'>
                                    <img className='rounded-full' src={user.avatar} alt='' />
                                </div>
                                <div className='flex font-bold font-xl justify-content-center w-full'>{user.name}</div>
                            </div>
                        </div>
                        <div className='flex'>
                            {property.description}
                        </div>
                        <div className='flex pb-5 pt-3'>
                            <Link to={(-1)}>
                                <i className='fa-solid fa-backward fa-2xl cursor-pointer rounded-lg' onClick={() => { removeProperty() }} />
                            </Link>
                        </div>
                    </div>
                </div>
                <div className='md:basis-4/12 flex gap-4 flex-col w-full h-full md:p-1 lg:p-2 md:py-3 pt-5 pb-8 px-4 md:bg-zinc-300'>
                    <div className={`${chatMode ? "hidden" : "flex"} flex-col gap-2 w-full md:h-52 h-80 z-40`}>
                        <div className='flex text-2xl font-bold'>Location</div>
                        <Map posts={[property]} />
                    </div>
                    <div className={`${chatMode ? "hidden" : "flex"} flex-col w-full gap-4`}>
                        <div className='flex text-2xl font-bold'>General</div>
                        <div className='flex bg-white'>

                        </div>
                        <div className='flex flex-col gap-2'>
                            <div className='flex font-medium text-xl'>Room Sizes</div>
                            <div className='flex justify-between'>
                                <div className='flex rounded-lg items-center bg-white md:p-1 p-2 lg:p-2 '>
                                    <i className="fa-regular fa-square lg:fa-2xl md:fa-xl fa-2xl justify-content-center items-center">
                                        <i className="fa-solid fa-up-right-and-down-left-from-center fa-2xs fa-fade fa-flip relative right-6"></i>
                                    </i> {property.size}sqm
                                </div>
                                <div className='flex rounded-lg items-center bg-white md:p-1 p-2 lg:p-2 '>
                                    <i className="fa-solid fa-bed lg:fa-xl pr-2" /> {property.bedrooms} bed
                                </div>
                                <div className='flex rounded-lg items-center bg-white md:p-1 p-2 lg:p-2 '>
                                    <i className="fa-solid fa-bath lg:fa-xl md:hidden lg:flex pr-2" /> {property.bathrooms} bath
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <div className='flex font-medium text-xl'>Nearby Places</div>
                            <div className='flex justify-between'>
                                <div className='flex rounded-lg items-center bg-white md:p-1 p-2 lg:p-2 '>
                                    <i className="fa-solid fa-school fa-xl justify-content-center items-center pr-2" />
                                    {property.features.school} km
                                </div>
                                <div className='flex rounded-lg items-center bg-white md:p-1 p-2 lg:p-2 '>
                                    <i className="fa-solid fa-dumbbell fa-xl pr-2" /> {property.features.school} km
                                </div>
                                {/* <div className='flex rounded-lg items-center bg-white  md:p-1 lg:p-2 '>
                                <i className="fa-solid fa-bath lg:fa-xl md:hidden lg:flex pr-2" /> {property.bathrooms} bath
                            </div> */}
                            </div>
                        </div>
                        <div className={`${userInfo?._id === user?._id ? "hidden" : "flex"} justify-between`}>
                            <div className='flex bg-white rounded-lg p-2 items-center'>
                                <i className="fa-regular fa-message fa-xl pr-2 cursor-pointer" onClick={handleMessageIcon}></i>
                                Send Message
                                <ToastContainer />
                            </div>
                            <div className='flex bg-white rounded-lg p-2 items-center'>
                                <i className={`fa-${isSaved ? "solid" : "regular"} fa-bookmark fa-xl pr-2 cursor-pointer`} onClick={handleBookmarkIcon}></i>
                                Save Post
                                <ToastContainer />
                            </div>
                        </div>
                        <div className={`${userInfo?._id === user?._id ? "flex" : "hidden"} items-center`}>
                            <div className='bg-white p-2 rounded-lg'><i className="fa-solid fa-pen-to-square fa-beat-fade fa-2xl cursor-pointer" onClick={handlePostUpdate} /></div>
                        </div>
                    </div>
                    <div className={`${chatMode ? "flex" : "hidden"} flex-col w-full h-full md:p-0 py-3 gap-4`}>
                        <ChatComponent user={user}/>
                        <div className='flex items-center'>
                            <i className='fa-solid fa-backward fa-2xl cursor-pointer bg-white p-1 py-4 rounded-lg' onClick={() => { 
                                setChatMode(false) 
                                dispatch(removeConversationDetails()) }}
                            />
                        </div>
                    </div>
                </div>
            </div >
            <div className={`${photoSlider ? "flex" : "hidden"} flex-col w-full gap-4 h-full fixed inset-0 z-50 bg-black/80`}>
                <PhotoSlider setPhotoSlider={setPhotoSlider} img={property?.images}/>
            </div>
        </>
    )
}
