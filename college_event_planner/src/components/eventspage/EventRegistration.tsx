import React, { useState } from 'react';
import '../../styles/events/EventRegistration.css';

interface EventRegistrationProps {
  eventId: string;
  onRegister: (eventId: string) => void;
  onCancel: (eventId: string) => void;
  isRegistered: boolean;
}

const EventRegistration: React.FC<EventRegistrationProps> = ({
  eventId,
  onRegister,
  onCancel,
  isRegistered,
}) => {
  const [message, setMessage] = useState('');

  const handleRegister = () => {
    onRegister(eventId);
    setMessage('Successfully registered!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleCancel = () => {
    onCancel(eventId);
    setMessage('Registration cancelled.');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="event-registration">
      {message && <p className="confirmation-message">{message}</p>}
      {isRegistered ? (
        <button className="cancel-button" onClick={handleCancel}>
          Cancel Registration
        </button>
      ) : (
        <button className="register-button" onClick={handleRegister}>
          Register
        </button>
      )}
    </div>
  );
};

export default EventRegistration;