require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

/* =========================
   DATABASE CONNECTION
========================= */

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
console.log("Connected to MySQL");

// Create users table if not exists
db.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
  if (err) {
    console.error("Users table error:", err);
  } else {
    console.log("Users table ready");
  }
});
const formatDate = (date) => {
    return date ? new Date(date).toISOString().split("T")[0] : null;
  };
/* =========================
   ROUTES
========================= */

// ✅ GET all medicines
app.get("/api/medicines", (req, res) => {
  
    db.query("SELECT * FROM medicines", (err, results) => {
    if (err) {
      console.error("GET ERROR:", err);
      return res.status(500).json(err);
    }
    res.json(results);
  });
});


// ✅ ADD new medicine
app.post("/api/medicines", (req, res) => {
  const { name, batch, stock, price, expiry } = req.body;
  const formattedDate = formatDate(expiry);
  const sql = `
    INSERT INTO medicines (name, batch, stock, price, expiry)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [name, batch, stock, price, formattedDate], (err, result) => {
    if (err) {
      console.error("POST ERROR:", err);
      return res.status(500).json(err);
    }

    res.status(201).json({
      message: "Medicine added successfully",
      id: result.insertId
    });
  });
});


// ✅ UPDATE full medicine record
app.put("/api/medicines/:id", (req, res) => {
  const { id } = req.params;
  const { name, batch, stock, price, expiry } = req.body;

  const sql = `
    UPDATE medicines 
    SET name = ?, batch = ?, stock = ?, price = ?, expiry = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [name, batch, stock, price, expiry, id],
    (err, result) => {
      if (err) {
        console.error("PUT ERROR:", err);
        return res.status(500).json(err);
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Medicine not found" });
      }

      res.json({ message: "Medicine updated successfully" });
    }
  );
});


// ✅ DELETE medicine
app.delete("/api/medicines/:id", (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM medicines WHERE id = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("DELETE ERROR:", err);
      return res.status(500).json(err);
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    res.json({ message: "Medicine deleted successfully" });
  });
});


/* =========================
   SERVER START
========================= */

/* AUTH ROUTES */
app.post('/api/register', (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ message: 'Missing fields' });

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Username or email already exists' });
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Missing fields' });

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const user = results[0];
    if (!bcrypt.compareSync(password, user.password)) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id, username: user.username }, 'medsecuresecret', { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, username: user.username } });
  });
});

app.post('/api/forgot-password', (req, res) => {
  const { email } = req.body;
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err || results.length === 0) return res.status(404).json({ message: 'Email not found' });

    const token = jwt.sign({ userId: results[0].id }, 'medsecuresecret', { expiresIn: '1h' });
    // Dummy - console log reset link (add EMAIL_USER/PASS to .env for real)
    console.log(`Reset link for ${email}: http://localhost:8080/reset-password?token=${token}`);
    res.json({ message: 'Reset link sent to console (check server logs)' });
  });
});

// ✅ VERIFY medicine batch (for Authentication page)
app.get("/api/verify-batch/:batch", (req, res) => {
  const { batch } = req.params;

  const sql = `SELECT * FROM medicines WHERE batch = ? LIMIT 1`;
  db.query(sql, [batch], (err, results) => {
    if (err) {
      console.error("VERIFY ERROR:", err);
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.json({ isAuthentic: false, message: "Batch not found" });
    }

    const medicine = results[0];
    // Mock supply chain data
    const supplyChain = [
      { step: 'Manufactured', location: 'PharmaCorp Ltd, Mumbai', date: '2025-11-10' },
      { step: 'Quality Checked', location: 'QA Lab, Pune', date: '2025-11-15' },
      { step: 'Distributed', location: 'MedDist Hub, Delhi', date: '2025-12-01' },
      { step: 'Received', location: 'MedSecure Pharmacy', date: new Date().toISOString().split('T')[0] }
    ];

    res.json({
      isAuthentic: true,
      medicine,
      supplyChain
    });
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Backend running on port ${process.env.PORT}`);
});
