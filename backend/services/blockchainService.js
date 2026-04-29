const { pool, withTransaction } = require('../config/db');
const batchModel = require('../models/batchModel');
const blockchainModel = require('../models/blockchainModel');
const medicineModel = require('../models/medicineModel');
const transactionModel = require('../models/transactionModel');
const userModel = require('../models/userModel');
const { createAppError } = require('./appError');
const {
  computeBlockHash,
  computeDataHash,
  getCurrentTimestamp,
} = require('./hashService');
const { signHash, verifySignature } = require('./signatureService');

const ALLOWED_ROLE_TRANSITIONS = {
  manufacturer: 'distributor',
  distributor: 'pharmacy',
};

function toInteger(value, fieldName) {
  const parsedValue = Number.parseInt(value, 10);
  if (Number.isNaN(parsedValue)) {
    throw createAppError(400, `${fieldName} must be a valid integer`);
  }

  return parsedValue;
}

function validateQuantity(quantity) {
  if (!Number.isInteger(quantity) || quantity < 0) {
    throw createAppError(400, 'Quantity cannot be negative');
  }
}

function toPrice(value) {
  const parsedValue = Number.parseFloat(value);
  if (Number.isNaN(parsedValue) || parsedValue < 0) {
    throw createAppError(400, 'Price must be a non-negative number');
  }

  return parsedValue;
}

function validateDates(manufactureDate, expiryDate) {
  if (!manufactureDate || !expiryDate) {
    throw createAppError(400, 'Manufacture date and expiry date are required');
  }

  if (new Date(manufactureDate) > new Date(expiryDate)) {
    throw createAppError(400, 'Manufacture date cannot be after expiry date');
  }
}

async function appendBlockchainBlock(connection, payload) {
  const latestBlock = await blockchainModel.findLatestBlock(connection);
  const previousHash = latestBlock ? latestBlock.current_hash : '0';

  const dataHash = computeDataHash({
    batchId: payload.batchId,
    medicineId: payload.medicineId,
    quantity: payload.quantity,
    ownerId: payload.ownerId,
    timestamp: payload.timestamp,
    manufactureDate: payload.manufactureDate,
    expiryDate: payload.expiryDate,
    price: payload.price,
  });

  const signature = signHash(dataHash, payload.privateKey);
  const currentHash = computeBlockHash({
    dataHash,
    previousHash,
    timestamp: payload.timestamp,
  });

  return blockchainModel.insertBlock(connection, {
    batchId: payload.batchId,
    dataHash,
    previousHash,
    currentHash,
    actorId: payload.actorId,
    signature,
    timestamp: payload.timestamp,
  });
}

async function createBatch(payload) {
  const batchId = payload.batchId?.trim();
  const medicineId = toInteger(payload.medicineId, 'medicineId');
  const quantity = toInteger(payload.quantity, 'quantity');
  const manufacturerId = toInteger(payload.actorId, 'actorId');
  const price = payload.price !== undefined ? toPrice(payload.price) : 0;
  const manufactureDate = payload.manufactureDate;
  const expiryDate = payload.expiryDate;

  if (!batchId) {
    throw createAppError(400, 'batchId is required');
  }

  validateQuantity(quantity);
  validateDates(manufactureDate, expiryDate);

  return withTransaction(async (connection) => {
    const existingBatch = await batchModel.findBatchById(connection, batchId);
    if (existingBatch) {
      throw createAppError(409, 'Batch ID must be unique');
    }

    const manufacturer = await userModel.findUserById(connection, manufacturerId);
    if (!manufacturer || manufacturer.role !== 'manufacturer') {
      throw createAppError(403, 'Only a manufacturer can create a batch');
    }

    const medicine = await medicineModel.findMedicineById(connection, medicineId);
    if (!medicine) {
      throw createAppError(404, 'Medicine not found');
    }

    if (medicine.manufacturer_id !== manufacturer.id) {
      throw createAppError(403, 'Manufacturer does not own the selected medicine');
    }

    const timestamp = getCurrentTimestamp();

    const batch = await batchModel.createBatch(connection, {
      batchId,
      medicineId,
      quantity,
      price,
      manufactureDate,
      expiryDate,
      currentOwner: manufacturer.id,
    });

    const transaction = await transactionModel.createTransaction(connection, {
      batchId,
      action: 'CREATE',
      fromActorId: null,
      toActorId: manufacturer.id,
      quantitySnapshot: quantity,
      remarks: 'Batch created by manufacturer',
      timestamp,
    });

    const block = await appendBlockchainBlock(connection, {
      batchId,
      medicineId,
      quantity,
      ownerId: manufacturer.id,
      actorId: manufacturer.id,
      privateKey: manufacturer.private_key,
      manufactureDate,
      expiryDate,
      price,
      timestamp,
    });

    return {
      batch,
      transaction,
      block,
    };
  });
}

async function transferBatch(payload) {
  const batchId = payload.batchId?.trim();
  const fromActorId = toInteger(payload.fromActorId, 'fromActorId');
  const toActorId = toInteger(payload.toActorId, 'toActorId');

  if (!batchId) {
    throw createAppError(400, 'batchId is required');
  }

  if (fromActorId === toActorId) {
    throw createAppError(400, 'Ownership transfer requires two different actors');
  }

  return withTransaction(async (connection) => {
    const batch = await batchModel.findBatchById(connection, batchId);
    if (!batch) {
      throw createAppError(404, 'Batch not found');
    }

    const fromActor = await userModel.findUserById(connection, fromActorId);
    const toActor = await userModel.findUserById(connection, toActorId);

    if (!fromActor || !toActor) {
      throw createAppError(404, 'Both source and destination users must exist');
    }

    if (batch.current_owner !== fromActor.id) {
      throw createAppError(403, 'Ownership must be validated before transfer');
    }

    const expectedTargetRole = ALLOWED_ROLE_TRANSITIONS[fromActor.role];
    if (!expectedTargetRole || toActor.role !== expectedTargetRole) {
      throw createAppError(
        403,
        'Invalid ownership transition. Allowed flow is manufacturer -> distributor -> pharmacy',
      );
    }

    const timestamp = getCurrentTimestamp();

    await batchModel.updateBatchOwner(connection, {
      batchId,
      newOwnerId: toActor.id,
    });

    const transaction = await transactionModel.createTransaction(connection, {
      batchId,
      action: 'TRANSFER',
      fromActorId: fromActor.id,
      toActorId: toActor.id,
      quantitySnapshot: batch.quantity,
      remarks: `Transferred from ${fromActor.role} to ${toActor.role}`,
      timestamp,
    });

    const block = await appendBlockchainBlock(connection, {
      batchId,
      medicineId: batch.medicine_id,
      quantity: batch.quantity,
      ownerId: toActor.id,
      actorId: fromActor.id,
      privateKey: fromActor.private_key,
      manufactureDate: batch.manufacture_date,
      expiryDate: batch.expiry_date,
      price: batch.price,
      timestamp,
    });

    const updatedBatch = await batchModel.findBatchById(connection, batchId);

    return {
      batch: updatedBatch,
      transaction,
      block,
    };
  });
}

function verifyGlobalChain(blocks) {
  if (!blocks.length) {
    return { valid: false, reason: 'Blockchain is empty' };
  }

  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];
    const expectedCurrentHash = computeBlockHash({
      dataHash: block.data_hash,
      previousHash: block.previous_hash,
      timestamp: block.timestamp,
    });

    if (block.current_hash !== expectedCurrentHash) {
      return {
        valid: false,
        reason: `Chain broken at block ${block.id}: current hash mismatch`,
      };
    }

    if (index === 0) {
      if (block.previous_hash !== '0') {
        return {
          valid: false,
          reason: 'Genesis block is invalid',
        };
      }

      continue;
    }

    const previousBlock = blocks[index - 1];
    if (block.previous_hash !== previousBlock.current_hash) {
      return {
        valid: false,
        reason: `Chain broken at block ${block.id}: previous hash mismatch`,
      };
    }
  }

  return { valid: true, reason: 'Valid' };
}

async function verifyBatchIntegrity(batchId) {
  const batch = await batchModel.findBatchById(pool, batchId);
  if (!batch) {
    throw createAppError(404, 'Batch not found');
  }

  const batchBlocks = await blockchainModel.listBlocksByBatchId(pool, batchId);
  if (!batchBlocks.length) {
    return {
      valid: false,
      reason: 'No blockchain entries found for batch',
    };
  }

  const globalChain = await blockchainModel.listAllBlocks(pool);
  const globalChainCheck = verifyGlobalChain(globalChain);
  if (!globalChainCheck.valid) {
    return globalChainCheck;
  }

  const transactions = await transactionModel.listTransactionsByBatchId(pool, batchId);
  if (batchBlocks.length !== transactions.length) {
    return {
      valid: false,
      reason: 'Tampered: blockchain trail does not align with transaction log',
    };
  }

  for (let index = 0; index < batchBlocks.length; index += 1) {
    const block = batchBlocks[index];
    const transaction = transactions[index];

    if (!transaction) {
      return {
        valid: false,
        reason: 'Tampered: missing transaction for blockchain block',
      };
    }

    const expectedDataHash = computeDataHash({
      batchId: block.batch_id,
      medicineId: batch.medicine_id,
      quantity: transaction.quantity_snapshot,
      ownerId: transaction.to_actor_id,
      timestamp: block.timestamp,
      manufactureDate: batch.manufacture_date,
      expiryDate: batch.expiry_date,
      price: batch.price,
    });

    if (block.data_hash !== expectedDataHash) {
      return {
        valid: false,
        reason: 'Tampered: blockchain data hash does not match operational data',
      };
    }

    const actor = await userModel.findUserById(pool, block.actor_id);
    if (!actor) {
      return {
        valid: false,
        reason: 'Signature invalid: actor not found',
      };
    }

    const isSignatureValid = verifySignature(block.data_hash, block.signature, actor.public_key);
    if (!isSignatureValid) {
      return {
        valid: false,
        reason: 'Signature invalid',
      };
    }
  }

  const latestBlock = batchBlocks[batchBlocks.length - 1];
  const latestTransaction = transactions[transactions.length - 1];

  const expectedLatestHash = computeDataHash({
    batchId: batch.batch_id,
    medicineId: batch.medicine_id,
    quantity: batch.quantity,
    ownerId: batch.current_owner,
    timestamp: latestBlock.timestamp,
    manufactureDate: batch.manufacture_date,
    expiryDate: batch.expiry_date,
    price: batch.price,
  });

  if (latestBlock.data_hash !== expectedLatestHash) {
    return {
      valid: false,
      reason: 'Tampered: latest operational record does not match blockchain hash',
    };
  }

  if (latestTransaction.to_actor_id !== batch.current_owner) {
    return {
      valid: false,
      reason: 'Tampered: latest ownership does not match transaction trail',
    };
  }

  if (latestTransaction.quantity_snapshot !== batch.quantity) {
    return {
      valid: false,
      reason: 'Tampered: quantity snapshot does not match latest batch quantity',
    };
  }

  return {
    valid: true,
    reason: 'Valid',
    hash_match: true,
    signature_valid: true,
    chain_valid: true,
    recorded_hash: latestBlock.data_hash,
    expected_hash: expectedLatestHash,
    latest_actor: {
      id: latestTransaction.from_actor_id || latestTransaction.to_actor_id,
      name: latestTransaction.from_actor_name || latestTransaction.to_actor_name,
      role: latestTransaction.from_actor_role || latestTransaction.to_actor_role,
    },
    current_owner: batch.current_owner,
  };
}

async function getBatchHistory(batchId) {
  const batch = await batchModel.findBatchById(pool, batchId);
  if (!batch) {
    throw createAppError(404, 'Batch not found');
  }

  const chain = await blockchainModel.listBlocksByBatchId(pool, batchId);
  const transactions = await transactionModel.listTransactionsByBatchId(pool, batchId);
  const verification = await verifyBatchIntegrity(batchId);

  const trail = chain.map((block, index) => ({
    block_id: block.id,
    batch_id: block.batch_id,
    data_hash: block.data_hash,
    previous_hash: block.previous_hash,
    current_hash: block.current_hash,
    actor: {
      id: block.actor_id,
      name: block.actor_name,
      role: block.actor_role,
    },
    signature: block.signature,
    timestamp: block.timestamp,
    transaction: transactions[index]
      ? {
          id: transactions[index].id,
          action: transactions[index].action,
          from_actor: {
            id: transactions[index].from_actor_id,
            name: transactions[index].from_actor_name,
            role: transactions[index].from_actor_role,
          },
          to_actor: {
            id: transactions[index].to_actor_id,
            name: transactions[index].to_actor_name,
            role: transactions[index].to_actor_role,
          },
          quantity_snapshot: transactions[index].quantity_snapshot,
          remarks: transactions[index].remarks,
          timestamp: transactions[index].timestamp,
        }
      : null,
  }));

  return {
    batch,
    verification,
    actors_involved: Array.from(
      new Map(
        trail
          .filter((entry) => entry.actor.id)
          .map((entry) => [
            entry.actor.id,
            entry.actor,
          ]),
      ).values(),
    ),
    blockchain_trail: trail,
  };
}

async function getBlockchainHealth() {
  const totalBlocks = await blockchainModel.countBlocks(pool);

  return {
    total_blocks: totalBlocks,
    genesis_initialized: totalBlocks > 0,
  };
}

module.exports = {
  createBatch,
  transferBatch,
  verifyBatchIntegrity,
  getBatchHistory,
  getBlockchainHealth,
};
