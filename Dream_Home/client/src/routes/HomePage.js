import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { filterPosts, GetAllPost, GetUserPosts, GetUserSavedPost } from '../redux/slices/postSlice';
import { GetUserDetails, LoginCheckRoute, selectUserInfo, selectUserOnline } from '../redux/slices/userInfoSlice';
import { selectSocket, setSocket } from '../redux/slices/chatSlice';

export default function HomePage() {
  const userOnline = useSelector(selectUserOnline);
  const userInfo = useSelector(selectUserInfo);
  const socket = useSelector(selectSocket);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState({
    type: "",
    city: "",
    minPrice: "",
    maxPrice: "",
  })

  const handleBuyButton = () => {
    setSearch((prev) => {
      return {
        ...prev,
        type: "buy"
      }
    })
  }
  const handleRentButton = () => {
    setSearch((prev) => {
      return {
        ...prev,
        type: "rent"
      }
    })
  }
  const handleSearch = (e) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  }

  const handleSearchButton = (e) => {
    e.preventDefault();
    dispatch(GetAllPost(search))
    dispatch(filterPosts(search))
    navigate('/list', {
      state: search
    })
  }

  useEffect(() => {
    if (!userOnline) {
      dispatch(LoginCheckRoute());
    }
  }, [])

  useEffect( () => {
    if(userOnline){
      dispatch(GetUserDetails());
    }
  }, [userOnline])

  useEffect(() => {
    dispatch(GetAllPost());
    if (userInfo) {
      dispatch(GetUserPosts());
      dispatch(GetUserSavedPost());
    }
  }, [])

  useEffect(() => {
    if (userInfo) {
      dispatch(GetUserPosts());
      dispatch(GetUserSavedPost());
      dispatch(setSocket());
      navigate(`/${userInfo._id}`);
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo) {
      console.log("new user is added");
      console.log(userInfo);
      if (socket) {
        socket.emit('newUser', userInfo?._id);
      }
    }
  }, [socket, userInfo])

  return (
    <div className='flex md:flex-row flex-col w-full h-full md:px-4'>
      <div className='basis-6/12 md:basis-8/12 flex flex-col gap-5 pr-10 py-5 xl:pl-32 lg:pl-24 pl-10 h-full'>
        <div className='flex flex-col justify-content-center xl:text-6xl lg:text-4xl text-3xl'>
          <p>Find Real Estate & Get Your Dream Place</p>
        </div>
        <div className='flex justify-content-center'>
          <p>Welcome to the Dream Home. Here you can find your dream land. Dream Home help you to search what you want. Here you have a wide range of catagery for the land so that you can choose what you want not that others.</p>
        </div>
        <div className='flex flex-col w-full'>
          <div className='flex w-full font-medium'>
            <button className={`flex py-2 px-3 border-r-0 border-b-0 border-t-2 border-l-2 border-black rounded-tl-lg hover:bg-gray-200 ${search.type === 'buy' ? "bg-black text-white" : ""}`} onClick={handleBuyButton}>Buy</button>
            <button className={`flex py-2 px-3 border-l-0 border-b-0 border-t-2 border-r-2 border-black rounded-tr-lg hover:bg-gray-200 ${search.type === 'rent' ? "bg-black text-white" : ""}`} onClick={handleRentButton}>Rent</button>
          </div>
          <div className='flex justify-between border-2 border-black w-full rounded-b-lg rounded-tr-lg'>
            <div className='flex  xl:w-max lg:w-36 md:w-32 sm:w-36 w-24'>
              <input className='flex p-2 bg-inherit xl:w-full lg:w-36 md:w-32 sm:w-36 w-24' type='text' id='city' name='city' onChange={handleSearch} value={search.city} placeholder='city' />
            </div>
            <div className='flex xl:w-max lg:w-36 md:w-32 sm:w-36 w-24'>
              <input className=' flex p-2 bg-inherit xl:w-full lg:w-36 md:w-32 sm:w-36 w-24' type='number' id='minPrice' name='minPrice' onChange={handleSearch} value={search.minPrice} placeholder='Min Price' />
            </div>
            <div className='flex xl:w-max lg:w-36 md:w-32 sm:w-36 w-24'>
              <input className='flex p-2 bg-inherit xl:w-full lg:w-36 md:w-32 sm:w-36 w-24' type='number' id='maxPrice' name='maxPrice' onChange={handleSearch} value={search.maxPrice} placeholder='Max Price' />
            </div>
            <div className='flex justify-content-center items-center cursor-pointer py-2 px-3'>
              <i className='fa fa-search fa-lg' onClick={handleSearchButton} />
            </div>
          </div>
        </div>
        <div className='flex justify-center h-full w-full items-end pb-4'>
          <div className='flex justify-between w-full'>
            <div className='flex flex-col'>
              <p className='font-bold text-2xl'>15+</p>
              <p>Years of Experience</p>
            </div>
            <div className='flex flex-col'>
              <p className='font-bold text-2xl'>20M+</p>
              <p>Users</p>
            </div>
            <div className='flex flex-col'>
              <p className='font-bold text-2xl'>20000+</p>
              <p>Property Ready</p>
            </div>
          </div>
        </div>
      </div>
      <div className='md:basis-4/12 md:flex md:bg-zinc-300 w-full h-full md:pt-2 md:p-0 p-10'>
        <img className='w-full rounded-lg' src='/images/homepage.png' alt='' />
      </div>
    </div>
  )
}
