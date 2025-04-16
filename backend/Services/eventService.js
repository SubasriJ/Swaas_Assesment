const pool = require('../config/db');

exports.createEvent = async (eventData) => {
  const { title, date, time, location, description, category, organizer_email } = eventData;

  try {
    // Get connection from pool
    const connection = await pool.getConnection();

    try {
      // Call the stored procedure
      const query = 'CALL create_event_by_organizer_email(?, ?, ?, ?, ?, ?, ?)';
      console.log('Executing stored procedure:', { title, organizer_email });
      const [results] = await connection.execute(query, [
        title,
        date,
        time,
        location,
        description,
        category,
        organizer_email,
      ]);

      // Log results
      console.log('Stored procedure results:', results[0]);

      // Return the result
      return results[0][0]; // Assumes procedure returns [{ event_id, message }]
    } finally {
      // Always release connection
      connection.release();
    }
  } catch (error) {
    console.error('Database error in createEvent:', error.message);
    throw new Error('Database error: ' + error.message);
  }
};