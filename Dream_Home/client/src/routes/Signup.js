import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { GetUserDetails, RegisterRoute, selectUserInfo, selectUserOnline } from '../redux/slices/userInfoSlice';
import { GetUserPosts, GetUserSavedPost } from '../redux/slices/postSlice';

export default function Signup() {
  const userOnline = useSelector(selectUserOnline);
  const userInfo = useSelector(selectUserInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [details, setDetails] = useState({
    name: "",
    email: "",
    password: ""
  })

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  }

  const handleSignUpForm = (e) => {
    e.preventDefault();
    dispatch(RegisterRoute(details));
    setDetails((prev) => {
      return {
        ...prev,
        name: "",
        email: "",
        password: ""
      }
    })
  }

  const handleGoogleLogin = () => {
    window.location.href = process.env.REACT_APP_BACKEND_GOOGLE_URL;
  }
  
  const handleLinkedinLogin = () => {

  }

  useEffect(() => {
    if (userOnline) {
      dispatch(GetUserDetails());
      if (userInfo) {
        dispatch(GetUserPosts());
        dispatch(GetUserSavedPost());
        navigate(`/${userInfo._id}`);
      }
    }
  }, [userOnline, userInfo]);


  return (
    <div className='flex justify-content-center items-center w-full h-full md:px-4'>
      <div className='basis-6/12 md:basis-8/12 flex items-center justify-content-center w-full h-full'>
        <div className='flex flex-col justify-content-center h-max p-5 gap-4 bg-sky-100 rounded-lg'>
          <div className='flex flex-col font-bold text-3xl'>
            <p className='flex justify-content-center'>Welcome to</p>
            <p className='flex justify-content-center'>Dream Home</p>
          </div>
          <div className='flex flex-col gap-1 w-full'>
            <div className='flex w-full'>
              <input className='p-2 w-full' type='text' id='name' name='name' onChange={handleChange} value={details.name} placeholder='Name' />
            </div>
            <div className='flex w-full'>
              <input className='p-2 w-full' type='email' id='email' name='email' onChange={handleChange} value={details.email} placeholder='Email' />
            </div>
            <div className='flex w-full'>
              <input className='p-2 w-full' type='text' id='password' name='password' onChange={handleChange} value={details.password} placeholder='Password' />
            </div>
            <div className='flex w-full pt-2 justify-content-center'>
              <button type='submit' onClick={handleSignUpForm} disabled={details.email && details.password ? false : true} className={`text-xl font-bold ${details.email && details.password ? "bg-sky-200 rounded-lg px-1" : ""}`}>Signup</button>
            </div>
            <div className='flex flex-col justify-content-center w-full'>
              <p className='flex justify-content-center w-full font-medium'>Already have an Account ?</p>
              <Link to='/login' className='flex justify-content-center w-full cursor-pointer hover:text-lime-400 italic underline-offset-2 underline'>Login</Link>
            </div>
            <div className='flex w-full pt-4 justify-around'>
              <i className="fa-brands fa-google fa-beat-fade fa-xl bg-white p-4 w-max rounded cursor-pointer hover:fa-bounce" style={{ class : '#f20791' }} onClick={handleGoogleLogin}/>
              <i className="fa-brands fa-linkedin fa-beat-fade fa-2xl bg-white p-4 w-max rounded cursor-pointer hover:fa-bounce" style={{ class : '#f20791' }} onClick={handleLinkedinLogin}/>
            </div>
          </div>
        </div>
      </div>
      <div className='md:basis-4/12 hidden md:flex md:bg-zinc-300 w-full h-full md:pt-2'>
        <img className='w-full rounded-lg' src='/images/signphoto.jpg' alt='' />
      </div>
    </div>
  )
}
