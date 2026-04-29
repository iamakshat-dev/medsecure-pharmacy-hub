require('dotenv').config();

const cors = require('cors');
const express = require('express');

const batchRoutes = require('./routes/batchRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'medsecure-supply-chain-backend',
  });
});

app.use('/api', batchRoutes);

app.use((error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    message: error.message || 'Internal server error',
  });
});

module.exports = app;
