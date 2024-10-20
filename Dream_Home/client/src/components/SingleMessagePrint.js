import React, { useEffect, useRef, useState } from 'react'
import { selectUserInfo } from '../redux/slices/userInfoSlice';
import { useSelector } from 'react-redux';

export default function SingleMessagePrint({ chatData }) {
  const userInfo = useSelector(selectUserInfo);
  const chatEndRef = useRef(null);  // TO track the end of the chat
  const [messages, setMessages] = useState([])

  // Scroll to the bottom whenever chatData updates
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    setMessages([...chatData]); // Force new reference to trigger re-render
    
    scrollToBottom(); // Scroll when messages update
  }, [chatData])

  return (
    <>
      {
        messages.map((item, index) => (
          <div key={index} className={`flex w-full ${item?.sender === userInfo?._id ? "justify-end" : ""}`}>
            <div className={`flex basis-6/5 w-full ${item?.sender === userInfo?._id ? "justify-end" : ""}`}>{item.chat}</div>
          </div>
        ))
      }
      <div ref={chatEndRef} /> {/* Invisible div to mark the bottom */}
    </>
  )
}
