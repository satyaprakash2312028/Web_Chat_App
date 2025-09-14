import User from "../models/user.model.js";
import Message from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId } from "../lib/socket.js";
import { io } from "../lib/socket.js";
export const getUsersList = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const users = await User.find({_id: {$ne: loggedInUserId}}).select("-password");
        res.status(200).json(users);
    } catch (error) {
        console.log("Error in getUserList controller ", error);
        res.status(500).json({message: "Internal Server Error"});
    }
};
export const getMessages = async (req, res) => {
    try {
        const {id: userToChatId} = req.params;
        const myId = req.user._id;
        const messages = await Message.find({
            $or: [
                {senderId: myId, recieverId: userToChatId},
                {senderId: userToChatId, recieverId: myId},
            ]
        });
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessage controller ", error);
        res.status(500).json({message: "Internal Server Error"});
    }
};
export const sendMessage = async (req, res) => {
    try {
        const {text, image} = req.body;
        const {id: userToChatId} = req.params;
        const myId = req.user._id;
        const imageUrl = image?((await cloudinary.uploader.upload(image)).secure_url):null;
        const newMessage = new Message({
            senderId: myId,
            recieverId: userToChatId,
            text,
            image: imageUrl
        });
        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(userToChatId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
            console.log("message emitted");
        }
        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller ", error);
        res.status(500).json({message: error.message});
    }
};