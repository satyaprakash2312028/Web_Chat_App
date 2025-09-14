import express from "express"
import { protectRoute, requiresVerified } from "../middleware/auth.middleware.js";
import { getUsersList, getMessages, sendMessage } from "../controllers/message.controller.js";
const router = express.Router();
router.get("/users", protectRoute, requiresVerified, getUsersList);
router.get("/:id", protectRoute, requiresVerified, getMessages);
router.post("/send/:id", protectRoute, requiresVerified, sendMessage);
export default router;