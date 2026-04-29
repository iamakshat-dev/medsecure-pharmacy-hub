const blockchainService = require('../services/blockchainService');

async function verifyBatch(req, res, next) {
  try {
    const result = await blockchainService.verifyBatchIntegrity(req.params.batchId);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function getBatchHistory(req, res, next) {
  try {
    const history = await blockchainService.getBatchHistory(req.params.batchId);
    res.json(history);
  } catch (error) {
    next(error);
  }
}

async function getBlockchainHealth(_req, res, next) {
  try {
    const health = await blockchainService.getBlockchainHealth();
    res.json(health);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  verifyBatch,
  getBatchHistory,
  getBlockchainHealth,
};
