const { pool } = require('../config/db');
const blockchainModel = require('../models/blockchainModel');
const { computeBlockHash, hashSha256, getCurrentTimestamp } = require('./hashService');

async function ensureColumnExists(tableName, columnName, columnDefinition) {
  const [columns] = await pool.query(
    `
      SHOW COLUMNS FROM \`${tableName}\` LIKE ?
    `,
    [columnName],
  );

  if (!columns.length) {
    await pool.query(
      `
        ALTER TABLE \`${tableName}\`
        ADD COLUMN ${columnDefinition}
      `,
    );
  }
}

async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(100),
      role ENUM('manufacturer','distributor','pharmacy'),
      public_key TEXT,
      private_key TEXT
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS medicines (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(100),
      manufacturer_id INT,
      FOREIGN KEY (manufacturer_id) REFERENCES users(id)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS batches (
      batch_id VARCHAR(100) PRIMARY KEY,
      medicine_id INT,
      quantity INT,
      price DECIMAL(10,2) DEFAULT 0,
      manufacture_date DATE,
      expiry_date DATE,
      current_owner INT,
      FOREIGN KEY (medicine_id) REFERENCES medicines(id)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INT PRIMARY KEY AUTO_INCREMENT,
      batch_id VARCHAR(100),
      action ENUM('CREATE','TRANSFER'),
      from_actor_id INT NULL,
      to_actor_id INT NULL,
      quantity_snapshot INT,
      remarks VARCHAR(255) NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (batch_id) REFERENCES batches(batch_id),
      FOREIGN KEY (from_actor_id) REFERENCES users(id),
      FOREIGN KEY (to_actor_id) REFERENCES users(id)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS blockchain (
      id INT AUTO_INCREMENT PRIMARY KEY,
      batch_id VARCHAR(100),
      data_hash VARCHAR(256),
      previous_hash VARCHAR(256),
      current_hash VARCHAR(256),
      actor_id INT,
      signature TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await ensureColumnExists('batches', 'price', 'price DECIMAL(10,2) DEFAULT 0 AFTER quantity');
  await ensureColumnExists('batches', 'manufacture_date', 'manufacture_date DATE NULL AFTER price');
  await ensureColumnExists('batches', 'expiry_date', 'expiry_date DATE NULL AFTER manufacture_date');
  await ensureColumnExists('batches', 'current_owner', 'current_owner INT NULL AFTER expiry_date');
}

async function ensureGenesisBlock() {
  const totalBlocks = await blockchainModel.countBlocks(pool);
  if (totalBlocks > 0) {
    return;
  }

  const timestamp = getCurrentTimestamp();
  const dataHash = hashSha256('GENESIS_BLOCK');
  const previousHash = '0';
  const currentHash = computeBlockHash({ dataHash, previousHash, timestamp });

  await blockchainModel.insertBlock(pool, {
    batchId: 'GENESIS',
    dataHash,
    previousHash,
    currentHash,
    actorId: null,
    signature: 'GENESIS',
    timestamp,
  });
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date, days) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

async function ensureLegacyInventorySeed() {
  const [medicineRows] = await pool.query(`
    SELECT
      medicines.id,
      medicines.name,
      medicines.manufacturer_id
    FROM medicines
    LEFT JOIN batches ON batches.medicine_id = medicines.id
    WHERE batches.batch_id IS NULL
    ORDER BY medicines.id ASC
  `);

  if (!medicineRows.length) {
    return;
  }

  const stockLevels = [2400, 1800, 950, 640, 420, 275, 120];
  const priceLevels = [25, 18.5, 42, 12.75, 67.2, 95, 31.4];
  const manufactureBaseDate = new Date();
  manufactureBaseDate.setMonth(manufactureBaseDate.getMonth() - 2);

  for (const [index, medicine] of medicineRows.entries()) {
    const manufactureDate = addDays(manufactureBaseDate, -index * 5);
    const expiryDate = addDays(manufactureDate, 540 + index * 10);
    const restoredBatchId = `RESTORED-${String(medicine.id).padStart(3, '0')}`;

    await pool.query(
      `
        INSERT INTO batches (
          batch_id,
          medicine_id,
          quantity,
          price,
          manufacture_date,
          expiry_date,
          current_owner
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        restoredBatchId,
        medicine.id,
        stockLevels[index % stockLevels.length],
        priceLevels[index % priceLevels.length],
        formatDate(manufactureDate),
        formatDate(expiryDate),
        medicine.manufacturer_id || null,
      ],
    );
  }
}

async function initializeApplication() {
  await ensureSchema();
  await ensureGenesisBlock();
  await ensureLegacyInventorySeed();
}

module.exports = {
  ensureSchema,
  ensureGenesisBlock,
  initializeApplication,
};
