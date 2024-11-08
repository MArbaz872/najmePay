// src/Routes/users/Otp.js
const express = require('express');
const sendOTP = require('../users/sendOTP'); // Path to your sendOTP.js file
const router = express.Router();

// POST route to send OTP
router.post('/send', async (req, res) => {
  const { email, service } = req.body;  // Get the email from the request body
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const otp = await sendOTP(email,service);  // Call the sendOTP function
    return res.status(200).json({ message: `OTP sent to ${email}`, otp });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return res.status(500).json({ error: 'Failed to send OTP' });
  }
});

module.exports = router;
