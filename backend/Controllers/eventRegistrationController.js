const eventRegistrationService = require('../Services/eventRegistrationService');

class EventRegistrationController {
  async getPastEvents(req, res) {
    try {
      const events = await eventRegistrationService.getPastEvents(req.user.email);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getTodayEvents(req, res) {
    try {
      const events = await eventRegistrationService.getTodayEvents(req.user.email);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getTomorrowEvents(req, res) {
    try {
      const events = await eventRegistrationService.getTomorrowEvents(req.user.email);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new EventRegistrationController();