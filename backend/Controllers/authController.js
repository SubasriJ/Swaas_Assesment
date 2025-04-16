const authService = require('../services/authService');

const register = async (req, res, next) => {
  try {
    const { role, name, email, phone, yearOfStudy, dob, password, description } = req.body;
    const result = await authService.registerUser({
      role,
      name,
      email,
      phone,
      yearOfStudy,
      dob,
      password,
      description,
    });
    res.status(201).json({ message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully` });
  } catch (err) {
    next(err); // Pass to global error handler
  }
};

module.exports = { register };