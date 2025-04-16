const express = require('express');
const router = express.Router();
const eventController = require('../Controllers/eventsController');
const auth = require('../Middleware/auth');

router.post('/create', auth, eventController.createEvent);

module.exports = router;