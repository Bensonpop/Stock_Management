const express = require('express');
const { AdjustStock, getStockById, getStock,transferStock } = require('../controllers/stock.controller');
const { authMiddleware, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', authMiddleware, authorize('Admin'), AdjustStock);
router.get('/', authMiddleware, getStock);
router.get('/:id', authMiddleware, getStockById);
router.post('/transfer', authMiddleware, authorize('Admin'), transferStock);

module.exports = router;