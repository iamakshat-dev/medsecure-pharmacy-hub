async function listInventory(executor) {
  const [rows] = await executor.query(
    `
      SELECT
        b.batch_id AS id,
        b.batch_id,
        m.id AS medicine_id,
        m.name AS medicine_name,
        b.quantity AS stock,
        b.price,
        b.expiry_date,
        b.current_owner,
        u.name AS current_owner_name,
        u.role AS current_owner_role
      FROM batches b
      JOIN medicines m ON b.medicine_id = m.id
      LEFT JOIN users u ON b.current_owner = u.id
      ORDER BY m.name ASC, b.batch_id ASC
    `,
  );

  return rows;
}

module.exports = {
  listInventory,
};
