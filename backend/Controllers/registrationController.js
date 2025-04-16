const registrationService = require('../Services/registrationService');

exports.checkRegistration = async (req, res) => {
  try {
    const { eventId } = req.params;
    const email = req.user.email; // From auth middleware
    console.log('Checking registration for email:', email, 'eventId:', eventId);

    if (!eventId || !email) {
      console.log('Validation failed: eventId or email missing');
      return res.status(400).json({ message: 'Event ID and email are required' });
    }

    const result = await registrationService.checkRegistrationExists(email, eventId);
    console.log('Check registration result:', result);

    if (result.status.includes('User not found')) {
      return res.status(404).json({ message: result.status });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error checking registration:', error.message);
    res.status(500).json({ message: error.message || 'Failed to check registration' });
  }
};

exports.updateRegistration = async (req, res) => {
  try {
    const { eventId } = req.body;
    const email = req.user.email;
    console.log('Updating registration for email:', email, 'eventId:', eventId);

    if (!eventId || !email) {
      console.log('Validation failed: eventId or email missing');
      return res.status(400).json({ message: 'Event ID and email are required' });
    }

    const result = await registrationService.updateRegistration(email, eventId);
    console.log('Update registration result:', result);

    if (result.message.includes('User not found')) {
      return res.status(404).json({ message: result.message });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error updating registration:', error.message);
    res.status(500).json({ message: error.message || 'Failed to update registration' });
  }
};

exports.deleteRegistration = async (req, res) => {
  try {
    const { eventId } = req.body;
    const email = req.user.email;
    console.log('Deleting registration for email:', email, 'eventId:', eventId);

    if (!eventId || !email) {
      console.log('Validation failed: eventId or email missing');
      return res.status(400).json({ message: 'Event ID and email are required' });
    }

    const result = await registrationService.deleteRegistration(email, eventId);
    console.log('Delete registration result:', result);

    if (result.message.includes('not found')) {
      return res.status(404).json({ message: result.message });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error deleting registration:', error.message);
    res.status(500).json({ message: error.message || 'Failed to delete registration' });
  }
};