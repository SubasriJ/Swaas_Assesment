// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');
const validate = require('../middleware/validate');

router.post('/register', validate.register, authController.register);

module.exports = router;