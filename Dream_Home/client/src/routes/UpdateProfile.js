import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { selectUserInfo, UpdateUserRoute } from '../redux/slices/userInfoSlice';
import { UploadFile } from '../components/Clouduploader';

export default function UpdateProfile() {
  const userInfo = useSelector(selectUserInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDisabled, setIsDisabled] = useState(true);
  const [userDetails, setUserDetails] = useState({
    name: userInfo?.name || '',  // Provide default values (empty strings)
    email: userInfo?.email || '',
    role: userInfo?.role || 'buyer',  // Default to 'buyer' or 'owner' if applicable
    avatar: userInfo?.avatar || '',
    phoneNumber: userInfo?.phoneNumber || ''
  })
  const handleAvatar = async (e) => {
    const file = e.target.files[0];
    const upFile = await UploadFile(file);

    setUserDetails((prev) => {
      return {
        ...prev,
        avatar: upFile.secure_url
      }
    })
  }

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  }

  const handleUpdateForm = (e) => {
    e.preventDefault();
    dispatch(UpdateUserRoute({ id: userInfo?._id, payload: userDetails }));
    navigate(`/${userInfo?._id}/profile`);
  }

  useEffect( () => {
    if (userDetails.name === userInfo.name && userDetails.email === userInfo.email && userDetails.phoneNumber === userInfo.phoneNumber)
      setIsDisabled(true);
    else setIsDisabled(false);
  }, [userDetails])

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [userInfo])

  return (
    <div className='flex md:flex-row flex-col w-full h-full h-svh md:px-4'>
      <div className='md:basis-8/12 flex w-full h-full flex-col py-4 xl:pl-44 lg:pl-36 md:pl-20 pl-5 lg:pr-10 pr-5 py-5 gap-4'>
        <form className='flex flex-col gap-4 md:px-0 sm:px-30 px-8 w-full h-full' onSubmit={handleUpdateForm}>
          <div className='flex items-center gap-2'>
            <div className='flex text-xl font-bold'>Avatar : </div>
            <div className='flex items-center justify-content-center rounded-full w-10 h-10'>
              {
                userInfo?.avatar ?
                  <img src={userInfo?.avatar} alt='' />
                  :
                  <i className='fa fa-user fa-lg' />
              }
            </div>
            <div className='flex justify-content-center items-center'>
              <input className='flex w-[6.3rem]' type='file' id='avatar' name='avatar' value={""} onChange={handleAvatar} />
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <div className='flex text-xl font-bold'>Name : </div>
            <div className='flex '>
              <input className="p-2 rounded-lg border-none" type='text' id='name' name='name' value={userDetails?.name} onChange={handleChange} />
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <div className='flex text-xl font-bold'>Email : </div>
            <div className='flex '>
              <input className="p-2 rounded-lg border-none" type='text' id='email' name='email' value={userDetails?.email} onChange={handleChange} />
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <div className='flex text-xl font-bold'>Phone Number : </div>
            <div className='flex '>
              <input className="p-2 rounded-lg border-none" type='number' id='phoneNumber' name='phoneNumber' value={userDetails?.phoneNumber} onChange={handleChange} />
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <div className='flex text-xl font-bold'>Use app as : </div>
            <div className='flex '>
              <select className="p-2 rounded-lg border-none" type='number' id='role' name='role' value={userDetails?.role} onChange={handleChange}>
                <option value="buyer">Buyer</option>
                <option value="owner">Owner</option>
              </select>
            </div>
          </div>
          <div className='flex gap-4'>
            <Link className='flex border-black border-2 p-2 px-3 rounded-lg hover:bg-gray-200' to={`/${userInfo?._id}/profile`}>Back</Link>
            <button className='flex border-black border-2 p-2 rounded-lg hover:bg-gray-200' type='submit' disabled={isDisabled}>Update</button>
          </div>
        </form>
      </div>
      <div className='md:basis-4/12 md:flex hidden md:bg-zinc-300 w-full h-full md:pt-2 md:p-0 p-10'>
        <img className='w-full rounded-lg' src='/images/homepage.png' alt='' />
      </div>
    </div>
  )
}
