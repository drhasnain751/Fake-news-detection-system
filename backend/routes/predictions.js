const express = require('express');
const { analyze, getHistory, getAnalytics, deletePrediction } = require('../controllers/predictionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.post('/analyze', analyze);
router.get('/history', getHistory);
router.get('/analytics', getAnalytics);
router.delete('/:id', deletePrediction);

module.exports = router;
