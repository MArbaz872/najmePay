const express = require('express');
const router = express.Router();
const db = require('../../Config/db');
const sendOTP = require('../users/sendOTP');

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

  db.query(query, [email], async (err, results) => {
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
        const otp = await sendOTP(email);
        console.log('login successs Otp here=-=-=-=>',otp);
        const updateOtpQuery = 'UPDATE Users SET otp = ? WHERE email = ?';
        db.query(updateOtpQuery, [otp, email], (updateErr) => {
          if (updateErr) {
            console.error('Error updating OTP:', updateErr);
            return res.status(500).json({
              statusCode: 500,
              statusDescription: 'Internal Server Error',
              message: 'Failed to update OTP'
            });
          }})
        // return
        const { password, ...userDetails } = user; // Exclude password from response
        return res.json({
          statusCode: 200,
          statusDescription: 'Otp Success',
          // data: {
          //   user: userDetails
          // }
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

router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body; // Expecting email and OTP in the request body

  // Check if email and OTP are provided
  if (!email || !otp) {
    return res.status(400).json({
      statusCode: 400,
      statusDescription: 'Bad Request',
      message: 'Email and OTP are required'
    });
  }

  // SQL query to check if the user with the provided email and OTP exists
  const verifyOtpQuery = `SELECT * FROM Users WHERE email = ? AND otp = ?`;

  db.query(verifyOtpQuery, [email, otp], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        statusCode: 500,
        statusDescription: 'Internal Server Error',
        message: 'Error verifying OTP'
      });
    }

    if (results.length > 0) {
      const user = results[0];
      const { password, otp, ...userDetails } = user;
      console.log(`OTP verification successful for ${email}`);
      res.json({
        statusCode: 200,
        statusDescription: 'OTP verified successfully',
        message: 'OTP verification successful',
        data: {
          user: userDetails
        }
      });
    } else {
      // OTP does not match
      return res.status(401).json({
        statusCode: 401,
        statusDescription: 'Invalid OTP',
        message: 'The provided OTP is incorrect'
      });
    }
  });
});


router.post('/google-signin', (req, res) => {
  const { email, displayName, photoURL, phoneNumber, emailVerified, isNewUser, accessToken, idToken } = req.body;

  // Check if the accessToken exists in the database
  const checkAccessTokenQuery = 'SELECT * FROM Users WHERE accessToken = ?';
  db.query(checkAccessTokenQuery, [accessToken], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        statusCode: 500,
        statusDescription: 'Internal Server Error',
        message: 'Error checking access token'
      });
    }

    if (results.length > 0) {
      // Access token exists, return user data
      const user = results[0];
      const { password, ...userDetails } = user;
      res.json({
        statusCode: 200,
        statusDescription: 'Access token exists',
        message: 'Access token exists',
        data: {
          user: userDetails
        }
      });
    } else {
      // Access token not found, insert new user into the database
      const insertUserQuery = `
        INSERT INTO Users ( email, name, username, password, profile_url, phoneNumber, emailVerified, isNewUser, accessToken, idToken)
        VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const userValues = [email, displayName, displayName, displayName,photoURL, phoneNumber, emailVerified, isNewUser, accessToken, idToken];
      
      db.query(insertUserQuery, userValues, (err, result) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({
            statusCode: 500,
            statusDescription: 'Internal Server Error',
            message: 'Error inserting user'
          });
        }

        // Fetch the inserted user's full data
        const getUserQuery = 'SELECT * FROM Users WHERE accessToken = ?';
        db.query(getUserQuery, [accessToken], (err, userResults) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
              statusCode: 500,
              statusDescription: 'Internal Server Error',
              message: 'Error retrieving user data after insertion'
            });
          }

          const newUser = userResults[0];
          res.json({
            statusCode: 201,
            statusDescription: 'User created',
            data: {
              user: newUser
            }
          });
        });
      });
    }
  });
});



module.exports = router;
