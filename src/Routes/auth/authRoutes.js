const express = require('express');
const router = express.Router();
const db = require('../../Config/db');

router.post('/signup', (req, res) => {
  const { name, username, profile_url, flag_url, referral_code, email, password, dob, present_address, permanent_address, city, postal_code, country } = req.body;

  // First, check if the email or username already exists
  const checkQuery = 'SELECT * FROM Users WHERE email = ? OR username = ?';

  db.query(checkQuery, [email, username], (err, results) => {
    if (err) {
      console.error('Error checking existing user:', err);
      return res.status(500).json({ error: 'Database error occurred select' });
    }

    if (results.length > 0) {
      // User with that email or username already exists
      return res.status(400).json({ error: 'Email or username already exists' });
    }

    // If no existing user, proceed to insert the new user
    const sql = `INSERT INTO Users (name, username, profile_url, flag_url, referral_code, email, password, dob, present_address, permanent_address, city, postal_code, country, active, created_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW())`;

    db.query(sql, [name, username, profile_url, flag_url, referral_code, email, password, dob, present_address, permanent_address, city, postal_code, country], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Database error occurred insert' });
      }
      console.log(`Signup for ${username} successful`);
      res.json({ message: `User ${username} signed up successfully` });
    });
  });
});


// Login route
router.post('/login', (req, res) => {
  const { email, password } = req.body; // Expecting email and password in the request body

  const query = 'SELECT * FROM Users WHERE email = ?';

  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    if (results.length > 0) {
      const user = results[0]; // Get the first matching user

      if (user.password === password) {
        // Passwords match
        const { password, ...userDetails } = user; // Exclude password from response
        return res.json({
          message: `User ${email} logged in successfully`,
          user: userDetails 
        });
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
