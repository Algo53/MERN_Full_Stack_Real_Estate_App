import React from 'react'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'

export default function NormalLayout() {
  return (
    <div className='flex flex-col w-full h-svh'>
        <div className='flex w-full'>
            <Navbar />
        </div>
        <div className='flex w-full h-full'>
            <Outlet />
        </div>
    </div>
  )
}
