import React, { useEffect, useRef, useState } from 'react'
import useChatStore from '../store/useChatStore';
import { Image, Loader2, Send, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { compressImage } from '../utilities/blobCompressor';
const MessageInput = () => {
    const [text, setText] = useState("");
    const [chatImage, setChatImage] = useState(null);
    const fileInput = useRef(null);
    const { sendMessage, isSendingMessages } = useChatStore();
    useEffect(() => {
        return () => {
            if (chatImage) URL.revokeObjectURL(chatImage);
        };
    }, [chatImage]);
    const handleImageChange = async(e) => {
        const file = e.target.files[0];
        try {
            if(!file.type.startsWith("image/")){
                toast.dismiss();
                return toast.error("Please select an image file");
            }
            const compressedBlob = await compressImage(file, 0.5, 0.6);
            console.log("Compressed size:", compressedBlob.size / 1024, "KB");
            const reader = new FileReader();
            reader.onloadend = ()=>{
                setChatImage(reader.result);
            };
            reader.readAsDataURL(compressedBlob);
            // setChatImage(previewUrl);

        } catch (error) {
            
        }
    };
    const removeImage = (e) => {
        setChatImage(null);
        if(fileInput.current) fileInput.current.value = "";
    };
    const handleSendMessage = async(e) => {
        e.preventDefault();
        if(!text.trim()&&!chatImage) return;
        try {
            if(fileInput.current) fileInput.current.value = "";
            await sendMessage({
                text: text.trim(),
                image: chatImage
            });
            setText("");
            setChatImage(null);
            
        } catch (error) {
            console.log(error);
            toast.dismiss();
            toast.error(error?.response?.data?.message||error.message);
        }
    };
    return (
        <div className='absolute bottom-0 w-full p-3 h-fit transition-all duration-300 border-t border-base-300 bg-base-100/50 backdrop-blur-md flex flex-col justify-start gap-2' >
            {/* Image Preview */}
            {chatImage && (
                <>
                    <div className='relative w-fit'>
                        <img src={chatImage} className='h-36 rounded-md'/>
                        <div className='absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 aspect-square rounded-full bg-base-300 flex justify-center items-center'>
                            <button className={`size-fit p-0.5 ${isSendingMessages?"hidden":"block"} transition-all duration-300`} onClick={removeImage} disabled={isSendingMessages}><X className={`size-4`}/></button>
                        </div>
                    </div>
                </>
            )}

            {/* Text and Image Input */}
            <form onSubmit={handleSendMessage} className='w-full flex items-center gap-3'>
                <input className='input input-bordered flex-1 w-full text-sm focus:outline-dashed transition-all duration-300' type="text" placeholder='Text Message Here...' onChange={(e) => { setText(e.target.value) }} value={text} />
                <input type="file" className='hidden' ref={fileInput} accept='image/*' onChange={handleImageChange}/>
                <button type="button" className={`btn ${chatImage ? "text-primary" : ""}`} onClick={() => fileInput?.current.click()} ><Image size="20" /></button>
                <button type="submit" className='btn btn-primary' disabled={(!text.trim() && !chatImage)||isSendingMessages}>{(!isSendingMessages||!chatImage)?<Send size="20"/>:<Loader2 className='animate-spin'/>}</button>
            </form>
        </div>
    )
}

export default MessageInput