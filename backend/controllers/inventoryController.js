const { pool, withTransaction } = require('../config/db');
const batchModel = require('../models/batchModel');
const blockchainModel = require('../models/blockchainModel');
const inventoryModel = require('../models/inventoryModel');
const medicineModel = require('../models/medicineModel');
const { createAppError } = require('../services/appError');
const blockchainService = require('../services/blockchainService');

function normalizeInventoryRow(row, verificationStatus = 'Unverified') {
  const price = row.price !== null && row.price !== undefined ? Number(row.price) : 0;
  const stock = row.stock !== null && row.stock !== undefined ? Number(row.stock) : 0;

  return {
    id: row.id,
    medicine_id: row.medicine_id,
    medicine_name: row.medicine_name,
    name: row.medicine_name,
    batch_id: row.batch_id,
    batch: row.batch_id,
    stock,
    price,
    expiry_date: row.expiry_date,
    expiry: row.expiry_date,
    current_owner_id: row.current_owner,
    current_owner_name: row.current_owner_name || 'Unassigned',
    current_owner_role: row.current_owner_role || null,
    verification_status: verificationStatus,
    status: stock > 0 ? 'In Stock' : 'Out of Stock',
  };
}

async function listInventory(_req, res, next) {
  try {
    const rows = await inventoryModel.listInventory(pool);

    const items = await Promise.all(
      rows.map(async (row) => {
        const latestBlock = await blockchainModel.findLatestBlockByBatchId(pool, row.batch_id);

        if (!latestBlock) {
          return normalizeInventoryRow(row, 'Unverified');
        }

        const verification = await blockchainService.verifyBatchIntegrity(row.batch_id);
        return normalizeInventoryRow(row, verification.valid ? 'Verified' : 'Tampered');
      }),
    );

    res.json(items);
  } catch (error) {
    next(error);
  }
}

async function createInventoryItem(req, res, next) {
  try {
    const name = req.body.name?.trim();
    const batchId = req.body.batch?.trim();
    const stock = Number.parseInt(req.body.stock, 10);
    const expiry = req.body.expiry;
    const price = req.body.price !== null && req.body.price !== undefined ? Number(req.body.price) : 0;

    if (!name) {
      throw createAppError(400, 'name is required');
    }

    if (!batchId) {
      throw createAppError(400, 'batch is required');
    }

    if (Number.isNaN(stock) || stock < 0) {
      throw createAppError(400, 'stock must be a non-negative integer');
    }

    if (Number.isNaN(price) || price < 0) {
      throw createAppError(400, 'price must be a non-negative number');
    }

    if (!expiry) {
      throw createAppError(400, 'expiry is required');
    }

    const inventoryItem = await withTransaction(async (connection) => {
      const existingBatch = await batchModel.findBatchById(connection, batchId);
      if (existingBatch) {
        throw createAppError(409, 'Batch ID must be unique');
      }

      let medicine = await medicineModel.findMedicineByName(connection, name);
      if (!medicine) {
        medicine = await medicineModel.createMedicine(connection, {
          name,
          manufacturerId: null,
        });
      }

      await batchModel.createBatch(connection, {
        batchId,
        medicineId: medicine.id,
        quantity: stock,
        price,
        manufactureDate: new Date().toISOString().slice(0, 10),
        expiryDate: expiry,
        currentOwner: null,
      });

      const createdBatch = await batchModel.findBatchById(connection, batchId);
      return {
        id: createdBatch.batch_id,
        medicine_id: medicine.id,
        medicine_name: medicine.name,
        batch_id: createdBatch.batch_id,
        stock: createdBatch.quantity,
        price: createdBatch.price,
        expiry_date: createdBatch.expiry_date,
        current_owner: createdBatch.current_owner,
        current_owner_name: null,
        current_owner_role: null,
      };
    });

    res.status(201).json(normalizeInventoryRow(inventoryItem, 'Unverified'));
  } catch (error) {
    next(error);
  }
}

async function updateInventoryItem(req, res, next) {
  try {
    const batchId = req.params.batchId;
    const name = req.body.name?.trim();
    const stock = Number.parseInt(req.body.stock, 10);
    const price = req.body.price !== null && req.body.price !== undefined ? Number(req.body.price) : 0;
    const expiry = req.body.expiry;

    if (!name) {
      throw createAppError(400, 'name is required');
    }

    if (Number.isNaN(stock) || stock < 0) {
      throw createAppError(400, 'stock must be a non-negative integer');
    }

    if (Number.isNaN(price) || price < 0) {
      throw createAppError(400, 'price must be a non-negative number');
    }

    if (!expiry) {
      throw createAppError(400, 'expiry is required');
    }

    const updatedItem = await withTransaction(async (connection) => {
      const batch = await batchModel.findBatchById(connection, batchId);
      if (!batch) {
        throw createAppError(404, 'Inventory item not found');
      }

      const latestBlock = await blockchainModel.findLatestBlockByBatchId(connection, batchId);
      if (latestBlock) {
        throw createAppError(409, 'Blockchain-anchored batches cannot be edited from the legacy inventory form');
      }

      await medicineModel.updateMedicineName(connection, {
        medicineId: batch.medicine_id,
        name,
      });

      await batchModel.updateBatchInventory(connection, {
        batchId,
        quantity: stock,
        price,
        expiryDate: expiry,
      });

      const rows = await inventoryModel.listInventory(connection);
      return rows.find((row) => row.batch_id === batchId);
    });

    res.json(normalizeInventoryRow(updatedItem, 'Unverified'));
  } catch (error) {
    next(error);
  }
}

async function deleteInventoryItem(req, res, next) {
  try {
    const batchId = req.params.batchId;

    await withTransaction(async (connection) => {
      const batch = await batchModel.findBatchById(connection, batchId);
      if (!batch) {
        throw createAppError(404, 'Inventory item not found');
      }

      const latestBlock = await blockchainModel.findLatestBlockByBatchId(connection, batchId);
      if (latestBlock) {
        throw createAppError(409, 'Blockchain-anchored batches cannot be deleted from the legacy inventory form');
      }

      await batchModel.deleteBatch(connection, batchId);
    });

    res.json({
      message: 'Inventory item deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listInventory,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
};
