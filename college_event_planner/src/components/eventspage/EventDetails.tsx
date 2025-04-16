import React, { memo } from 'react';
import { Event } from '../../types/Event';
import { FaTimes, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaUsers } from 'react-icons/fa';
import '../../styles/events/EventDetails.css';

interface EventDetailsProps {
  event: Event | null;
  onClose: () => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event, onClose }) => {
  if (!event) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content event-details" onClick={(e) => e.stopPropagation()}>
        <div className="event-header">
          <h2>{event.title}</h2>
          <button className="close-button" onClick={onClose} aria-label="Close">
            <FaTimes />
          </button>
        </div>

        <div className="event-body">
          <section className="description-section">
            <h3>Description</h3>
            <p>{event.description || 'No description available'}</p>
          </section>

          <div className="event-metadata">
            <div className="metadata-item">
              <FaCalendarAlt className="metadata-icon" />
              <div>
                <h4>Date</h4>
                <p>{event.event_date ? formatDate(event.event_date) : 'TBD'}</p>
              </div>
            </div>

            <div className="metadata-item">
              <FaClock className="metadata-icon" />
              <div>
                <h4>Time</h4>
                <p>{event.event_time || 'TBD'}</p>
              </div>
            </div>

            <div className="metadata-item">
              <FaMapMarkerAlt className="metadata-icon" />
              <div>
                <h4>Location</h4>
                <p>{event.location || 'No location specified'}</p>
              </div>
            </div>

            <div className="metadata-item">
              <FaUsers className="metadata-icon" />
              <div>
                <h4>Registered</h4>
                <p>{event.registeredStudents || event.registration_count || 0}</p>
              </div>
            </div>
          </div>

          <section className="organizer-section">
            <h3>Organizer</h3>
            <p>{event.organizer_name || 'Unknown'}</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default memo(EventDetails);