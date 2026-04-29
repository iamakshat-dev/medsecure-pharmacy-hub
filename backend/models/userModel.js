async function createUser(executor, { name, role, publicKey, privateKey }) {
  const [result] = await executor.query(
    `
      INSERT INTO users (name, role, public_key, private_key)
      VALUES (?, ?, ?, ?)
    `,
    [name, role, publicKey, privateKey],
  );

  return {
    id: result.insertId,
    name,
    role,
    public_key: publicKey,
    private_key: privateKey,
  };
}

async function findUserById(executor, userId) {
  const [rows] = await executor.query(
    `
      SELECT id, name, role, public_key, private_key
      FROM users
      WHERE id = ?
      LIMIT 1
    `,
    [userId],
  );

  return rows[0] || null;
}

async function listUsers(executor) {
  const [rows] = await executor.query(
    `
      SELECT id, name, role, public_key
      FROM users
      ORDER BY id ASC
    `,
  );

  return rows;
}

module.exports = {
  createUser,
  findUserById,
  listUsers,
};
