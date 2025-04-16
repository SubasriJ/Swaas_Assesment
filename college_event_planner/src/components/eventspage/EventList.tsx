import React, { useState, useEffect } from 'react';
import EventItem from './EventItem';
import { Event } from '../../types/Event';
import '../../styles/events/EventList.css';
import { FaShare } from 'react-icons/fa';

interface EventListProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  registeredEvents: string[];
  onRegister: (eventId: string) => Promise<boolean>;
  onCancel: (eventId: string) => Promise<boolean>;
}

const EventList: React.FC<EventListProps> = ({
  events,
  onEventClick,
  registeredEvents,
  onRegister,
  onCancel,
}) => {
  console.log('[EventList] Rendering with events:', events.length, 'registeredEvents:', registeredEvents);
  
  const [showShareMenu, setShowShareMenu] = useState<string | null>(null);
  
  const handleShareButtonClick = (e: React.MouseEvent, eventId: string) => {
    e.stopPropagation();
    setShowShareMenu(prev => prev === eventId ? null : eventId);
  };
  
  const handleShareClick = (e: React.MouseEvent, event: Event) => {
    e.stopPropagation();
    
    // Create sharable content
    const shareData = {
      title: `${event.title} - Campus Event`,
      text: `Check out this event: ${event.title} on ${new Date(event.event_date).toLocaleDateString()} at ${event.location}`,
      url: window.location.href,
    };
    
    // Use Web Share API if available
    if (navigator.share) {
      navigator.share(shareData)
        .then(() => console.log(`[EventList] Shared event: ${event.id}`))
        .catch((error) => console.error('[EventList] Error sharing:', error));
    } else {
      // Fallback for browsers that don't support Web Share API
      try {
        navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        alert('Event details copied to clipboard!');
      } catch (err) {
        console.error('[EventList] Clipboard copy failed:', err);
        alert('Unable to share. Please copy the URL manually.');
      }
    }
    
    setShowShareMenu(null);
  };

  // Click outside to close share menu
  useEffect(() => {
    const handleClickOutside = () => {
      setShowShareMenu(null);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="event-list">
      {events.length === 0 ? (
        <p className="no-events">No events found</p>
      ) : (
        events.map((event) => (
          <div
            key={event.id}
            className="event-list-item"
            onClick={() => onEventClick(event)}
          >
            <EventItem
              event={event}
              isRegistered={registeredEvents.includes(event.id)}
              onRegister={onRegister}
              onCancel={onCancel}
            />
            
            {/* Share button at bottom-left */}
            <div 
              className="event-item-share"
              onClick={(e) => handleShareButtonClick(e, event.id)}
            >
              <FaShare />
            </div>
            
            {/* Share menu popup */}
            {showShareMenu === event.id && (
              <div className="event-share-menu" onClick={(e) => e.stopPropagation()}>
                <div 
                  className="share-option"
                  onClick={(e) => handleShareClick(e, event)}
                >
                  <FaShare /> Share Event
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default EventList;