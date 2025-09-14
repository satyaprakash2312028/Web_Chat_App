import {create} from "zustand"
import toast from "react-hot-toast"
import axiosInstance from "../lib/axios"
import axios from "axios";
import useAuthStore from "./useAuthStore.js";

const useChatStore = create((set,get)=>({
    messages:[],
    users:[],
    selectedUser:null,
    isUsersLoading:false,
    isMessagesLoading:false,
    isSendingMessages:false,
    getUsers: async() => {
        set({isUsersLoading:true});
        try {
            const res = await axiosInstance.get("/messages/users");
            set({users: res.data});
            console.log(res.data);
        } catch (error) {
            toast.dismiss();
            toast.error(error.response?.data?.message);
        }finally{
            set({isUsersLoading:false});
        }
    },
    getMessages: async(userId) => {
        set({isMessagesLoading:true});
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({messages: res.data});
        } catch (error) {
            toast.dismiss();
            toast.error(error.response.data.message);
        }finally{
            set({isMessagesLoading:false});
        }
    },
    sendMessage: async(data) => {
        set({isSendingMessages:true})
        const {selectedUser, messages} = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, data);
            set({messages:[...messages, res.data]});
        } catch (error) {
            toast.dismiss();
            toast.error(error?.response?.data?.message||error.message);
        }finally{
            set({isSendingMessages:false})
        }
    },
    subscribeToMessages: () => {
        const {selectedUser} = get();
        if(!selectedUser) return;
        const socket = useAuthStore.getState().socket;

        //todo: optimizing it later

        socket.on("newMessage", (newMessage) => {
             if(newMessage.senderId===selectedUser._id) set({messages :[...get().messages, newMessage]});
        });
    },
    unsubscribeFromMessage: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },
    setSelectedUser: (selectedUser) => {
        set({selectedUser});
    },
    clearData: () => {
        set({
            messages: [],
            users: [],
            selectedUser:null,
            isUsersLoading:false,
            isMessagesLoading:false,
        });
    }
}));
export default useChatStore;