import React  from 'react'
import { useDispatch,} from 'react-redux';
import { addConversationDetails, addProperty } from '../redux/slices/chatSlice';

export default function SinglePropertyMessageIcon({info, setPro, friend}) {
    const dispatch = useDispatch();
    const post = info.property;
    console.log(info)
    const handleClick = () => {
        setPro(true);
        dispatch(addConversationDetails({
          property_id : post._id,
          friend_id : friend
        }))
    }
    
  return (
    <div className='flex w-full h-full hover:bg-gray-100 p-1 rounded-lg cursor-pointer' onClick={handleClick}>
        <div className='flex'>{post?.title}</div>
        {/* <div className='flex rounded-xl h-5 w-5 flex-end'>
          <img src='' alt=' ' />
        </div> */}
    </div>
  )
}
