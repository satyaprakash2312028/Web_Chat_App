import { create } from "zustand"
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client"
const BASE_URL = "https://web-chat-app-vfne.onrender.com";
const authStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    isSendingOtp: false,
    isVerifyingOtp: false,
    onlineUsers: [],
    socket: null,
    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
            if(get().authUser.isVerified) get().connectSocket();
        } catch (error) {
            set({ authUser: null });
            console.log("Error Occouring");
        } finally {
            set({ isCheckingAuth: false });
        }
    },
    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            try{
                if(!get().authUser.isVerified) await get().sendOtp();
            }catch(error){
                
            }finally{
                toast.dismiss();
                toast.success("Logged in successfully");
                if(get().authUser.isVerified) get().connectSocket();
            }
            
        } catch (error) {
            console.log("Error in login auth store", error);
            toast.dismiss();
            toast.error(error?.response?.data?.messsage||error.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },
    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            try{
                if(!get().authUser.isVerified) await get().sendOtp();
            }catch(error){
                
            }finally{
                toast.dismiss();
                toast.success("Account created succesfully");
            }
        } catch (error) {
            console.log("Error in signup auth store ", error.message);
            toast.dismiss();
            toast.error((error?.response?.data?.messsage+". Try logging in")||error.message);
        } finally {
            set({ isSigningUp: false });
        }
    },
    logout: async () => {
        try {
            await axiosInstance.post("auth/logout");
            set({ authUser: null });
            if(get().socket?.connected) get().disconnectSocket();
            toast.dismiss();
            toast.success("Logged out Successfully");
            
        } catch (error) {
            toast.dismiss();
            toast.error(error?.response?.data?.messsage||error.message);
        }

    },
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("auth/update-profile", data);
            set({ authUser: res.data });
            toast.dismiss();
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("Error while updating profile", error);
            toast.dismiss();
            toast.error(error?.response?.data?.message||error.message);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },
    sendOtp: async() => {
        set({isSendingOtp: true});
        try {
            const res = await axiosInstance.get("/auth/send-otp");
            set({authUser: res.data});
            toast.success("OTP sent successfully");
        } catch (error) {
            console.log(error);
            toast.dismiss();
            toast.error(error?.response?.data.message||error.measage);
        } finally{
            set({isSendingOtp: false})
        }
    },
    verifyOtp: async(data) => {
        set({isVerifyingOtp: true});
        try {
            const res = await axiosInstance.post("/auth/verify-otp", data);
            set({authUser: res.data});
            toast.dismiss();
            toast.success("Email verified successfully");
            if(get().authUser.isVerified) get().connectSocket();
        } catch (error) {
            console.log(error);
            toast.dismiss();
            toast.error(error?.response?.data.message||error.measage);
        }finally{
            set({isVerifyingOtp: false});
        }
    },
    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;
        const socket = io(BASE_URL, {
            query:{
                userId: authUser._id
            }
        });
        socket.connect();
        set({socket:socket});
        socket.on("getOnlineUsers", (usersIds)=>{
            set({onlineUsers:usersIds});
            
        })
    },
    disconnectSocket: () => {
        if(get().socket?.connected) get().socket.disconnect();
    }
}));

export default authStore;
