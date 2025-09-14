import React, { useEffect, useRef } from 'react'
import useChatStore from '../store/useChatStore.js'
import useAuthStore from '../store/useAuthStore.js'
import ChatHeader from './ChatHeader.jsx'
import MessageInput from './MessageInput.jsx'
import MessageSkeleton from './Skeletons/MessageSkeleton.jsx'

const ChatSelected = () => {
  const { selectedUser, messages, getMessages, isMessagesLoading, subscribeToMessages, unsubscribeFromMessage } = useChatStore();
  const { authUser } = useAuthStore();
  const messageBoxRef = useRef(null);
  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessage();
  }, [getMessages, selectedUser._id, subscribeToMessages, unsubscribeFromMessage]);
  useEffect(()=>{
    if(messageBoxRef.current&&messages) messageBoxRef.current.scrollIntoView({behavior:"smooth"})
  },[messages]);
  return (
    <div className='w-full h-full relative flex flex-col justify-end'>
      <ChatHeader />
      {(isMessagesLoading) ? (<MessageSkeleton />) : (

        <div className="p-4 space-y-4 h-fit overflow-y-scroll scrollbar-hide">
          <div className='w-full h-0 sm:h-14 transition-all  duration-300'></div>
          {messages.map((message) => (
            <div key={message._id} ref={messageBoxRef} className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}>
              <div className={`chat-bubble w-fit pl-1 pr-1 pt-1 max-w-80 h-fit text-sm transition-all duration-300 ${message.image?"rounded-t-md min-w-64 ":""} ${!message.text?" rounded-b-md pb-1":""}`}>
                  {message.image && (
                    <img src={message.image} className='max-h-96 rounded-md object-contain' loading='eager'/>
                  )}
                  {message.text && (
                    <p className='break-words py-2 px-2 h-fit'>{message.text}</p>
                  )}
                
              </div>
            </div>
          ))}
          <div className='w-full h-16 transition-all  duration-300'></div>
        </div>

      )}

      <MessageInput />
    </div>
  );
}

export default ChatSelected