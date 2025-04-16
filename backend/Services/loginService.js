const pool = require('../config/db');
const bcrypt = require('bcrypt');

exports.authenticateUser = async (email, password, role) => {
  try {
    // Get connection from pool
    const connection = await pool.getConnection();

    try {
      // Determine table based on role
      const table = role === 'student' ? 'user' : 'organizer';

      // Query user by email
      const query = `SELECT id, email, password, ? AS role FROM ${table} WHERE email = ?`;
      console.log('Executing query:', { table, email });
      const [rows] = await connection.execute(query, [role, email]);

      // Log query results
      console.log('Query results:', { rowCount: rows.length, rows });

      // Check if user exists
      if (rows.length === 0) {
        console.log('No user found for:', { email, table });
        return null; // User not found
      }

      const user = rows[0];

      // Compare provided password with hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        console.log('Password mismatch for:', { email });
        return null; // Incorrect password
      }

      // Return user data
      console.log('User authenticated:', { id: user.id, email: user.email, role });
      return {
        id: user.id,
        email: user.email,
        role: user.role,
      };
    } finally {
      // Always release connection
      connection.release();
    }
  } catch (error) {
    console.error('Database error:', error.message);
    throw new Error('Database error: ' + error.message);
  }
};