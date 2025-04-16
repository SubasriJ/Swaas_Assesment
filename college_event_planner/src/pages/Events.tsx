import React, { useState, useEffect, useCallback } from 'react';
import CategoryFilter from '../components/eventspage/CategoryFilter';
import SearchEvents from '../components/eventspage/SearchEvents';
import EventList from '../components/eventspage/EventList';
import EventDetails from '../components/eventspage/EventDetails';
import { Event } from '../types/Event';
import axios from 'axios';

// Define the shape of the raw event data from the API
interface RawEvent {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string;
  location: string;
  category: string;
  organizer_name: string;
  registration_count: number;
}

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);
  const [email, setEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRegistrationStatus = useCallback(async (eventsToCheck: Event[], authToken: string) => {
    console.log('[Events] Starting registration status fetch for', eventsToCheck.length, 'events');
    const registeredEventIds: string[] = [];

    try {
      for (const event of eventsToCheck) {
        try {
          console.log(`[Events] Checking registration for event ${event.id}`);
          const response = await axios.get(`http://localhost:3000/api/registrations/check/${event.id}`, {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          console.log(`[Events] Registration check response for event ${event.id}:`, response.data);

          if (response.data.exists_flag === 'true' || response.data.status === 'EXISTS') {
            registeredEventIds.push(event.id);
            console.log(`[Events] Event ${event.id} is registered`);
          } else {
            console.log(`[Events] Event ${event.id} is not registered`);
          }
        } catch (error: unknown) {
          console.error(`[Events] Error checking registration for event ${event.id}:`, error instanceof Error ? error.message : error);
        }
      }

      console.log('[Events] Final registered event IDs:', registeredEventIds);
      setRegisteredEvents(registeredEventIds);
    } catch (error: unknown) {
      console.error('[Events] Error in registration status batch process:', error instanceof Error ? error.message : error);
    }
  }, []);

  const fetchEventsAndRegistrations = useCallback(
    async (authToken: string, userEmail: string | null) => {
      setIsLoading(true);
      try {
        console.log('[Events] Fetching events with token:', authToken ? '[Present]' : '[Missing]');
        const response = await axios.get('http://localhost:3000/api/events/upcoming', {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        console.log('[Events] Events API response:', response.data);

        const fetchedEvents: Event[] = response.data.map((event: RawEvent) => ({
          id: event.id,
          title: event.title,
          description: event.description || 'No description available',
          event_date: event.event_date,
          event_time: event.event_time,
          location: event.location,
          category: event.category,
          organizer: event.organizer_name,
          organizer_name: event.organizer_name,
          registeredStudents: event.registration_count,
        }));
        console.log('[Events] Mapped events:', fetchedEvents);

        setEvents(fetchedEvents);
        setFilteredEvents(fetchedEvents);

        if (userEmail && authToken) {
          console.log('[Events] Email found, fetching registration status');
          await fetchRegistrationStatus(fetchedEvents, authToken);
        } else {
          console.warn('[Events] No email found, skipping registration status fetch');
        }
      } catch (error: unknown) {
        console.error('[Events] Error fetching events:', error instanceof Error ? error.message : error);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchRegistrationStatus, setEvents, setFilteredEvents, setIsLoading]
  );

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    const storedToken = localStorage.getItem('token');
    console.log('[Events] Initial load - Email:', storedEmail || '[Missing]', 'Token:', storedToken ? '[Present]' : '[Missing]');
    setEmail(storedEmail);
    setToken(storedToken);

    if (storedToken) {
      fetchEventsAndRegistrations(storedToken, storedEmail);
    } else {
      console.warn('[Events] No token found, cannot fetch events');
      setIsLoading(false);
    }
  }, [fetchEventsAndRegistrations]);

  const handleFilterChange = useCallback(
    (selectedCategories: string[]) => {
      console.log('[Events] Filter changed:', selectedCategories);
      if (selectedCategories.length === 0) {
        setFilteredEvents(events);
        console.log('[Events] Reset filters, showing all events');
      } else {
        const filtered = events.filter((event) => selectedCategories.includes(event.category));
        setFilteredEvents(filtered);
        console.log('[Events] Filtered events:', filtered.length);
      }
    },
    [events]
  );

  const handleSearch = useCallback(
    (query: string) => {
      console.log('[Events] Search query:', query);
      const lowerQuery = query.toLowerCase();
      const filtered = events.filter(
        (event) =>
          event.title.toLowerCase().includes(lowerQuery) ||
          (event.description?.toLowerCase().includes(lowerQuery) ?? false) ||
          event.organizer_name.toLowerCase().includes(lowerQuery)
      );
      setFilteredEvents(filtered);
      console.log('[Events] Search results:', filtered.length);
    },
    [events]
  );

  const handleRegister = useCallback(
    async (eventId: string) => {
      if (!token || !email) {
        console.error('[Events] Cannot register - Token:', token ? '[Present]' : '[Missing]', 'Email:', email || '[Missing]');
        return false;
      }

      try {
        console.log('[Events] Registering for eventId:', eventId, 'with email:', email);
        const response = await axios.post(
          'http://localhost:3000/api/registrations',
          { eventId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('[Events] Registration response:', response.data);

        if (response.data && (response.data.message.includes('successfully') || response.data.status === 'SUCCESS')) {
          setRegisteredEvents((prev) => {
            if (!prev.includes(eventId)) {
              return [...prev, eventId];
            }
            return prev;
          });

          const updateEventsList = (list: Event[]) => {
            return list.map((event) =>
              event.id === eventId ? { ...event, registeredStudents: event.registeredStudents + 1 } : event
            );
          };

          setEvents(updateEventsList);
          setFilteredEvents(updateEventsList);

          console.log(`[Events] Successfully registered for event ${eventId}`);
          return true;
        } else {
          console.error('[Events] Registration failed:', response.data.message);
          return false;
        }
      } catch (error: unknown) {
        console.error('[Events] Error registering for eventId:', eventId, 'Error:', error instanceof Error ? error.message : error);
        return false;
      }
    },
    [token, email]
  );

  const handleCancel = useCallback(
    async (eventId: string) => {
      if (!token || !email) {
        console.error('[Events] Cannot cancel - Token:', token ? '[Present]' : '[Missing]', 'Email:', email || '[Missing]');
        return false;
      }

      try {
        console.log('[Events] Canceling registration for eventId:', eventId, 'with email:', email);
        const response = await axios.delete('http://localhost:3000/api/registrations', {
          headers: { Authorization: `Bearer ${token}` },
          data: { eventId },
        });
        console.log('[Events] Cancellation response:', response.data);

        if (response.data && (response.data.message.includes('successfully') || response.data.status === 'SUCCESS')) {
          setRegisteredEvents((prev) => prev.filter((id) => id !== eventId));

          const updateEventsList = (list: Event[]) => {
            return list.map((event) =>
              event.id === eventId ? { ...event, registeredStudents: Math.max(0, event.registeredStudents - 1) } : event
            );
          };

          setEvents(updateEventsList);
          setFilteredEvents(updateEventsList);

          console.log(`[Events] Successfully canceled registration for event ${eventId}`);
          return true;
        } else {
          console.error('[Events] Cancellation failed:', response.data.message);
          return false;
        }
      } catch (error: unknown) {
        console.error('[Events] Error canceling for eventId:', eventId, 'Error:', error instanceof Error ? error.message : error);
        return false;
      }
    },
    [token, email]
  );

  console.log('[Events] Rendering - isLoading:', isLoading, 'registeredEvents:', registeredEvents);

  return (
    <div className="events-page">
      <h1>Campus Events</h1>
      {email ? <p>Hi, {email}</p> : <p>Hi, Guest</p>}
      <CategoryFilter onFilterChange={handleFilterChange} />
      <SearchEvents onSearch={handleSearch} />
      {isLoading ? (
        <div className="loading-container">
          <p>Loading events and registration status...</p>
        </div>
      ) : (
        <EventList
          events={filteredEvents}
          onEventClick={setSelectedEvent}
          registeredEvents={registeredEvents}
          onRegister={handleRegister}
          onCancel={handleCancel}
        />
      )}
      {selectedEvent && <EventDetails event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </div>
  );
};

export default Events;