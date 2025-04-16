import React, { FormEvent } from 'react';
import '../../styles/organizerDashboard/EventForm.css';

interface FormData {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: string;
  organizer_email: string;
}

interface Errors {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: string;
  organizer_email: string;
  general: string;
}

interface EventFormProps {
  formData: FormData;
  errors: Errors;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: FormEvent) => void;
}

const EventForm: React.FC<EventFormProps> = ({ formData, errors, onChange, onSubmit }) => {
  return (
    <section className="event-form-section">
      <h3>Create New Event</h3>
      <form onSubmit={onSubmit} className="event-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={onChange}
            placeholder="Enter event title"
          />
          {errors.title && <span className="error">{errors.title}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={onChange}
          />
          {errors.date && <span className="error">{errors.date}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="time">Time</label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={onChange}
          />
          {errors.time && <span className="error">{errors.time}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={onChange}
            placeholder="Enter event location"
          />
          {errors.location && <span className="error">{errors.location}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={onChange}
            placeholder="Describe the event"
            rows={4}
          />
          {errors.description && <span className="error">{errors.description}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={onChange}
          >
            <option value="" disabled>
              Select category
            </option>
            <option value="Academic">Academic</option>
            <option value="Cultural">Cultural</option>
            <option value="Sports">Sports</option>
            <option value="Career">Career</option>
            <option value="Club">Club</option>
            <option value="Entertainment">Entertainment</option>
          </select>
          {errors.category && <span className="error">{errors.category}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="organizer_email">Organizer Email</label>
          <input
            type="email"
            id="organizer_email"
            name="organizer_email"
            value={formData.organizer_email}
            onChange={onChange}
            placeholder="Enter organizer email"
          />
          {errors.organizer_email && <span className="error">{errors.organizer_email}</span>}
        </div>
        <button type="submit" className="create-event-button">
          Create Event
        </button>
      </form>
    </section>
  );
};

export default EventForm;