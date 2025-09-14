import React from 'react'
import useChatStore from '../store/useChatStore.js'
import useAuthStore from '../store/useAuthStore.js'
import SidebarSkeleton from './Skeletons/SidebarSkeleton.jsx';
import { useEffect } from 'react';
import { User, Users } from 'lucide-react';
const Sidebar = () => {
  const { selectedUser, setSelectedUser, users, getUsers, isUsersLoading } = useChatStore();
  const {onlineUsers} = useAuthStore();
  if (isUsersLoading) return (
    <SidebarSkeleton />
  );
  return (
    <aside className='h-full w-20 lg:w-72 shrink-0 border-r border-base-300 flex flex-col transition-all duration-200'>
      <div className='w-full p-5'>
        <div className='flex items-center lg:justify-start justify-center gap-2'>
          <Users className='size-6' />
          <span className='font-medium hidden lg:block transition-all duration-200'>Contacts</span>
        </div>
        {/* {online filter toggle} */}
      </div>
      <div className='overflow-y-auto w-full py-0 overflow-x-hidden h-full flex flex-col gap-0'>
        {users.map((user) => (
          <button key={user._id} onClick={(e)=>{setSelectedUser(user)}}>
            <div className={`w-full p-2 flex gap-1.5 items-centers ${user._id === selectedUser?._id ? "bg-base-300" : "hover:bg-base-200/75"}`}>
              {/* Avatar skeleton */}
              <div className="relative mx-auto lg:mx-2">
                <div className=" size-12 rounded-full relative overflow-hidden">
                  <img src={user.profilePic || "/avatar.png"} className='object-cover h-full w-full'/>
                </div>
                <div className={`absolute top-0 right-0 translate-x-0.5 -translate-y-0.5 bg-green-500 ${user._id === selectedUser?._id ?"border-base-300":"border-base-100"} border-2 size-3.5 rounded-full ${onlineUsers.includes(user._id)?"block":"hidden"}`}></div>
              </div>

              {/* User info skeleton - only visible on larger screens */}
              <div className="hidden lg:block my-auto text-left min-w-0 overflow-hidden h-fit">
                <div className="w-full truncate">
                  <p className='truncate text-sm font-semibold'>{user.fullName}</p>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  )
}

export default Sidebar