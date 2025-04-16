const pool = require('../config/db');

exports.getUpcomingEvents = async () => {
    try {
      // Get connection from pool
      const connection = await pool.getConnection();
  
      try {
        // Call the new stored procedure
        const query = 'CALL fetch_upcoming_events_with_description()';
        console.log('Executing stored procedure: fetch_upcoming_events_with_description');
        const [results] = await connection.execute(query);
  
        // Log results
        console.log('Stored procedure results:', results[0]);
  
        // Return the events array
        return results[0]; // Stored procedure returns events in the first result set
      } finally {
        // Always release connection
        connection.release();
      }
    } catch (error) {
      console.error('Database error in getUpcomingEvents:', error.message);
      throw new Error('Database error: ' + error.message);
    }
  };