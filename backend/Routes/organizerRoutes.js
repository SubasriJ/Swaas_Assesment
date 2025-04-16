const express = require('express');
const router = express.Router();
const organizerController = require('../Controllers/organizerController');
const auth = require('../Middleware/list');

router.get('/:eventId', auth, organizerController.getOrganizerByEventId);

module.exports = router;