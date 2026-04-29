const { pool } = require('../config/db');
const userModel = require('../models/userModel');
const { createAppError } = require('../services/appError');
const { generateKeyPair } = require('../services/signatureService');

const ALLOWED_ROLES = new Set(['manufacturer', 'distributor', 'pharmacy']);

async function registerUser(req, res, next) {
  try {
    const name = req.body.name?.trim();
    const role = req.body.role;

    if (!name) {
      throw createAppError(400, 'name is required');
    }

    if (!ALLOWED_ROLES.has(role)) {
      throw createAppError(400, 'role must be manufacturer, distributor, or pharmacy');
    }

    const { publicKey, privateKey } = generateKeyPair();
    const user = await userModel.createUser(pool, {
      name,
      role,
      publicKey,
      privateKey,
    });

    res.status(201).json({
      message: 'User registered successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
}

async function listUsers(_req, res, next) {
  try {
    const users = await userModel.listUsers(pool);
    res.json(users);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  registerUser,
  listUsers,
};
