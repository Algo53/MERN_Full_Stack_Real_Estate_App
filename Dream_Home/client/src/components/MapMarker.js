import React from 'react'
import { Marker, Popup } from 'react-leaflet'
import { Link } from 'react-router-dom';

export default function MapMarker({item}) {
    // Provide a fallback position if latitude or longitude is null or undefined
    const pst = item ? [item.address.latitude, item.address.longitude] : [51.505, -0.09];
    return (
        <Marker position={pst}>
            <Popup>
                <div className='flex w-full h-20 gap-2 p-0'>
                    <img className='w-16 h-20 rounded-lg' src={item.images[0]} alt='' />
                    <div className='flex flex-col'>
                        <Link to={`/property/${item._id}`} className='flex'>{item.title}</Link>
                        <span className='flex'>{item.bedrooms} bedrooms</span>
                        <b>$ {item.price}</b>
                    </div>
                </div>
            </Popup>
        </Marker>
    )
}
