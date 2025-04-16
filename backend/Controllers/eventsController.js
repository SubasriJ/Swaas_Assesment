const eventService = require('../Services/eventService');

exports.createEvent = async (req, res) => {
  try {
    const { title, date, time, location, description, category, organizer_email } = req.body;

    // Basic validation
    if (!title || !date || !time || !location || !description || !category || !organizer_email) {
      console.log('Validation failed:', req.body);
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Call the service to execute the stored procedure
    console.log('Creating event:', { title, organizer_email });
    const result = await eventService.createEvent({
      title,
      date,
      time,
      location,
      description,
      category,
      organizer_email,
    });

    // Send success response
    console.log('Event created:', { event_id: result.event_id, message: result.message });
    res.status(201).json({ message: result.message, event_id: result.event_id });
  } catch (error) {
    console.error('Error creating event:', error.message);
    res.status(500).json({ message: error.message || 'Failed to create event' });
  }
};