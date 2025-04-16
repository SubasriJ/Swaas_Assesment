const pool = require('../config/db');

exports.getOrganizerByEventId = async (eventId) => {
  try {
    // Get connection from pool
    const connection = await pool.getConnection();

    try {
      // Call the stored procedure
      const query = 'CALL fetch_organizer_by_user_id(?)';
      console.log('Executing stored procedure: fetch_organizer_by_user_id with eventId:', eventId);
      const [results] = await connection.execute(query, [eventId]);

      // Log results
      console.log('Stored procedure results:', results[0]);

      // Check if the result contains a message (indicating no organizer found)
      if (results[0] && results[0].message) {
        return { message: results[0].message };
      }

      // Return the organizer details
      return results[0][0]; // First row of the first result set
    } finally {
      // Always release connection
      connection.release();
    }
  } catch (error) {
    console.error('Database error in getOrganizerByEventId:', error.message);
    throw new Error('Database error: ' + error.message);
  }
};