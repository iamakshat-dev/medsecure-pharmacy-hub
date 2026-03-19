require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

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
});

/* =========================
   UTIL
========================= */

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

    console.log("INSERT SUCCESS");

    res.status(201).json({
      message: "Medicine added successfully",
      id: result.insertId
    });
  });
});

// ✅ UPDATE medicine (FIXED DATE)
app.put("/api/medicines/:id", (req, res) => {
  const { id } = req.params;
  const { name, batch, stock, price, expiry } = req.body;

  const formattedDate = formatDate(expiry); // ✅ FIX

  const sql = `
    UPDATE medicines 
    SET name = ?, batch = ?, stock = ?, price = ?, expiry = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [name, batch, stock, price, formattedDate, id],
    (err, result) => {
      if (err) {
        console.error("PUT ERROR:", err);
        return res.status(500).json(err);
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Medicine not found" });
      }

      console.log("UPDATE SUCCESS");

      res.json({ message: "Medicine updated successfully" });
    }
  );
});

// ✅ DELETE medicine (FIXED ROUTE)
app.delete("/api/medicines/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM medicines WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("DELETE ERROR:", err);
      return res.status(500).json(err);
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    console.log("DELETE SUCCESS");

    res.json({ message: "Medicine deleted successfully" });
  });
});

/* =========================
   SERVER START
========================= */

app.listen(process.env.PORT, () => {
  console.log(`Backend running on port ${process.env.PORT}`);
});