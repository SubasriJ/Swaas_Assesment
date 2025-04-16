const express = require('express');
const router = express.Router();
const registrationController = require('../Controllers/registrationController');
const auth = require('../Middleware/list');

router.get('/check/:eventId', auth, registrationController.checkRegistration);
router.post('/', auth, registrationController.updateRegistration);
router.delete('/', auth, registrationController.deleteRegistration);

module.exports = router;