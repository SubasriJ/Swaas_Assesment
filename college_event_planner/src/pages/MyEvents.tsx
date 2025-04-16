import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/MyEvents.css';

interface Event {
  event_id: string;
  title: string;
  category: string;
}

const MyEvents: React.FC = () => {
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [todayEvents, setTodayEvents] = useState<Event[]>([]);
  const [futureEvents, setFutureEvents] = useState<Event[]>([]);
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'Past' | 'Today' | 'Future'>('Today');

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