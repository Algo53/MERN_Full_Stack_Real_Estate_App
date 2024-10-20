import React from 'react'

export default function AboutPage() {
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
          About the company
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
