const register = (req, res, next) => {
    const { role, name, email, phone, yearOfStudy, dob, password, description } = req.body;
  
    if (!role || !['student', 'organizer'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'Invalid name' });
    }
    if (!email || typeof email !== 'string' || !/@/.test(email)) {
      return res.status(400).json({ error: 'Invalid email' });
    }
    if (!phone || typeof phone !== 'string' || !/^\d{10}$/.test(phone)) {
      return res.status(400).json({ error: 'Invalid phone number (10 digits required)' });
    }
    if (!password || typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ error: 'Invalid password' });
    }
  
    if (role === 'student') {
      if (!yearOfStudy || !['1', '2', '3', '4'].includes(yearOfStudy)) {
        return res.status(400).json({ error: 'Invalid year of study' });
      }
      if (!dob || !/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
        return res.status(400).json({ error: 'Invalid date of birth (YYYY-MM-DD)' });
      }
    } else if (role === 'organizer') {
      if (!description || typeof description !== 'string' || description.trim() === '') {
        return res.status(400).json({ error: 'Invalid description' });
      }
    }
  
    next();
  };
  
  module.exports = { register };