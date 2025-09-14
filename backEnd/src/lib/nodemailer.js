import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "swadeshiCreator@gmail.com",
    pass: "uhbklkdtmlzacfbk",
  },
});
export default transporter;