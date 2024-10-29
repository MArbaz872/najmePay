const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config(); // Ensure this is loaded

const connection = mysql.createConnection({
  host: '82.112.255.73', // Use IP instead of domain name
  port: 5001, // MySQL default port
  user: 'root',
  password: 'Admin12345$$',
  database: 'u998392613_najem_pay_db'
});


console.log('Connecting to MySQL with the following details:');
// console.log(`Host: ${connection.config.host}`);
// console.log(`User: ${connection.config.user}`); // This should show your username
// console.log(`Database: ${connection.config.database}`); // This should show your database

// Connect to the database
console.log('yhnnn aya');
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

module.exports = connection; // Export the connection for use in other files
