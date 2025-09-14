import axios from "axios"
const axiosInstance = axios.create({
    baseURL: "https://web-chat-app-vfne.onrender.com",
    withCredentials: true
});
export default axiosInstance
