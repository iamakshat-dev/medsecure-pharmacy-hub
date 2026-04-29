const { pool } = require('../config/db');
const medicineModel = require('../models/medicineModel');
const userModel = require('../models/userModel');
const { createAppError } = require('../services/appError');

async function createMedicine(req, res, next) {
  try {
    const name = req.body.name?.trim();
    const manufacturerId = Number.parseInt(req.body.manufacturerId, 10);

    if (!name) {
      throw createAppError(400, 'name is required');
    }

    if (Number.isNaN(manufacturerId)) {
      throw createAppError(400, 'manufacturerId must be a valid integer');
    }

    const manufacturer = await userModel.findUserById(pool, manufacturerId);
    if (!manufacturer || manufacturer.role !== 'manufacturer') {
      throw createAppError(404, 'Manufacturer not found');
    }

    const medicine = await medicineModel.createMedicine(pool, {
      name,
      manufacturerId,
    });

    res.status(201).json({
      message: 'Medicine created successfully',
      medicine,
    });
  } catch (error) {
    next(error);
  }
}

async function listMedicines(_req, res, next) {
  try {
    const medicines = await medicineModel.listMedicines(pool);
    res.json(medicines);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createMedicine,
  listMedicines,
};
