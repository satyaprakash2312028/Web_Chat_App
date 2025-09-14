import React from 'react'
import useChatStore from '../store/useChatStore.js'
import useAuthStore from '../store/useAuthStore.js'
import { X } from 'lucide-react';
const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  return (
    <><div className='absolute z-50 top-0 w-full bg-base-100/50 backdrop-blur-md p-3 h-fit pl-5 flex gap-4 items-center overflow-x-hidden border-b border-base-300 -translate-y-full sm:translate-y-0 transition-all duration-300'>
      <div className="min-w-10 size-10 rounded-full overflow-hidden">
        <img src={selectedUser.profilePic || "/avatar.png"} className='object-cover w-full h-full'/>
      </div>
      <div className=''>
        <p className='truncate mb-px font-semibold'>{selectedUser.fullName}</p>
        <p className={`truncate text-xs ${onlineUsers.includes(selectedUser._id) ? "text-green-500" : "text-primary-content/70"}`}>{onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}</p>
      </div>
    </div>
    <div className='absolute z-[100] right-2 top-4 ml-auto p-1 rounded-full hover:bg-base-300 bg-base-100/25 sm:bg-base-100/0 sm:backdrop-blur-0 backdrop-blur-md transition-all duration-300 max-h-fit aspect-square'>
      <button className='text-lg font-mono text-red-500' onClick={(e) => { setSelectedUser(null) }}><X /></button>
    </div>
    </>
  )
}

export default ChatHeader