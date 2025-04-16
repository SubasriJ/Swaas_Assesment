const express = require('express');
const router = express.Router();
const eventController = require('../Controllers/listController');
const auth = require('../Middleware/list');

router.get('/upcoming', auth, eventController.getUpcomingEvents);

module.exports = router;