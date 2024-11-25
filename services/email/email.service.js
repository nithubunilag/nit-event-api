const { createTransport } = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid");

const apiKeys = [
  {
    apiKey: process.env.SENDGRID_API_KEY_1,
    email: process.env.SENDGRID_EMAIL_1,
  },
  {
    apiKey: process.env.SENDGRID_API_KEY_2,
    email: process.env.SENDGRID_EMAIL_2,
  },
];

let currentKeyIndex = 0;

const getTransporter2 = (keyIndex) => {
  const options = {
    apiKey: apiKeys[keyIndex].apiKey,
  };

  return createTransport(sendgridTransport(options));
};

const sendEmail2 = async (emailDto) => {
  const { to, subject, body } = emailDto;

  let attempts = 0;
  let emailSent = false;
  let lastError = null;

  while (attempts < apiKeys.length && !emailSent) {
    const keyIndex = (currentKeyIndex + attempts) % apiKeys.length;
    const transporter = getTransporter(keyIndex);
    const from = apiKeys[keyIndex].email;

    const mailOptions = {
      from,
      to,
      subject,
      html: body,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(
        `Mail sent successfully to ${to} using key index ${currentKeyIndex}`
      );

      currentKeyIndex = (keyIndex + 1) % apiKeys.length;
      emailSent = true;
    } catch (error) {
      console.error(
        `Failed to send email with key index ${currentKeyIndex}:`,
        error.message
      );
      lastError = error;
      attempts++;
    }
  }

  if (!emailSent) {
    throw new Error(
      `Failed to send email after trying all API keys. Last error: ${lastError.message}`
    );
  }

  return emailDto;
};

const getTransporter = () => {
  const options = {
    apiKey: process.env.SENDGRID_API_KEY_2,
  };

  return createTransport(sendgridTransport(options));
};

const sendEmail = async (emailDto) => {
  const { to, subject, body } = emailDto;
  const from = process.env.SENDGRID_EMAIL_2;

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
