const nodemailer = require("nodemailer");
const emailCredentials = require("../config/emailCredentials");

exports.transporter = nodemailer.createTransport({
    service: "gmail",
    // host: "smtp.gmail.com",
    // port: 587,
    // secure: false,
    auth: {
        user: emailCredentials.email,
        pass: emailCredentials.password
    },
});
