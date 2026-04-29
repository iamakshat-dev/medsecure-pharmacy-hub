async function insertBlock(executor, block) {
  const [result] = await executor.query(
    `
      INSERT INTO blockchain (
        batch_id,
        data_hash,
        previous_hash,
        current_hash,
        actor_id,
        signature,
        timestamp
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      block.batchId,
      block.dataHash,
      block.previousHash,
      block.currentHash,
      block.actorId,
      block.signature,
      block.timestamp,
    ],
  );

  return {
    id: result.insertId,
    batch_id: block.batchId,
    data_hash: block.dataHash,
    previous_hash: block.previousHash,
    current_hash: block.currentHash,
    actor_id: block.actorId,
    signature: block.signature,
    timestamp: block.timestamp,
  };
}

async function findLatestBlock(executor) {
  const [rows] = await executor.query(
    `
      SELECT id, batch_id, data_hash, previous_hash, current_hash, actor_id, signature, timestamp
      FROM blockchain
      ORDER BY id DESC
      LIMIT 1
    `,
  );

  return rows[0] || null;
}

async function findLatestBlockByBatchId(executor, batchId) {
  const [rows] = await executor.query(
    `
      SELECT id, batch_id, data_hash, previous_hash, current_hash, actor_id, signature, timestamp
      FROM blockchain
      WHERE batch_id = ?
      ORDER BY id DESC
      LIMIT 1
    `,
    [batchId],
  );

  return rows[0] || null;
}

async function listBlocksByBatchId(executor, batchId) {
  const [rows] = await executor.query(
    `
      SELECT
        blockchain.id,
        blockchain.batch_id,
        blockchain.data_hash,
        blockchain.previous_hash,
        blockchain.current_hash,
        blockchain.actor_id,
        blockchain.signature,
        blockchain.timestamp,
        users.name AS actor_name,
        users.role AS actor_role
      FROM blockchain
      LEFT JOIN users ON users.id = blockchain.actor_id
      WHERE blockchain.batch_id = ?
      ORDER BY blockchain.id ASC
    `,
    [batchId],
  );

  return rows;
}

async function listAllBlocks(executor) {
  const [rows] = await executor.query(
    `
      SELECT id, batch_id, data_hash, previous_hash, current_hash, actor_id, signature, timestamp
      FROM blockchain
      ORDER BY id ASC
    `,
  );

  return rows;
}

async function countBlocks(executor) {
  const [rows] = await executor.query('SELECT COUNT(*) AS total FROM blockchain');
  return rows[0]?.total || 0;
}

module.exports = {
  insertBlock,
  findLatestBlock,
  findLatestBlockByBatchId,
  listBlocksByBatchId,
  listAllBlocks,
  countBlocks,
};
