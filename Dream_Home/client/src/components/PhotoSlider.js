import React, { useState } from 'react'

export default function PhotoSlider({ setPhotoSlider, img}) {
    const [index, setIndex] = useState(0)
    
    const handleBackward = () => {
        if (index === 0) setIndex(img.length - 1)
        else setIndex(index - 1);
    }

    const handleForward = () => {
        if (index === (img.length - 1)) setIndex(0)
        else setIndex(index + 1)
    }

    const handleCutSlider = () => {
        setPhotoSlider(false)
    }


    return (
        <div className='flex gap-5 gap-2 z-50 w-full w-lvw h-dvh p-4'>
            <div className='flex h-full items-center'><i className="fa-solid fa-angle-left fa-2xl px-1 py-3 bg-white rounded-lg cursor-pointer" onClick={handleBackward} /></div>
            <div className='flex w-full h-full justify-center'><img src={img[index]} alt='' /></div>
            <div className='flex flex-col h-full items-center pr-5'>
                <div className='flex w-full justify-end pt-4'><i className="fa-solid fa-square-xmark fa-2xl px-1 py-3 bg-white rounded-lg cursor-pointer" onClick={handleCutSlider} /></div>
                <div className='flex h-full pb-5'>
                    <div className='flex items-center'><i className="fa-solid fa-angle-right fa-2xl px-1 py-3 bg-white rounded-lg cursor-pointer" onClick={handleForward} /></div>
                </div>
            </div>
        </div>
    )
}
