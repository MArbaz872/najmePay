const express = require('express');
const dotenv = require('dotenv');
const db = require('./src/Config/db'); 

dotenv.config(); 

const app = express();

app.use(express.json());
const authRoutes = require('./src/Routes/auth/authRoutes');
const userRoutes = require('./src/Routes/users/userRoutes');

app.use('/auth', authRoutes);        
app.use('/users', userRoutes); 
// Test route
app.get('/', (req, res) => {
  res.send('Welcome to NajemPay API');
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
