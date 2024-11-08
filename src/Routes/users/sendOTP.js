// sendOTP.js
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config(); // Load environment variables

// Function to generate OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999); // Generates a 6-digit OTP
};

// Function to send OTP to email
const sendOTP = async (email, service) => {
  try {
    const otp = generateOTP(); // Generate OTP

    // Set up the transport
    const transporter = nodemailer.createTransport({
        // host: 'smtp.ethereal.email',
        service: service,
        secure: true,
        port: 465,

        auth: {
            user: 'muhammadarbaz872@gmail.com',
            pass: 'lhbccgedktkdtfmy'
        }
    });

    // Email message options
    const mailOptions = {
      from: 'muhammadarbaz872@gmail.com', 
      to: email, 
      subject: 'your otp for reset password', 
      text: `Your OTP code is==>: ${otp}` 
    };

    // Send email
    await transporter.sendMail(mailOptions);

    console.log(`OTP sent to ${email}`);
    return otp; // Return OTP to save it in a database or session for verificationß
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw new Error('Failed to send OTP');
  }
};

module.exports = sendOTP;
