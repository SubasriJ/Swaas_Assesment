import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import EventForm from '../components/Organizer_Dashboard/EventForm';
import '../styles/organizerDashboard/OrganizerDashboard.css';

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

const OrganizerDashboard: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    category: '',
    organizer_email: '',
  });

  const [errors, setErrors] = useState<Errors>({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    category: '',
    organizer_email: '',
    general: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.title) {
      newErrors.title = 'Title is required';
      isValid = false;
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
      isValid = false;
    }
    if (!formData.time) {
      newErrors.time = 'Time is required';
      isValid = false;
    }
    if (!formData.location) {
      newErrors.location = 'Location is required';
      isValid = false;
    }
    if (!formData.description) {
      newErrors.description = 'Description is required';
      isValid = false;
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
      isValid = false;
    }
    if (!formData.organizer_email) {
      newErrors.organizer_email = 'Organizer email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.organizer_email)) {
      newErrors.organizer_email = 'Invalid email format';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/events/create', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert(response.data.message);
      setFormData({
        title: '',
        date: '',
        time: '',
        location: '',
        description: '',
        category: '',
        organizer_email: '',
      });
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      setErrors({
        ...errors,
        general: axiosError.response?.data?.message || 'Failed to create event',
      });
    }
  };

  return (
    <div className="organizer-dashboard">
      <h1>Organizer Dashboard</h1>
      <EventForm
        formData={formData}
        errors={errors}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
      {errors.general && <p className="error-general">{errors.general}</p>}
    </div>
  );
};

export default OrganizerDashboard;