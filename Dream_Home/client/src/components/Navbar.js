import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { selectUserInfo } from '../redux/slices/userInfoSlice';

export default function Navbar() {
  const userInfo = useSelector(selectUserInfo);
  const navigate = useNavigate();
  const [menu, setMenu] = useState(false);

  const handleMenuIcon = () => {
    if (menu) {
      setMenu(false);
    }
    else {
      setMenu(true);
    }
  }

  const handleProfile = () => {
    navigate(`/${userInfo?._id}/profile`)
  }
  return (
    <div className='flex w-full h-full md:px-4'>
      <div className='basis-6/12 md:basis-8/12 flex w-full pt-4'>
        <div className='xl:basis-4/12 md:basis-5/12 md:flex justify-content-end w-full'>
          <div className='flex md:pl-0 pl-8 pr-4 text-3xl text-lime-500 font-bold gap-3 cursor-pointer'>
            {/* <img className='w-10 h-10 flex rounded-full' src='/images/logo.png' alt='' />
            <div className='flex'> */}
              DreamHome
            {/* </div> */}
          </div>
        </div>
        <div className='xl:basis-8/12 md:basis-7/12 hidden md:flex xl:gap-x-7 md:gap-x-5 w-full items-end text-xl font-bold pl-2'>
          <Link to='/' className='cursor-pointer hover:text-lime-300'>Home</Link>
          <Link to='/about' className='cursor-pointer hover:text-lime-300'>About</Link>
          <Link to='/contact' className='cursor-pointer hover:text-lime-300'>Contacts</Link>
          <Link to='/agent' className='cursor-pointer hover:text-lime-300'>Agents</Link>
        </div>
      </div>
      <div className='md:basis-4/12 hidden md:flex justify-content-end items-end xl:gap-x-7 md:gap-x-5 w-full text-xl font-bold pr-2 bg-zinc-300'>
        {userInfo ?
          <div className='flex gap-2 items-center h-full'>
            <div className='flex p-2 h-full items-center'>
              {
                userInfo?.avatar ?
                  <div className='flex'>
                    <img className='w-10 h-10 rounded-full' src={userInfo?.avatar} alt='' />
                  </div>
                  : <i className='fa fa-user fa-lg' />
              }
            </div>
            <div className='flex font-bold px-3 py-2 cursor-pointer hover:bg-gray-200 rounded-xl' onClick={handleProfile}>
              {userInfo?.name}
            </div>
          </div>
          :
          <>
            <Link to='/login' className='cursor-pointer hover:text-lime-500'>Login</Link>
            <Link to='/signup' className='cursor-pointer hover:text-lime-500'>Sign Up</Link>
          </>
        }
      </div>
      <div className={`md:hidden flex ${menu ? "justify-between" : "items-center justify-content-end"} basis-6/12 w-1/2 pr-5`}>
        <div className='flex items-center justify-content-end w-full'>
          <i className={`fa-solid fa-bars fa-xl ${menu ? "hidden" : ""} cursor-pointer`} onClick={handleMenuIcon}></i>
          <i className={`fa-solid fa-xmark fa-xl pt-2 ${menu ? "" : "hidden"} cursor-pointer p-1 bg-white`} onClick={handleMenuIcon}></i>
        </div>
        <div className={`flex absolute top-16 ${menu ? "-right-0" : "-right-1/2 hidden"} transition-all ease-in-out duration-1000 delay-500 w-1/2 bg-black text-white h-full`}>
          <div className='flex flex-col gap-3 justify-center items-center w-full text-xl font-bold'>
            <Link to='/' className='cursor-pointer' onClick={handleMenuIcon}>Home</Link>
            <Link to='/about' className='cursor-pointer' onClick={handleMenuIcon}>About</Link>
            <Link to='/contact' className='cursor-pointer' onClick={handleMenuIcon}>Contacts</Link>
            <Link to='/agent' className='cursor-pointer' onClick={handleMenuIcon}>Agents</Link>
            {userInfo ?
              <div>
                <Link to={`/${userInfo?._id}/profile`} className='cursor-pointer' onClick={handleMenuIcon}>{userInfo?.name}</Link>
              </div>
              :
              <>
                <Link to='/login' className='cursor-pointer' onClick={handleMenuIcon}>Login</Link>
                <Link to='/signup' className='cursor-pointer' onClick={handleMenuIcon}>Sign Up</Link>
              </>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
