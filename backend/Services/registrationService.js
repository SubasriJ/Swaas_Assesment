const pool = require('../config/db');

exports.checkRegistrationExists = async (email, eventId) => {
  try {
    const connection = await pool.getConnection();
    try {
      console.log('Calling check_registration_exists with email:', email, 'eventId:', eventId);
      const [results] = await connection.execute('CALL check_registration_exists(?, ?)', [email, eventId]);
      console.log('Check registration results:', results[0]);
      return results[0][0]; // First row of the first result set
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database error in checkRegistrationExists:', error.message);
    throw new Error('Database error: ' + error.message);
  }
};

exports.updateRegistration = async (email, eventId) => {
  try {
    const connection = await pool.getConnection();
    try {
      console.log('Calling update_registration_by_email with email:', email, 'eventId:', eventId);
      const [results] = await connection.execute('CALL update_registration_by_email(?, ?)', [email, eventId]);
      console.log('Update registration results:', results[0]);
      return results[0][0];
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database error in updateRegistration:', error.message);
    throw new Error('Database error: ' + error.message);
  }
};

exports.deleteRegistration = async (email, eventId) => {
  try {
    const connection = await pool.getConnection();
    try {
      console.log('Calling delete_registration_by_email with email:', email, 'eventId:', eventId);
      const [results] = await connection.execute('CALL delete_registration_by_email(?, ?)', [email, eventId]);
      console.log('Delete registration results:', results[0]);
      return results[0][0];
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database error in deleteRegistration:', error.message);
    throw new Error('Database error: ' + error.message);
  }
};