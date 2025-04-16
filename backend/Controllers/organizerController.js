const organizerService = require('../Services/organizerService');

exports.getOrganizerByEventId = async (req, res) => {
  try {
    const { eventId } = req.params;
    console.log('Fetching organizer for eventId:', eventId);

    // Validate eventId
    if (!eventId) {
      console.log('Validation failed: eventId missing');
      return res.status(400).json({ message: 'Event ID is required' });
    }

    // Call the service
    const organizer = await organizerService.getOrganizerByEventId(eventId);

    // Check if no organizer was found
    if (organizer.message) {
      console.log('No organizer found for eventId:', eventId);
      return res.status(404).json({ message: organizer.message });
    }

    // Send success response
    console.log('Fetched organizer:', organizer);
    res.status(200).json(organizer);
  } catch (error) {
    console.error('Error fetching organizer:', error.message);
    res.status(500).json({ message: error.message || 'Failed to fetch organizer' });
  }
};