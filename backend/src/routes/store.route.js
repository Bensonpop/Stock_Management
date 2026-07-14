const express = require('express');
const { createStore, getStores, getStoreById, updateStore, deleteStore } = require('../controllers/store.controller');
const { authMiddleware, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', authMiddleware, authorize(['Admin']), createStore);    
router.get('/', authMiddleware, getStores);
router.get('/:id', authMiddleware, getStoreById);
router.put('/:id', authMiddleware, authorize(['Admin']), updateStore);
router.delete('/:id', authMiddleware, authorize(['Admin']), deleteStore);

module.exports = router;