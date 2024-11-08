const express = require('express');
const router = express.Router();

// Signup route
router.post('/signup', (req, res) => {
  const { username, password } = req.body;
  console.log(`Signup for `);
  res.json({ message: `User ${username} signed up successfully` });
});

// Login route
router.post('/login', (req, res) => {
  const { userId, password } = req.body;
  console.log(`Login for userId `);
  res.json({ message: `User ${userId} logged in successfully` });
});

router.post('/update-password', (req, res) => {
  const { email, password } = req.body;
  console.log(`update-password `);
  res.json({ message: `User ${email} and ${password} for update` });
});

module.exports = router;
