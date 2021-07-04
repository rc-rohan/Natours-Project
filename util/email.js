const nodemailer = require('nodemailer');

const sendEmail = options =>{
  // 1. Create the transporter
  const trasporter = nodemailer.createTransport({
    host:process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    //Activate the gmail "less secure app option"

  });
  // 2. Define the emial options

  // 3. Actually send the email with the nodemailer
}