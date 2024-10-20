import React from 'react'
import {MapContainer, TileLayer} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MapMarker from './MapMarker';

export default function Map({posts}) {
    const allPost = posts;
    const x = allPost[0] ? allPost[0].address.latitude : 51.505;
    const y = allPost[0] ? allPost[0].address.longitude : -0.09;

    return (
        <div className='flex w-full h-full'>
            <MapContainer center={[x, y]} zoom={6} scrollWheelZoom={false} className='w-full h-full rounded'>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {   
                    allPost ?  (
                            allPost.map( (item) => 
                                <MapMarker key={item?._id} item={item}/>
                            )
                        )
                        :
                        <></>
                }
            </MapContainer>

        </div>
    )
}
