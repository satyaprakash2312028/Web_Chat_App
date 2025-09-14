import React, { useEffect } from 'react'
import useChatStore from '../../store/useChatStore.js';
import Sidebar from '../Sidebar.jsx';
import NoChatSelected from '../NoChatSelected.jsx';
import ChatSelected from '../ChatSelected.jsx';
const HomePage = () => {

  const { selectedUser, getUsers } = useChatStore();
  useEffect(()=>{
    getUsers();
  }, [getUsers]);
  return (
    <div className="h-screen bg-base-200" >
      <div className='flex items-center justify-center pt-20 px-4'>
        <div className='bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]'>
          <div className='flex h-full rounded-lg overflow-hidden w-full transition-all duration-300'>
            <Sidebar />
            {
              (selectedUser ? <ChatSelected />:<NoChatSelected />)
            }
          </div>
        </div>
      </div>
    </div>
  )
};

export default HomePage