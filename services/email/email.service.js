const { createTransport } = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid");

const getTransporter = () => {
  const options = {
    apiKey: process.env.SENDGRID_API_KEY,
  };

  return createTransport(sendgridTransport(options));
};

const sendEmail = async (emailDto) => {
  const { to, subject, body } = emailDto;
  const from = process.env.SENDGRID_EMAIL;

  const transporter = getTransporter();

  const mailOptions = {
    from,
    to,
    subject,
    html: body,
  };

  await transporter.sendMail(mailOptions);

  console.log(`Mail sent Successfully to ${to}`);

  return emailDto;
};

module.exports = sendEmail;
