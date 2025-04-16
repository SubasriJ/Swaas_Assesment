import React, { useState, useEffect } from 'react';
import { Event } from '../../types/Event';
import { FaInfoCircle } from 'react-icons/fa';
import '../../styles/events/EventItem.css';
import axios from 'axios';

interface EventItemProps {
  event: Event;
  isRegistered: boolean;
  onRegister: (eventId: string) => Promise<boolean>;
  onCancel: (eventId: string) => Promise<boolean>;
}

interface OrganizerDetails {
  name: string;
  email: string;
  phone: string;
  description: string;
}

const EventItem: React.FC<EventItemProps> = ({
  event,
  isRegistered,
  onRegister,
  onCancel,
}) => {
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  const [registerPopupMessage, setRegisterPopupMessage] = useState('');
  const [showEventModal, setShowEventModal] = useState(false);
  const [showOrganizerModal, setShowOrganizerModal] = useState(false);
  const [organizerDetails, setOrganizerDetails] = useState<OrganizerDetails | null>(null);
  const [organizerError, setOrganizerError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch organizer details
  useEffect(() => {
    const fetchOrganizer = async () => {
      let attempts = 0;
      const maxAttempts = 2;

      while (attempts < maxAttempts) {
        attempts++;
        console.log(`[EventItem ${event.id}] Fetching organizer - Attempt ${attempts} for event ID:`, event.id);
        try {
          const token = localStorage.getItem('token');
          console.log(`[EventItem ${event.id}] Token:`, token ? '[Present]' : '[Missing]');
          if (!token) {
            setOrganizerError('Authentication token missing');
            console.log(`[EventItem ${event.id}] No token, setting error`);
            return;
          }

          const response = await axios.get(`http://localhost:3000/api/organizers/${event.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log(`[EventItem ${event.id}] Organizer API response:`, response.data);

          const fetchedDetails: OrganizerDetails = {
            name: response.data.name || event.organizer_name || 'Unknown',
            email: response.data.email || 'Not provided',
            phone: response.data.phone || 'Not provided',
            description: response.data.description || `About ${response.data.name || event.organizer_name || 'Unknown'}: A dedicated group organizing ${event.category.toLowerCase()} events on campus.`,
          };
          console.log(`[EventItem ${event.id}] Setting organizer details:`, fetchedDetails);
          setOrganizerDetails(fetchedDetails);
          setOrganizerError(null);
          return; // Success, exit loop
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.error(`[EventItem ${event.id}] Error fetching organizer (Attempt ${attempts}):`, errorMessage);
          if (attempts === maxAttempts) {
            console.warn(`[EventItem ${event.id}] Max attempts reached, using fallback`);
            setOrganizerError(errorMessage || 'Failed to fetch organizer details');
            const fallbackDetails: OrganizerDetails = {
              name: event.organizer_name || 'Unknown',
              email: `contact@${(event.organizer_name || 'unknown').toLowerCase().replace(/\s+/g, '')}.com`,
              phone: 'Not provided',
              description: `About ${event.organizer_name || 'Unknown'}: A dedicated group organizing ${event.category.toLowerCase()} events on campus.`,
            };
            console.log(`[EventItem ${event.id}] Setting fallback organizer details:`, fallbackDetails);
            setOrganizerDetails(fallbackDetails);
          }
        }
      }
    };

    console.log(`[EventItem ${event.id}] Triggering organizer fetch`);
    fetchOrganizer();
  }, [event.id, event.organizer_name, event.category]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleRegister = async () => {
    if (isProcessing) return;
    
    console.log(`[EventItem ${event.id}] Handling register`);
    setIsProcessing(true);
    setRegisterPopupMessage('Registering...');
    setShowRegisterPopup(true);
    
    try {
      const success = await onRegister(event.id);
      
      if (success) {
        setRegisterPopupMessage('Successfully registered!');
      } else {
        setRegisterPopupMessage('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error(`[EventItem ${event.id}] Error during registration:`, error);
      setRegisterPopupMessage('Registration failed. Please try again.');
    } finally {
      setTimeout(() => {
        setShowRegisterPopup(false);
        setIsProcessing(false);
        console.log(`[EventItem ${event.id}] Register popup closed`);
      }, 2000);
    }
  };

  const handleCancel = async () => {
    if (isProcessing) return;
    
    console.log(`[EventItem ${event.id}] Handling cancel`);
    setIsProcessing(true);
    setRegisterPopupMessage('Canceling registration...');
    setShowRegisterPopup(true);
    
    try {
      const success = await onCancel(event.id);
      
      if (success) {
        setRegisterPopupMessage('Registration canceled!');
      } else {
        setRegisterPopupMessage('Cancellation failed. Please try again.');
      }
    } catch (error) {
      console.error(`[EventItem ${event.id}] Error during cancellation:`, error);
      setRegisterPopupMessage('Cancellation failed. Please try again.');
    } finally {
      setTimeout(() => {
        setShowRegisterPopup(false);
        setIsProcessing(false);
        console.log(`[EventItem ${event.id}] Cancel popup closed`);
      }, 2000);
    }
  };

  console.log(`[EventItem ${event.id}] Rendering - isRegistered:`, isRegistered, 'isProcessing:', isProcessing);

  return (
    <div className="event-item">
      <h3>
        {event.title}
        <FaInfoCircle
          className="info-icon"
          onClick={(e) => {
            e.stopPropagation();
            console.log(`[EventItem ${event.id}] Opening event modal`);
            setShowEventModal(true);
          }}
        />
      </h3>
      <p><strong>Date:</strong> {formatDate(event.event_date)}</p>
      <p><strong>Time:</strong> {event.event_time}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Category:</strong> {event.category}</p>
      <p>
        <strong>Organizer:</strong> {event.organizer_name}
        <FaInfoCircle
          className="info-icon"
          onClick={(e) => {
            e.stopPropagation();
            console.log(`[EventItem ${event.id}] Opening organizer modal`);
            setShowOrganizerModal(true);
          }}
        />
      </p>
      <p><strong>Registered:</strong> {event.registeredStudents}</p>
      
      {isRegistered ? (
        <button 
          className={`register-button ${isProcessing ? 'disabled' : ''}`} 
          onClick={(e) => { 
            e.stopPropagation(); 
            if (!isProcessing) handleCancel(); 
          }}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Cancel Registration'}
        </button>
      ) : (
        <button 
          className={`register-button ${isProcessing ? 'disabled' : ''}`} 
          onClick={(e) => { 
            e.stopPropagation(); 
            if (!isProcessing) handleRegister(); 
          }}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Register'}
        </button>
      )}
      
      {showRegisterPopup && (
        <div className="popup-notification">
          {registerPopupMessage}
        </div>
      )}
      
      {showEventModal && (
        <div className="modal-overlay" onClick={() => {
          console.log(`[EventItem ${event.id}] Closing event modal`);
          setShowEventModal(false);
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{event.title} <button className="close-button" onClick={() => {
              console.log(`[EventItem ${event.id}] Closing event modal via button`);
              setShowEventModal(false);
            }}>×</button></h2>
            <p><strong>Description:</strong></p>
            <p>{event.description}</p>
            <p><strong>Date:</strong> {formatDate(event.event_date)}</p>
            <p><strong>Time:</strong> {event.event_time}</p>
            <p><strong>Organizer:</strong> {event.organizer_name}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>Registered Students:</strong> {event.registeredStudents}</p>
          </div>
        </div>
      )}
      
      {showOrganizerModal && (
        <div className="modal-overlay" onClick={() => {
          console.log(`[EventItem ${event.id}] Closing organizer modal`);
          setShowOrganizerModal(false);
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{event.organizer_name} <button className="close-button" onClick={() => {
              console.log(`[EventItem ${event.id}] Closing organizer modal via button`);
              setShowOrganizerModal(false);
            }}>×</button></h2>
            {organizerError ? (
              <p className="error-message">{organizerError}</p>
            ) : organizerDetails ? (
              <>
                <p><strong>Name:</strong> {organizerDetails.name}</p>
                <p><strong>Email:</strong> {organizerDetails.email}</p>
                <p><strong>Phone:</strong> {organizerDetails.phone}</p>
                <p><strong>About:</strong> {organizerDetails.description}</p>
              </>
            ) : (
              <p>Loading organizer details...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventItem;