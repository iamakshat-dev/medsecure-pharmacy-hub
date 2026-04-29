const express = require('express');

const batchController = require('../controllers/batchController');
const blockchainController = require('../controllers/blockchainController');
const inventoryController = require('../controllers/inventoryController');
const medicineController = require('../controllers/medicineController');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/blockchain/health', blockchainController.getBlockchainHealth);

router.post('/users/register', userController.registerUser);
router.get('/users', userController.listUsers);

router.post('/medicine-catalog', medicineController.createMedicine);
router.get('/medicine-catalog', medicineController.listMedicines);

router.get('/inventory', inventoryController.listInventory);
router.get('/medicines', inventoryController.listInventory);
router.post('/inventory', inventoryController.createInventoryItem);
router.post('/medicines', inventoryController.createInventoryItem);
router.put('/inventory/:batchId', inventoryController.updateInventoryItem);
router.put('/medicines/:batchId', inventoryController.updateInventoryItem);
router.delete('/inventory/:batchId', inventoryController.deleteInventoryItem);
router.delete('/medicines/:batchId', inventoryController.deleteInventoryItem);

router.post('/batch/create', batchController.createBatch);
router.post('/batch/transfer', batchController.transferBatch);
router.get('/batch/verify/:batchId', blockchainController.verifyBatch);
router.get('/batch/history/:batchId', blockchainController.getBatchHistory);

module.exports = router;
