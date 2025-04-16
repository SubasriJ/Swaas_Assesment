export interface Event {
  id: string;
  title: string;
  event_date: string; // Changed from 'date' to match stored procedure
  event_time: string; // Changed from 'time'
  location: string;
  category: string;
  description?: string;
  organizer_name: string; // Changed from 'organizer'
  registration_count: number; // Changed from 'registeredStudents'
  coordinates?: { lat: number; lng: number };
}
export interface Event {
  id: string;
  title: string;
  event_date: string;
  event_time: string;
  location: string;
  category: string;
  organizer: string;
  organizer_name: string;
  registeredStudents: number;
}