import React from 'react'
import { Link } from 'react-router-dom';

export default function PostCard(props) {
    const post = props.post;
    return (
        <div className='flex w-full gap-2'>
            <div className='md:flex hidden w-48 h-48 rounded-lg'>
                <img src={post.images[0]} alt='' />
            </div>
            <div className='flex flex-col gap-3'>
                <div className='flex w-full text-1xl font-bold'>
                    {post.title}
                </div>
                <div className='flex gap-2 w-full text-lg'>
                    <i className="fa-solid fa-location-dot"></i>
                    <Link to='/'>{post.address.city} {post.address.state} {post.address.country}</Link>
                </div>
                <div className='flex w-full text-xl font-medium'>
                    ${post.price}
                </div>
                <div className='flex w-full md:justify-between md:flex-row flex-col'>
                    <div className='flex gap-2'>
                        <div className='flex'>
                            <i className="fa-solid fa-bed"></i>
                            <span>{post.bedrooms} bedroom</span>
                        </div>
                        <div className='flex'>
                            <i className="fa-solid fa-bath"></i>
                            <span>{post.bathrooms} bathroom</span>
                        </div>
                    </div>
                    <div className='flex gap-2'>
                        <div className='flex'>
                            <i className="fa-regular fa-bookmark"></i>
                        </div>
                        <div className='flex'>
                            <i className="fa-regular fa-message"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
