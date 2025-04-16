// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/eventspage/Navbar';
import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import Login from './pages/Login';
import Events from './pages/Events';
import OrganizerDashboard from './pages/OrganizerDashboard';
import MyEvents from './pages/MyEvents'
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
        <Route path="/profile" element={<MyEvents />} />
        <Route
          path="/events"
          element={
            <>
              <Navbar />
              <Events />
            </>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;