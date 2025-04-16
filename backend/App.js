require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./Routes/authRoutes');
const organizerRoutes = require('./Routes/organizerRoutes');
const registrationRoutes = require('./Routes/registrationRoutes');
const eventRegistrations = require('./Routes/eventRegistrations');




const app = express();

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
  })
);

app.use(express.json());
app.use('/api/registrations', registrationRoutes);
app.use('/api/registrations', eventRegistrations);
app.use('/api/registrations', registrationRoutes);
app.use('/api/organizers', organizerRoutes);
app.use('/api/events', require('./Routes/list'));
app.use('/api/events', require('./Routes/eventRoutes'));
app.use('/api/auth', require('./Routes/login'));
app.use('/api/auth', authRoutes);
app.use('/api/events', require('./Routes/reviewRoutes.js'));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});