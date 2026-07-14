const express = require('express');
const { register, login } = require('../controllers/auth.controller');
const router = express.Router();

// Publicly accessible Auth endpoints
router.post('/register', register);
router.post('/login', login);

module.exports = router;