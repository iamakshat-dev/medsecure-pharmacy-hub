async function createBatch(executor, batch) {
  await executor.query(
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
      batch.batchId,
      batch.medicineId,
      batch.quantity,
      batch.price,
      batch.manufactureDate,
      batch.expiryDate,
      batch.currentOwner,
    ],
  );

  return {
    batch_id: batch.batchId,
    medicine_id: batch.medicineId,
    quantity: batch.quantity,
    price: batch.price,
    manufacture_date: batch.manufactureDate,
    expiry_date: batch.expiryDate,
    current_owner: batch.currentOwner,
  };
}

async function findBatchById(executor, batchId) {
  const [rows] = await executor.query(
    `
      SELECT batch_id, medicine_id, quantity, price, manufacture_date, expiry_date, current_owner
      FROM batches
      WHERE batch_id = ?
      LIMIT 1
    `,
    [batchId],
  );

  return rows[0] || null;
}

async function updateBatchOwner(executor, { batchId, newOwnerId }) {
  await executor.query(
    `
      UPDATE batches
      SET current_owner = ?
      WHERE batch_id = ?
    `,
    [newOwnerId, batchId],
  );
}

async function updateBatchInventory(executor, batch) {
  await executor.query(
    `
      UPDATE batches
      SET quantity = ?, price = ?, expiry_date = ?
      WHERE batch_id = ?
    `,
    [batch.quantity, batch.price, batch.expiryDate, batch.batchId],
  );
}

async function deleteBatch(executor, batchId) {
  await executor.query('DELETE FROM batches WHERE batch_id = ?', [batchId]);
}

module.exports = {
  createBatch,
  findBatchById,
  updateBatchOwner,
  updateBatchInventory,
  deleteBatch,
};
