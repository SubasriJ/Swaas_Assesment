const pool = require('../config/db');

class EventRegistrationService {
  async getPastEvents(email) {
    try {
      const [rows] = await pool.query('CALL get_user_registered_events_past(?)', [email]);
      return rows[0]; // First result set
    } catch (error) {
      console.error('[EventRegistrationService] Error in getPastEvents:', error.message);
      throw new Error('Failed to fetch past events');
    }
  }

  async getTodayEvents(email) {
    try {
      const [rows] = await pool.query('CALL get_user_registered_events_today(?)', [email]);
      return rows[0];
    } catch (error) {
      console.error('[EventRegistrationService] Error in getTodayEvents:', error.message);
      throw new Error('Failed to fetch today events');
    }
  }

  async getTomorrowEvents(email) {
    try {
      const [rows] = await pool.query('CALL get_user_registered_events_future(?)', [email]);
      const futureEvents = rows[0];
      console.log('[EventRegistrationService] Future events for tomorrow:', futureEvents);
      return futureEvents; // Return raw results without filtering
    } catch (error) {
      console.error('[EventRegistrationService] Error in getTomorrowEvents:', error.message);
      throw new Error('Failed to fetch tomorrow events');
    }
  }
}

module.exports = new EventRegistrationService();