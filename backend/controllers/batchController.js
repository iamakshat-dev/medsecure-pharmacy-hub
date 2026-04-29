const blockchainService = require('../services/blockchainService');

async function createBatch(req, res, next) {
  try {
    const result = await blockchainService.createBatch(req.body);
    res.status(201).json({
      message: 'Batch created and anchored to blockchain successfully',
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

async function transferBatch(req, res, next) {
  try {
    const result = await blockchainService.transferBatch(req.body);
    res.status(200).json({
      message: 'Batch transferred and blockchain updated successfully',
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createBatch,
  transferBatch,
};
