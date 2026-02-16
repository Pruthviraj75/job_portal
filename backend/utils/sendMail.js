import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, //app password generated from Gmail settings
    },
});

export const sendMailApplication = async ({
    to,
    userName,
    jobTitle,
    companyName,
}) => {
   await transporter.sendMail({
    from: `"JobConnect" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Application Submitted Successfully`,
    html: `
       <h2>Hi ${userName},</h2>
       <p>Thank you for applying for the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.</p>
       <p>We have received your application and will review it shortly.</p>
       <p>Best regards,<br>${companyName} HR Team</p>
    `,
   });
};