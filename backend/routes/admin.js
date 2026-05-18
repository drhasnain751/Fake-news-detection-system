const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const { getUsers, toggleUser, deleteUser, getStats, retrainModel, getModelStatus, getAllPredictions } = require('../controllers/adminController');

const router = express.Router();

router.use(protect, adminOnly);
router.get('/stats', getStats);
router.get('/users', getUsers);
router.patch('/users/:id/toggle', toggleUser);
router.delete('/users/:id', deleteUser);
router.get('/predictions', getAllPredictions);
router.post('/retrain', retrainModel);
router.get('/model-status', getModelStatus);

module.exports = router;
