import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import transporter from "./nodemailer.js";
import { verificationEmailTemplate } from "../constants/verificationEmailTemplate.js";
dotenv.config();
const generateToken = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
    res.cookie("jwt", token, {
        maxAge: 24*60*60*1000,
        httpOnly: true,
        sameSite: "none",
        secure: process.env.NODE_ENV !== "development"
    });
    return token;
};

const mailer = (recieverEmail, otp) => {
    transporter.sendMail({
        from: "Web Chat App <swadeshiCreator@gmail.com>",
        to: recieverEmail,
        subject: "Verify your E-mail",
        html: verificationEmailTemplate.replace(" OTP_HERE ", ' '+otp+' ')
    })
};
export  {mailer, generateToken};
