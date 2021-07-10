const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // try {
    /*
    We coulld have also used GMAIL as the servce type but using gmail for the develoment is not
    a good idea as gmail jsut allows 500mails per day

    so here we have ued some other developent service which just fakes to send the mail but
    in reality it these end up get trapped in between and are not sent
  */

    // 1. Create the transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      //Activate the gmail "less secure app option"
    });
    // 2. Define the emial options

    const mailOptions = {
      from: 'Tour and Tourism Teams <admin@gmail.com>',
      to: options.email,
      subject: options.subject,
      text: options.message,
      // html:    //can convert text message to HTML
    };

    // 3. Actually send the email with the nodemailer
    await transporter.sendMail(mailOptions);
  // } catch (error) {
  //   Console.log("Error in sending the mails "+error);
  // }
};
module.exports = sendEmail;