const crypto = require('crypto');

function normalizeTimestamp(timestamp) {
  if (!timestamp) {
    return null;
  }

  if (typeof timestamp === 'string' && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(timestamp)) {
    return timestamp;
  }

  return new Date(timestamp).toISOString().slice(0, 19).replace('T', ' ');
}

function getCurrentTimestamp() {
  return normalizeTimestamp(new Date());
}

function hashSha256(value) {
  return crypto.createHash('sha256').update(String(value)).digest('hex');
}

function buildDataString({
  batchId,
  medicineId,
  quantity,
  ownerId,
  timestamp,
  manufactureDate,
  expiryDate,
  price,
}) {
  const normalizedTimestamp = normalizeTimestamp(timestamp);

  // The required core formula is preserved, with immutable batch dates appended
  // to strengthen tamper detection for manufacture, expiry, and price changes.
  return [
    batchId,
    medicineId,
    quantity,
    ownerId,
    normalizedTimestamp,
    manufactureDate || '',
    expiryDate || '',
    price ?? '',
  ].join('');
}

function computeDataHash(payload) {
  return hashSha256(buildDataString(payload));
}

function computeBlockHash({ dataHash, previousHash, timestamp }) {
  return hashSha256(`${dataHash}${previousHash}${normalizeTimestamp(timestamp)}`);
}

module.exports = {
  normalizeTimestamp,
  getCurrentTimestamp,
  hashSha256,
  buildDataString,
  computeDataHash,
  computeBlockHash,
};
