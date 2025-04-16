
const express = require('express');
const router = express.Router();
const reviewController = require('../Controllers/reviewController');
const authMiddleware = require('../Middleware/auth');

router.post('/:eventId/reviews', authMiddleware, reviewController.createReview);

module.exports = router;
