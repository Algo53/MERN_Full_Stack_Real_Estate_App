import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { FindSellerDetails, selectSellerInfo } from '../redux/slices/userInfoSlice';
import { GetSingleUserChat, selectConversation, selectProperty } from '../redux/slices/chatSlice';
import SinglePropertyMessageIcon from './SinglePropertyMessageIcon';

export default function ConversationIcon({ userId, setUser}) {
    const sellerInfo = useSelector(selectSellerInfo);
    const conversation = useSelector(selectConversation);
    const property = useSelector(selectProperty);
    const dispatch = useDispatch();
    const [info, setInfo] = useState({
        avatar: '',
        name: "username"
    });
    const [mode, setMode] = useState(false);
    const [clickPro, setClickProperty] = useState(false);

    const handleClick = () => {
        if (mode) {
            setMode(false);
        }
        else {
            setMode(true);
            dispatch(GetSingleUserChat({friendId : info?._id}));
        }
    }

    useEffect(() => {
        dispatch(FindSellerDetails({ id: userId}));
    }, [])

    useEffect(() => {
        setInfo(sellerInfo);
    }, [sellerInfo])

    return (
        <div className='flex flex-col w-full'>
            <div className={`flex bg-black ${mode ? "rounded-t-lg" : "rounded-lg"} text-white lg:px-3 md:px-2 px-4 py-3 lg:gap-3 md:gap-2 gap-3`}>
                <div className='flex items-center' >
                    {
                        info?.avatar ?
                            <img className="rounded-full w-8 h-8" src={info?.avatar} alt='' />
                            :
                            <i className='fa fa-user fa-lg' />
                    }
                </div>
                <div onClick={handleClick} className='flex items-center font-bold cursor-pointer'>{info?.name || "username"}</div>
            </div>
            <div className={`${mode ? "flex" : "hidden"} flex-col bg-white lg:px-3 md:px-2 px-4 py-3 gap-3`}>
                {
                    conversation?.map( (item, index) => (
                        <SinglePropertyMessageIcon info={item} key={index} setPro={setClickProperty} friend={info}/>
                    ))
                }
            </div>
        </div>
    )
}
