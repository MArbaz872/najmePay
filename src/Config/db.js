const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config(); // Ensure this is loaded

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'najempay.net', // Your database host
  user: 'root', // Your database username
  password: 'Arain55522', // Your database password
  database: 'najem_pay_db' // Your database name
});

console.log('Connecting to MySQL with the following details:');
console.log(`Host: ${connection.config.host}`);
console.log(`User: ${connection.config.user}`); // This should show your username
console.log(`Database: ${connection.config.database}`); // This should show your database

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

module.exports = connection; // Export the connection for use in other files
