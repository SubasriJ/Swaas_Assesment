
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/MyEvents.css';

interface Event {
  event_id: string;
  title: string;
  category: string;
  rating?: number;
  comment?: string;
}

const MyEvents: React.FC = () => {
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [todayEvents, setTodayEvents] = useState<Event[]>([]);
  const [futureEvents, setFutureEvents] = useState<Event[]>([]);
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'Past' | 'Today' | 'Future'>('Today');
  const [ratings, setRatings] = useState<{[key: string]: number}>({});
  const [comments, setComments] = useState<{[key: string]: string}>({});
  const [submitting, setSubmitting] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    const storedToken = localStorage.getItem('token');
    console.log('[MyEvents] Initial load - Email:', storedEmail || '[Missing]', 'Token:', storedToken ? '[Present]' : '[Missing]');
    setEmail(storedEmail);

    if (storedToken && storedEmail) {
      fetchEvents(storedToken, storedEmail);
    } else {
      console.warn('[MyEvents] Missing token or email, cannot fetch events');
      setError('Please log in to view your events');
      setIsLoading(false);
    }
  }, []);

  const fetchEvents = async (authToken: string, email: string) => {
    setIsLoading(true);
    setError(null);
    console.log('[MyEvents] Fetching events for email:', email);

    try {
      console.log('[MyEvents] Requesting past events');
      const pastResponse = await axios.get('http://localhost:3000/api/registrations/past', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      console.log('[MyEvents] Past events response:', pastResponse.data);
      setPastEvents(pastResponse.data);
      
      // Initialize ratings and comments from fetched data
      const initialRatings: {[key: string]: number} = {};
      const initialComments: {[key: string]: string} = {};
      pastResponse.data.forEach((event: Event) => {
        initialRatings[event.event_id] = event.rating || 0;
        initialComments[event.event_id] = event.comment || '';
      });
      setRatings(initialRatings);
      setComments(initialComments);

      console.log('[MyEvents] Requesting today events');
      const todayResponse = await axios.get('http://localhost:3000/api/registrations/today', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      console.log('[MyEvents] Today events response:', todayResponse.data);
      setTodayEvents(todayResponse.data);

      console.log('[MyEvents] Requesting future events');
      const futureResponse = await axios.get('http://localhost:3000/api/registrations/tomorrow', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      console.log('[MyEvents] Future events response:', futureResponse.data);
      setFutureEvents(futureResponse.data);
    } catch (err: unknown) {
      console.error('[MyEvents] Error fetching events:', err instanceof Error ? err.message : err);
      setError('Failed to load events. Please try again later.');
    } finally {
      setIsLoading(false);
      console.log('[MyEvents] Fetch complete - isLoading:', false);
    }
  };

  const handleRatingChange = (eventId: string, rating: number) => {
    setRatings(prev => ({
      ...prev,
      [eventId]: rating
    }));
  };

  const handleCommentChange = (eventId: string, comment: string) => {
    setComments(prev => ({
      ...prev,
      [eventId]: comment
    }));
  };

  const submitFeedback = async (eventId: string) => {
    setSubmitting(prev => ({
      ...prev,
      [eventId]: true
    }));

    // Simulate submission with a delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    alert('Successfully submitted');

    setSubmitting(prev => ({
      ...prev,
      [eventId]: false
    }));
  };

  const renderStarRating = (eventId: string) => {
    const currentRating = ratings[eventId] || 0;
    
    return (
      <div className="star-rating">
        <p className="rating-label">Rate this event:</p>
        <div className="stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${star <= currentRating ? 'selected' : ''}`}
              onClick={() => handleRatingChange(eventId, star)}
            >
              ★
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderEventList = (events: Event[], title: string) => {
    console.log(`[MyEvents] Rendering ${title} events:`, events);
    return (
      <div className="event-section animate-fade-in">
        <h2>{title}</h2>
        {events.length === 0 ? (
          <p className="no-events">No {title.toLowerCase()} events found.</p>
        ) : (
          <ul className="event-list">
            {events.map((event) => (
              <li key={event.event_id} className="event-item">
                <h3>{event.title}</h3>
                <p><strong>Category:</strong> {event.category}</p>
                
                {title === 'Past' && (
                  <div className="feedback-section">
                    {renderStarRating(event.event_id)}
                    
                    <div className="comment-section">
                      <textarea
                        placeholder="Share your thoughts about this event..."
                        value={comments[event.event_id] || ''}
                        onChange={(e) => handleCommentChange(event.event_id, e.target.value)}
                        className="comment-input"
                      />
                    </div>
                    
                    <button 
                      className="submit-feedback-btn"
                      onClick={() => submitFeedback(event.event_id)}
                      disabled={submitting[event.event_id]}
                    >
                      {submitting[event.event_id] ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                    
                    {(event.rating || event.comment) && (
                      <div className="previous-feedback">
                        <h4>Your Previous Feedback</h4>
                        {event.rating ? (
                          <div className="feedback-stars">
                            {Array.from({length: 5}).map((_, i) => (
                              <span key={i} className={`feedback-star ${i < (event.rating || 0) ? 'filled' : ''}`}>★</span>
                            ))}
                          </div>
                        ) : (
                          <p>No rating provided</p>
                        )}
                        <p className="feedback-comment">{event.comment || 'No comment provided'}</p>
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  console.log('[MyEvents] Rendering - isLoading:', isLoading, 'error:', error, 'pastEvents:', pastEvents, 'todayEvents:', todayEvents, 'futureEvents:', futureEvents);

  return (
    <div className="my-events-page">
      <h1 className="page-title">My Events</h1>
      {email ? <p className="greeting">Hi, {email}</p> : <p className="greeting">Hi, Guest</p>}
      {isLoading ? (
        <p className="loading">Loading events...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <>
          <div className="tab-container">
            <button
              className={`tab-button ${activeTab === 'Today' ? 'active' : ''}`}
              onClick={() => setActiveTab('Today')}
            >
              Today
            </button>
            <button
              className={`tab-button ${activeTab === 'Future' ? 'active' : ''}`}
              onClick={() => setActiveTab('Future')}
            >
              Future
            </button>
            <button
              className={`tab-button ${activeTab === 'Past' ? 'active' : ''}`}
              onClick={() => setActiveTab('Past')}
            >
              Past
            </button>
          </div>
          <div className="tab-content">
            {activeTab === 'Past' && renderEventList(pastEvents, 'Past')}
            {activeTab === 'Today' && renderEventList(todayEvents, 'Today')}
            {activeTab === 'Future' && renderEventList(futureEvents, 'Future')}
          </div>
        </>
      )}
    </div>
  );
};

export default MyEvents;