const express = require('express');
const dotenv = require('dotenv');
const db = require('./src/Config/db'); 

dotenv.config(); 

const app = express();

app.use(express.json());
const authRoutes = require('./src/Routes/auth/authRoutes');
const userRoutes = require('./src/Routes/users/userRoutes');
const otpRoutes = require('./src/Routes/users/Otp');

app.use('/auth', authRoutes);        
app.use('/users', userRoutes); 
app.use('/Otp', otpRoutes); 
// Test route
app.get('/', (req, res) => {
  res.send('Welcome to NajemPay API khgashjghs');
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
