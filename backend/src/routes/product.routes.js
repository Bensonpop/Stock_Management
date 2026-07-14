const express = require('express');
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/product.controller');
const { authMiddleware, authorize  } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', authMiddleware, authorize('Admin'), createProduct);
router.get('/', authMiddleware, getProducts);
router.get('/:id', authMiddleware, getProductById);
router.put('/:id',authMiddleware, authorize('Admin'), updateProduct);
router.delete('/:id', authMiddleware, authorize('Admin'), deleteProduct);

module.exports = router;