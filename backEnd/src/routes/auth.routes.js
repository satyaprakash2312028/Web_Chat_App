import express from "express"
import { login, logout, signup, updateProfile, checkAuth, sendOtp, verifyOtp, checkVerified } from "../controllers/auth.controller.js";
import { protectRoute, requiresVerified } from "../middleware/auth.middleware.js";
const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile", protectRoute, requiresVerified,  updateProfile);
router.get("/check", protectRoute, checkAuth);
router.get("/send-otp", protectRoute, sendOtp);
router.get("/checkVerified", protectRoute, requiresVerified, checkVerified);
router.post("/verify-otp", protectRoute, verifyOtp);
export default router;