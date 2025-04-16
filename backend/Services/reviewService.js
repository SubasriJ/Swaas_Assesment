
const pool = require('../config/db');

const createReview = async (event_id, email, rating, reviews) => {
  try {
    const query = `
      INSERT INTO reviews (event_id, email, rating, reviews)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [event_id, email, rating, reviews]);
    
    // Fetch the inserted review
    const [rows] = await pool.query('SELECT * FROM reviews WHERE id = ?', [result.insertId]);
    return rows[0];
  } catch (error) {
    console.error('[ReviewService] Error creating review:', error);
    throw new Error('Failed to create review');
  }
};

module.exports = { createReview };
