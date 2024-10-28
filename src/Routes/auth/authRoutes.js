const express = require('express');
const router = express.Router();

// Signup route
router.post('/signup', (req, res) => {
  const { username, password } = req.body;
  console.log(`Signup for ${username} ok ok`);
  res.json({ message: `User ${username} signed up successfully` });
});

// Login route
router.post('/login', (req, res) => {
  const { userId, password } = req.body;
  console.log(`Login for userId 1`);
  res.json({ message: `UserName Arbaz logged in successfully` });
});

module.exports = router;
