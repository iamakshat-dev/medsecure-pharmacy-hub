async function createMedicine(executor, { name, manufacturerId }) {
  const [result] = await executor.query(
    `
      INSERT INTO medicines (name, manufacturer_id)
      VALUES (?, ?)
    `,
    [name, manufacturerId],
  );

  return {
    id: result.insertId,
    name,
    manufacturer_id: manufacturerId,
  };
}

async function findMedicineById(executor, medicineId) {
  const [rows] = await executor.query(
    `
      SELECT id, name, manufacturer_id
      FROM medicines
      WHERE id = ?
      LIMIT 1
    `,
    [medicineId],
  );

  return rows[0] || null;
}

async function findMedicineByName(executor, medicineName) {
  const [rows] = await executor.query(
    `
      SELECT id, name, manufacturer_id
      FROM medicines
      WHERE name = ?
      ORDER BY id ASC
      LIMIT 1
    `,
    [medicineName],
  );

  return rows[0] || null;
}

async function listMedicines(executor) {
  const [rows] = await executor.query(
    `
      SELECT
        medicines.id,
        medicines.name,
        medicines.manufacturer_id,
        users.name AS manufacturer_name
      FROM medicines
      LEFT JOIN users ON users.id = medicines.manufacturer_id
      ORDER BY medicines.id ASC
    `,
  );

  return rows;
}

async function updateMedicineName(executor, { medicineId, name }) {
  await executor.query(
    `
      UPDATE medicines
      SET name = ?
      WHERE id = ?
    `,
    [name, medicineId],
  );
}

module.exports = {
  createMedicine,
  findMedicineById,
  findMedicineByName,
  listMedicines,
  updateMedicineName,
};
