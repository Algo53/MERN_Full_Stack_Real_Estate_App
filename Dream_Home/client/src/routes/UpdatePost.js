import React, { useEffect, useState } from 'react'
import { selectUserInfo } from '../redux/slices/userInfoSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import UploadWidget from '../components/Clouduploader';
import { updatePost } from '../redux/slices/postSlice';

export default function UpdatePost() {
  const locat = useLocation();
  const post = locat.state?.post.post;
  const userInfo = useSelector(selectUserInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [postDetails, setPostDetails] = useState({
    post_id : post._id,
    title: post.title,
    price: post.price,
    description: post.description,
    address: post.address,
    type: post.type,
    size: post.size,
    bedrooms: post.bedrooms,
    bathrooms: post.bathrooms,
    images: post.images,
    availableFrom: post.availableFrom,
    contactOwner: post.contactOwner,
    features: post.features
  })

  const [location, setLocation] = useState({
    latitude: post.address.latitude,
    longitude: post.address.longitude,
    street: post.address.street,
    city: post.address.city,
    state: post.address.state,
    zipCode: post.address.zipCode,
    country: post.address.country,
  })

  const handleAddress = (e) => {
    setLocation({ ...location, [e.target.name]: e.target.value });
  }

  const [propertyFeatures, setFeatures] = useState({
    gym: post.features.gym,
    school: post.features.school,
    parking: post.features.parking,
    pool: post.features.pool
  })

  const handleFeatures = (e) => {
    setFeatures({ ...propertyFeatures, [e.target.name]: e.target.value });
  }

  const [img, setImg] = useState(post.images);
  const handleChange = (e) => {
    setPostDetails({ ...postDetails, [e.target.name]: e.target.value });
  }

  const handlePostUpdateForm = async (e) => {
    e.preventDefault();

    // Construct the complete post data before dispatching
    const updatedPostDetails = {
      ...postDetails,
      features: propertyFeatures,  // Use the latest features
      address: location,           // Use the latest address
      images: img                  // Use the latest images
    };

    dispatch(updatePost(updatedPostDetails));

    navigate(`/${userInfo?._id}/profile`)
  }

  useEffect(() => {
    if (!userInfo) {
      navigate('/login')
    }
  }, [userInfo])

  return (
    <div className='flex md:flex-row flex-col w-full h-screen md:px-4 md:gap-0 gap-10'>
      <div className='md:basis-8/12 flex flex-col w-full py-10 md:overflow-scroll hide-scrollbar'>
        <div className='flex flex-col w-full gap-5 xl:pl-48 lg:pl-20 md:pl-15 sm:pl-30 pl-10 pr-10'>
          <div className='flex font-bold text-2xl justify-between'>
            <div>Update Post</div>
            <Link to={-1} className='flex py-4 px-2 rounded-lg border-black border-1 hover:bg-zinc-200 cursor-pointer'><i className="fa-solid fa-backward fa-xl"></i></Link>
          </div>
          <form onSubmit={handlePostUpdateForm} className='flex flex-col gap-4'>
            <div className='flex justify-between'>
              <div className='flex flex-col gap-1'>
                <label>Title</label>
                <input className='flex border-1 border-black p-2 md:w-42 lg:w-full w-full' type='text' name='title' id='title' onChange={handleChange} value={postDetails.title} />
              </div>
              <div className='flex flex-col gap-1'>
                <label>Price</label>
                <input className='flex border-1 border-black p-2 md:w-40 lg:w-full w-full' min={0} type='number' name='price' id='price' onChange={handleChange} value={postDetails.price || ""} />
              </div>
              <div className='flex flex-col gap-1'>
                <label>Type</label>
                <select className='flex border-1 border-black p-2' type='text' name='type' id='type' onChange={handleChange} value={postDetails.type}>
                  <option className="hidden" value=""></option>
                  <option value="appartement">Appartement</option>
                  <option value="house">House</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
            </div>
            <div className='flex flex-col gap-3'>
              <div className='flex font-medium'>Address</div>
              <div className='flex justify-between'>
                <div className='flex flex-col gap-1'>
                  <label>Latitude</label>
                  <input className='flex border-1 border-black p-2 w-full' type='number' name='latitude' id='latitude' onChange={handleAddress} value={location.latitude || ""} />
                </div><div className='flex flex-col gap-1'>
                  <label>Longitude</label>
                  <input className='flex border-1 border-black p-2 w-full' type='number' name='longitude' id='longitude' onChange={handleAddress} value={location.longitude || ""} />
                </div>
                <div className='flex flex-col gap-1'>
                  <label>Street</label>
                  <input className='flex border-1 border-black p-2 w-full' type='text' name='street' id='street' onChange={handleAddress} value={location.street} />
                </div>
                <div className='flex flex-col gap-1'>
                  <label>ZipCode</label>
                  <input className='flex border-1 border-black p-2 md:w-28 w-full' type='number' name='zipCode' id='zipCode' onChange={handleAddress} value={location.zipCode || " "} />
                </div>
              </div>
              <div className='flex justify-between'>
                <div className='flex flex-col gap-1'>
                  <label>City</label>
                  <input className='flex border-1 border-black p-2 w-full' type='text' name='city' id='city' onChange={handleAddress} value={location.city} />
                </div>
                <div className='flex flex-col gap-1'>
                  <label>State</label>
                  <input className='flex border-1 border-black p-2 w-full' type='text' name='state' id='state' onChange={handleAddress} value={location.state} />
                </div>
                <div className='flex flex-col gap-1'>
                  <label>Country</label>
                  <input className='flex border-1 border-black p-2 w-full' type='text' name='country' id='country' onChange={handleAddress} value={location.country} />
                </div>
              </div>
            </div>
            <div className='flex justify-between'>
              <div className='flex flex-col gap-1'>
                <label>Area</label>
                <input className='flex border-1 border-black p-2 w-full' min={0} type='number' name='size' id='size' onChange={handleChange} value={postDetails.size || ""} />
              </div>
              <div className='flex flex-col gap-1'>
                <label>Bedrooms</label>
                <input className='flex border-1 border-black p-2 w-full' min={0} type='number' name='bedrooms' id='bedrooms' onChange={handleChange} value={postDetails.bedrooms || ""} />
              </div>
              <div className='flex flex-col gap-1'>
                <label>Bathrooms</label>
                <input className='flex border-1 border-black p-2 w-full' min={0} type='number' name='bathrooms' id='bathrooms' onChange={handleChange} value={postDetails.bathrooms || ""} />
              </div>
              <div className='flex flex-col gap-1'>
                <label>ContactOwner</label>
                <select className='flex border-1 border-black p-2 w-full' type='number' name='contactOwner' id='contactOwner' onChange={handleChange} value={postDetails.contactOwner}>
                  <option className="hidden" value=""></option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>
            <div className='flex justify-between'>
              <div className='flex flex-col gap-1 w-full'>
                <label>Description</label>
                <input className='flex border-1 border-black p-2 w-full' type='text' id='description' name='description' onChange={handleChange} value={postDetails.description} />
              </div>
            </div>
            <div className='flex flex-col gap-2 '>
              <div className='flex font-medium'>Features</div>
              <div className='flex justify-between'>
                <div className='flex flex-col gap-1'>
                  <label>Nearset Gym (km)</label>
                  <input className='flex border-1 border-black p-2 w-full' min={0} type='number' id='gym' name='gym' onChange={handleFeatures} value={propertyFeatures.gym || ""} />
                </div>
                <div className='flex flex-col gap-1'>
                  <label>Nearset School</label>
                  <input className='flex border-1 border-black p-2 w-full' min={0} type='number' id='school' name='school' onChange={handleFeatures} value={propertyFeatures.school || ""} />
                </div>
                <div className='flex flex-col gap-1'>
                  <label>Parking</label>
                  <select className='flex border-1 border-black p-2' type='text' id='parking' name='parking' onChange={handleFeatures} value={propertyFeatures.parking}>
                    <option className="hidden" value=''></option>
                    <option value='true'>Yes</option>
                    <option value='false'>No</option>
                  </select>
                </div>
                <div className='flex flex-col gap-1'>
                  <label>Pool</label>
                  <select className='flex border-1 border-black p-2' type='text' id='pool' name='pool' onChange={handleFeatures} value={propertyFeatures.pool}>
                    <option className="hidden" value=''></option>
                    <option value='true'>Yes</option>
                    <option value='false'>No</option>
                  </select>
                </div>
              </div>
            </div>
            <div className='flex'>
              <button className='flex border-2 border-black p-2 hover:bg-gray-200 rounded-lg' type='submit'>Update Post</button>
            </div>
          </form>
        </div>
      </div>
      <div className='md:basis-4/12 flex flex-col items-center xl:gap-x-7 md:gap-x-5 w-full text-xl font-bold pr-2 py-5 bg-zinc-300 md:overflow-scroll hide-scrollbar'>
        <div className=''>
          {
            img.length ? (
              <div className='flex md:flex-col p-2 gap-2'>
                {
                  img.map((i) => (
                    <div className='flex w-40 h-40'>
                      <img key={i} src={i} alt='' />
                    </div>
                  )
                  )
                }
              </div>
            )
              : <></>
          }
        </div>
        <div className='flex h-full justify-content-center items-center'>
          <UploadWidget className="upload"
            uwConfig={{
              cloudName: "dyj6xolyl",
              uploadPreset: "estate",
              multiple: false,
              maxImageFileSize: 4000000,
              folder: "avatars"
            }}
            setState={setImg}
          />
        </div>
      </div>
    </div>
  )
}

