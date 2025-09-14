import express from "express"
import authRoutes from "./routes/auth.routes.js"
import messageRoutes from "./routes/message.routes.js"
import dotenv from "dotenv"
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors"
import {app, server} from "./lib/socket.js"
dotenv.config();
const PORT = process.env.PORT;
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({extended: true, limit: "50mb"}));
app.use(cookieParser());
app.use(cors({
    origin: "https://web-chat-app-frontend-1z7a.onrender.com/",
    credentials: true
}));
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
server.listen(PORT, () => {
    console.log(`app is lintening at port ${PORT}`);
    connectDB();
});
