import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectUserInfo, selectUserOnline } from '../redux/slices/userInfoSlice';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS styles
import { AddPostToSaved, RemoveFromSaved, selectSavedPostList } from '../redux/slices/postSlice';
import { addConversationDetails } from '../redux/slices/chatSlice';


export default function List(props) {
    const userOnline = useSelector(selectUserOnline);
    const userInfo = useSelector(selectUserInfo);
    const userSavedList = useSelector(selectSavedPostList);
    const dispatch = useDispatch();
    const { property, chatFunt, chatUser, setPro } = props;

    // Check if the post is in the user's favorite list
    const [isSaved, setSaved] = useState(false);

    const handleBookmark = (e) => {
        e.preventDefault();
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

    const handleChatmark = (e) => {
        if (userOnline) {
            setPro(property?._id);
            chatFunt(true);
            chatUser({ id: property?.owner });
            dispatch(addConversationDetails({friend_id : property?.owner, property_id : property?._id}))
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

    useEffect(() => {
        let a = userSavedList.some(obj => obj._id.includes(property?._id))
        setSaved(a);
    }, [userSavedList])

    return (
        <div className='flex border-black border-2 rounded-lg w-full h-full'>
            <div className='xl:flex md:hidden flex w-56 h-56'>
                {
                    property.images ? (
                        <img className="rounded-l-lg" src={property.images[0]} alt='' />
                    )
                        :
                        (
                            <></>
                        )
                }
            </div>
            <div className='flex flex-col p-2 gap-3 h-full w-full'>
                <div className='flex font-bold text-xl'>
                    <Link to={`/property/${property?._id}`}>{property?.title}</Link>
                </div>
                <div className='flex italic gap-2'>
                    <div className='flex justify-content-center items-center'><i className='fa fa-location-dot fa-lg' /></div>
                    {property.address.street}
                    {property.address.state}
                    {property.address.country}
                </div>
                <div className='flex flex-col gap-2 content-between h-full w-full'>
                    <div className='flex p-1 w-max rounded items-center gap-1 font-bold bg-yellow-200'>
                        <i className="fa-solid fa-dollar-sign"></i>
                        {property.price}
                    </div>
                    <div className='flex  h-full justify-between items-end'>
                        <div className='flex gap-2'>
                            <div className='flex font-medium items-center p-1 rounded'>
                                <i className="fa-solid fa-bed fa-lg pr-2" />
                                {property.bedrooms} BedRooms
                            </div>
                            <div className='flex font-medium items-center p-1 rounded'>
                                <i className="fa-solid fa-bath fa-lg pr-2" />
                                {property.bathrooms} BathRooms
                            </div>
                        </div>
                        <div className={`${userInfo?._id === property.owner ? "hidden" : "flex"}`}>
                            <div className='flex items-center p-3'>
                                <i className={`fa-${isSaved ? "solid" : "regular"} fa-bookmark fa-lg cursor-pointer`} onClick={handleBookmark} />
                                <ToastContainer />
                            </div>
                            <div className='flex items-center p-3'>
                                <i className="fa-regular fa-message fa-lg cursor-pointer" onClick={handleChatmark} />
                                <ToastContainer />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
