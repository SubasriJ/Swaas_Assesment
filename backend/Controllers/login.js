const authService = require('../Services/loginService');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validate input
    if (!email || !password || !role) {
      console.log('Validation failed:', { email, password, role });
      return res.status(400).json({ error: 'Email, password, and role are required' });
    }
    if (!['student', 'organizer'].includes(role)) {
      console.log('Invalid role:', role);
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Authenticate user
    console.log('Attempting login:', { email: normalizedEmail, role });
    const user = await authService.authenticateUser(normalizedEmail, password, role);

    if (!user) {
      console.log('Authentication failed for:', { email: normalizedEmail, role });
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send response
    console.log('Login successful:', { userId: user.id, email: user.email, role });
    res.status(200).json({
      token,
      userId: user.id,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Server error during login' });
  }
};