async function createTransaction(executor, transaction) {
  const [result] = await executor.query(
    `
      INSERT INTO transactions (
        batch_id,
        action,
        from_actor_id,
        to_actor_id,
        quantity_snapshot,
        remarks,
        timestamp
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      transaction.batchId,
      transaction.action,
      transaction.fromActorId,
      transaction.toActorId,
      transaction.quantitySnapshot,
      transaction.remarks,
      transaction.timestamp,
    ],
  );

  return {
    id: result.insertId,
    batch_id: transaction.batchId,
    action: transaction.action,
    from_actor_id: transaction.fromActorId,
    to_actor_id: transaction.toActorId,
    quantity_snapshot: transaction.quantitySnapshot,
    remarks: transaction.remarks,
    timestamp: transaction.timestamp,
  };
}

async function listTransactionsByBatchId(executor, batchId) {
  const [rows] = await executor.query(
    `
      SELECT
        transactions.id,
        transactions.batch_id,
        transactions.action,
        transactions.from_actor_id,
        transactions.to_actor_id,
        transactions.quantity_snapshot,
        transactions.remarks,
        transactions.timestamp,
        source_user.name AS from_actor_name,
        source_user.role AS from_actor_role,
        target_user.name AS to_actor_name,
        target_user.role AS to_actor_role
      FROM transactions
      LEFT JOIN users AS source_user ON source_user.id = transactions.from_actor_id
      LEFT JOIN users AS target_user ON target_user.id = transactions.to_actor_id
      WHERE transactions.batch_id = ?
      ORDER BY transactions.id ASC
    `,
    [batchId],
  );

  return rows;
}

module.exports = {
  createTransaction,
  listTransactionsByBatchId,
};
