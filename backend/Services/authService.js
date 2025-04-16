const pool = require('../config/db');
const bcrypt = require('bcryptjs');

class AuthError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const registerUser = async ({ role, name, email, phone, yearOfStudy, dob, password, description }) => {
  // Validate common inputs
  if (!role || !name || !email || !phone || !password) {
    throw new AuthError('Role, name, email, phone, and password are required', 400);
  }
  if (!['student', 'organizer'].includes(role)) {
    throw new AuthError('Invalid role', 400);
  }

  // Email validation
  if (!/@/.test(email)) {
    throw new AuthError('Email must contain @ symbol', 400);
  }

  // Password validation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
  if (!passwordRegex.test(password)) {
    throw new AuthError(
      'Password must be at least 8 characters with lowercase, uppercase, and symbols',
      400
    );
  }

  // Check if email exists in relevant table
  if (role === 'student') {
    const [existing] = await pool.query('SELECT email FROM user WHERE email = ?', [email]);
    if (existing.length > 0) {
      throw new AuthError('Email already registered', 409);
    }
  } else {
    const [existing] = await pool.query('SELECT email FROM organizer WHERE email = ?', [email]);
    if (existing.length > 0) {
      throw new AuthError('Email already registered', 409);
    }
  }

  // Role-specific validation
  if (role === 'student') {
    if (!yearOfStudy || !['1', '2', '3', '4'].includes(yearOfStudy)) {
      throw new AuthError('Invalid year of study', 400);
    }
    if (!dob || !/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
      throw new AuthError('Invalid date of birth (YYYY-MM-DD)', 400);
    }
  } else {
    if (!description || description.trim() === '') {
      throw new AuthError('Description is required for organizers', 400);
    }
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert based on role
  if (role === 'student') {
    await pool.query(
      'INSERT INTO user (name, email, phone, year_of_study, password, date_of_birth) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, phone, yearOfStudy, hashedPassword, dob]
    );
  } else {
    const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    await pool.query(
      'INSERT INTO organizer (name, email, phone, password, created_at, description) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, phone, hashedPassword, createdAt, description]
    );
  }

  return { success: true };
};

module.exports = { registerUser };