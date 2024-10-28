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
  const { email, password } = req.body; // Expecting email and password in the request body

  // Use a parameterized query to prevent SQL injection
  const query = 'SELECT * FROM Users WHERE email = ?';

  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length > 0) {
      const user = results[0]; // Get the first matching user

      // Check if the password matches (assuming you store passwords as plain text)
      if (user.password === password) {
        // Passwords match
        return res.json({ message: `User ${email} logged in successfully` });
      } else {
        // Passwords do not match
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    } else {
      // No user found with that email
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  });
});

module.exports = router;
