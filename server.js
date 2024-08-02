const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');

const app = express();
let port = 7011;

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
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/favicon.ico', (req, res) => res.status(204));

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
    gender,
    employment_status,
    occupation,
    school,
    academic_year,
    program_of_study,
    membership_status
  } = req.body;

  const sql = `INSERT INTO members (
    first_name, last_name, date_of_birth, street_address, postal_address, 
    district, province, country, denomination_name, denomination_address, 
    phone_number, email_address, gender, employment_status, occupation, 
    school, academic_year, program_of_study, membership_status
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

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
    gender,
    employment_status,
    occupation,
    school,
    academic_year,
    program_of_study,
    membership_status
  ];

  try {
    const [result] = await pool.execute(sql, values);
    res.json({ message: 'Form submitted successfully', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error inserting data into database', details: err.message });
  }
});

// Function to start the server
function startServer(port) {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
      resolve(server);
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} is busy, trying with port ${port + 1}`);
        resolve(startServer(port + 1));
      } else {
        reject(err);
      }
    });
  });
}

// Start the server
startServer(port).catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

// Perfect shutdown
process.on('SIGINT', async () => {
  try {
    await pool.end();
    console.log('MySQL connection pool closed');
    process.exit(0);
  } catch (err) {
    console.error('Error closing MySQL connection pool', err);
    process.exit(1);
  }
});
