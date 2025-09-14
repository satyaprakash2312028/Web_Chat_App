import React from 'react'
import { Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore.js"
import useChatStore from '../store/useChatStore.js';
import { LogOut, MessageSquare, MessageSquareMore, Plus, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const {clearData} = useChatStore();
  const handleLogout = () => {
    try {
      logout();
      clearData();
    } catch (error) {
      console.log("data not cleared");
    }
    
    
  };
  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full none-96 top-0 z-40 
    backdrop-blur-md  bg-base-100/55 transition-all duration-200"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-60 transition-all">
              <div className="size-9 rounded-lg flex items-center justify-center">
                <MessageSquareMore className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Chatty</h1>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={"/settings"}
              className={`
              btn btn-sm gap-2 transition-colors
              `}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button className="flex gap-2 items-center" onClick={handleLogout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
            {!authUser && (
              <>
                <Link to={"/login"} className={`btn btn-sm gap-2`}>
                  <User className="size-5" />
                  <span className="hidden sm:inline">Login</span>
                </Link>

                <Link className="flex gap-2 items-center" to='/signup'>
                  <Plus className="size-5" />
                  <span className="hidden sm:inline">Signup</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
