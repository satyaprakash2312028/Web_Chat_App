import React, { useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import HomePage from './components/pages/HomePage.jsx'
import SignUpPage from './components/pages/SignUpPage.jsx'
import LoginPage from './components/pages/LoginPage.jsx'
import ProfilePage from './components/pages/ProfilePage.jsx'
import SettingsPage from './components/pages/SettingsPage.jsx'
import authStore from "./store/useAuthStore.js"
import themeStore from "./store/useThemeStore.js"
import { Routes, Route, Navigate } from 'react-router-dom'
import { Loader } from "lucide-react"
import { Toaster } from 'react-hot-toast'
import useChatStore from './store/useChatStore.js'
import VerificationPage from './components/pages/VerificationPage.jsx'
const App = () => {
  const {authUser, checkAuth, isCheckingAuth, onlineUsers} = authStore();
  const {getUsers} = useChatStore();
  const {theme} = themeStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  if(isCheckingAuth){
    return (
      <div className="flex items-center justify-center h-screen" data-theme={theme}>
        <span className="loading loading-infinity size-16"></span>
      </div>
    );
  }
  return (
    <div data-theme={theme} className='h-screen min-h-fit overflow-scroll scrollbar-hide'>
      <Navbar/>
      <Routes>
        <Route path='/' element={authUser?(authUser.isVerified?<HomePage/>:<Navigate to='/verify-email'/>):<Navigate to='/login'/>}/>
        <Route path='/signup' element={!authUser?<SignUpPage/>:(authUser.isVerified?<Navigate to='/'/>:<Navigate to='/verify-email'/>)}/>
        <Route path='/login' element={!authUser?<LoginPage/>:(authUser.isVerified?<Navigate to='/'/>:<Navigate to='/verify-email'/>)}/>
        <Route path='/settings' element={<SettingsPage/>}/>
        <Route path='/profile' element={authUser?(authUser.isVerified?<ProfilePage/>:<Navigate to='/verify-email'/>):<Navigate to='/login'/>}/>
        <Route path='/verify-email' element={authUser?(authUser.isVerified?<Navigate to='/'/>:<VerificationPage/>):<Navigate to='/login'/>}/>
      </Routes>
      <Toaster toastOptions={
        {
          className:"bg-primary"
        }
      }/>
    </div>
  );
}

export default App