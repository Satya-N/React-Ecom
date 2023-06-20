const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');

const sendEmail = async(opt) => {
    const transporter = nodemailer.createTransport(
        nodemailerSendgrid({
            apiKey: process.env.SENDGRID_API_KEY
        })
    )

    const mailOptions = {
        from: process.env.SENDGRID_MAIL,
        to:  opt.email,
        subject: opt.subject,
        text:opt.message
    }

    await transporter.sendMail(mailOptions)
}

module.exports = sendEmail;