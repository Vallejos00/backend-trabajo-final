import nodemailer from "nodemailer"


let transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.user,
    pass: process.env.pass,
  },
});


export default transporter