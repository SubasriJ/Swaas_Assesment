const eventService = require('../Services/listService');

exports.getUpcomingEvents = async (req, res) => {
  try {
    console.log('Fetching upcoming events for user:', req.user.email);

    // Call the service to execute the stored procedure
    const events = await eventService.getUpcomingEvents();

    // Send success response
    console.log('Fetched events:', { count: events.length });
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching upcoming events:', error.message);
    res.status(500).json({ message: error.message || 'Failed to fetch upcoming events' });
  }
};

// Include createEvent from your previous request
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