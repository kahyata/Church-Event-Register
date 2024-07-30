const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 7011;

// MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Mwata1973',
  database: 'church',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// Handle form submission
app.post('/submit_form', async (req, res) => {
  const {
    first_name,
    last_name,
    date_of_birth,
    street_address,
    postal_address,
    district,
    province,
    country,
    denomination_name,
    denomination_address,
    phone_number,
    email_address,
    gender
  } = req.body;

  const sql = `INSERT INTO members (first_name, last_name, date_of_birth, street_address, postal_address, district, province, country, denomination_name, denomination_address, phone_number, email_address, gender) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    first_name,
    last_name,
    date_of_birth,
    street_address,
    postal_address,
    district,
    province,
    country,
    denomination_name,
    denomination_address,
    phone_number,
    email_address,
    gender
  ];

  try {
    const [result] = await pool.execute(sql, values);
    res.json({ message: 'Form submitted successfully', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error inserting data into database', details: err.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Perfect shutdown
process.on('SIGINT', () => {
  pool.end((err) => {
    if (err) {
      console.error('Error closing MySQL connection pool', err);
    }
    console.log('MySQL connection pool closed');
    process.exit(0);
  });
});