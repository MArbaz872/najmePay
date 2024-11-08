const express = require('express');
const router = express.Router();
const db = require('../../Config/db');

router.post('/signup', (req, res) => {
  const { name, username, profile_url, flag_url, referral_code, email, password, dob, present_address, permanent_address, city, postal_code, country } = req.body;

  // First, check if the email or username already exists
  const checkQuery = 'SELECT * FROM Users WHERE email = ? ';

  db.query(checkQuery, [email], (err, results) => {
    if (err) {
      console.error('Error checking existing user:', err);
      return res.status(500).json({
        statusCode: 500,
        statusDescription: 'Internal Server Error Select user',
      });
    }

    if (results.length > 0) {
      // User with that email or username already exists
      return res.status(400).json({ 
        statusCode: 400,
        statusDescription: 'Email or username already exists' 
      });
    }

    // If no existing user, proceed to insert the new user
    const sql = `INSERT INTO Users (name, username, profile_url, flag_url, referral_code, email, password, dob, present_address, permanent_address, city, postal_code, country, active, created_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW())`;

    db.query(sql, [name || '', username || '', profile_url || '', flag_url || '', referral_code || '', email, password, dob || '1990-01-01', present_address || '', permanent_address || '', city || '', postal_code || '', country || ''], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({
          statusCode: 500,
          statusDescription: ' Email should be unique.',
        });
      }
      console.log(`Signup for ${username} successful`);
      res.json({
        statusCode: 200,
        statusDescription: 'Success',
        message: `User ${email} Signup successfully`
      });
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
      return res.status(500).json({
        statusCode: 500,
        statusDescription: 'Internal Server Error',
      });
    }
    if (results.length > 0) {
      const user = results[0]; // Get the first matching user

      if (user.password === password) {
        // Passwords match
        const { password, ...userDetails } = user; // Exclude password from response
        return res.json({
          statusCode: 200,
          statusDescription: 'Success',
          data: {
            user: userDetails
          }
        });
      } else {
        // Passwords do not match
        return res.status(401).json({
          statusCode: 401,
          statusDescription: 'Invalid email or password'
        });
      }
    } else {
      // No user found with that email
      return res.status(401).json({
        statusCode: 401,
        statusDescription: 'Invalid email or password'
      });
    }
  });
});

router.post('/edit-user', (req, res) => {
  const { email, name, username, profile_url, flag_url, referral_code, password, dob, present_address, permanent_address, city, postal_code, country } = req.body;
console.log('email=-=-=->',email);
  // SQL query to update user details
  const sql = `UPDATE Users 
               SET name = ?, username = ?, profile_url = ?, flag_url = ?, referral_code = ?, password = ?, dob = ?, present_address = ?, permanent_address = ?, city = ?, postal_code = ?, country = ?
               WHERE email = ?`;

  // Execute the query
  db.query(sql, [name, username, profile_url, flag_url, referral_code, password, dob, present_address, permanent_address, city, postal_code, country, email], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({
        statusCode: 500,
        statusDescription: 'Internal Server Error',
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        statusCode: 404,
        statusDescription: 'User not found',
      });
    }

    console.log(`User ${email} updated successfully`);
    res.json({
      statusCode: 200,
      statusDescription: 'Success',
      message: `User ${email} updated successfully`
    });
  });
});

router.post('/update-password', (req, res) => {
  const { email, password } = req.body;

  console.log('email=-=-=->', email);
  console.log('password=-=-=->', password);

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({
      statusCode: 400,
      statusDescription: 'Bad Request',
      message: 'Email and password are required'
    });
  }

  // SQL query to check if the user exists
  const checkUserSql = `SELECT * FROM Users WHERE email = ?`;

  // Check if user exists
  db.query(checkUserSql, [email], (err, result) => {
    if (err) {
      console.error('Error checking user:', err);
      return res.status(500).json({
        statusCode: 500,
        statusDescription: 'Internal Server Error',
        message: 'Error checking user'
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        statusDescription: 'User Not Found',
        message: `No user found with email: ${email}`
      });
    }

    // SQL query to update the password
    const updatePasswordSql = `UPDATE Users SET password = ? WHERE email = ?`;

    // Update the user's password in the database
    db.query(updatePasswordSql, [password, email], (err, result) => {
      if (err) {
        console.error('Error updating password:', err);
        return res.status(500).json({
          statusCode: 500,
          statusDescription: 'Internal Server Error',
          message: 'Error updating password'
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          statusCode: 404,
          statusDescription: 'No changes made',
          message: 'No password update performed'
        });
      }

      // SQL query to fetch the updated user data
      const getUserSql = `SELECT * FROM Users WHERE email = ?`;

      // Fetch the updated user data
      db.query(getUserSql, [email], (err, userData) => {
        if (err) {
          console.error('Error fetching user data:', err);
          return res.status(500).json({
            statusCode: 500,
            statusDescription: 'Internal Server Error',
            message: 'Error fetching updated user data'
          });
        }

        // If user data is fetched successfully, send it back
        console.log(`Password for user with email ${email} updated successfully`);
        res.json({
          statusCode: 200,
          statusDescription: 'Success',
          message: `Password for user ${email} updated successfully`,
          userData: userData[0] // Send the entire user data
        });
      });
    });
  });
});



module.exports = router;
