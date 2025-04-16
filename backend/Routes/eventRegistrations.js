const express = require('express');
const router = express.Router();
const eventRegistrationController = require('../Controllers/eventRegistrationController');
const auth = require('../Middleware/auth');

// Routes for event registrations
router.get('/past', auth, eventRegistrationController.getPastEvents);
router.get('/today', auth, eventRegistrationController.getTodayEvents);
router.get('/tomorrow', auth, eventRegistrationController.getTomorrowEvents);

module.exports = router;