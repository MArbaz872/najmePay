const express = require('express');
const router = express.Router();
const db = require('../../Config/db');

router.post('/signup', (req, res) => {
  const { name, username, profile_url, flag_url, referral_code, email, password, dob, present_address, permanent_address, city, postal_code, country } = req.body;

  // SQL query to insert a new user into the Users table
  const sql = `INSERT INTO Users (name, username, profile_url, flag_url, referral_code, email, password, dob, present_address, permanent_address, city, postal_code, country, active, created_at) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW())`;

  // Execute the query
  db.query(sql, [name, username, profile_url, flag_url, referral_code, email, password, dob, present_address, permanent_address, city, postal_code, country], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Database error occurred' });
    }

    console.log(`Signup for ${username} successful`);
    res.json({ message: `User ${username} signed up successfully` });
  });
});

// Login route
router.post('/login', (req, res) => {
  const { userId, password } = req.body;
  console.log(`Login for userId 1`);
  res.json({ message: `UserName Arbaz logged in successfully` });
});

module.exports = router;
