import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    role: '',
    name: '',
    email: '',
    phone: '',
    yearOfStudy: '',
    dob: '',
    password: '',
    description: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: '',
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Client-side validation
    if (name === 'email') {
      const emailRegex = /@/;
      setErrors((prev) => ({
        ...prev,
        email: !emailRegex.test(value) ? 'Email must contain @ symbol' : '',
      }));
    }

    if (name === 'password') {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
      setErrors((prev) => ({
        ...prev,
        password: !passwordRegex.test(value)
          ? 'Password must be > 8 characters with lowercase, uppercase, and symbols'
          : '',
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Client-side validation
    const emailRegex = /@/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!formData.role) {
      setErrors((prev) => ({ ...prev, general: 'Please select a role', email: '', password: '' }));
      return;
    }
    if (!formData.name.trim()) {
      setErrors((prev) => ({ ...prev, general: 'Name is required', email: '', password: '' }));
      return;
    }
    if (!emailRegex.test(formData.email)) {
      setErrors((prev) => ({ ...prev, email: 'Email must contain @ symbol', general: '' }));
      return;
    }
    if (!passwordRegex.test(formData.password)) {
      setErrors((prev) => ({
        ...prev,
        password: 'Password must be > 8 characters with lowercase, uppercase, and symbols',
        general: '',
      }));
      return;
    }
    if (formData.role === 'student') {
      if (!formData.yearOfStudy || !['1', '2', '3', '4'].includes(formData.yearOfStudy)) {
        setErrors((prev) => ({ ...prev, general: 'Please select a valid year of study', email: '', password: '' }));
        return;
      }
      if (!formData.dob) {
        setErrors((prev) => ({ ...prev, general: 'Date of birth is required', email: '', password: '' }));
        return;
      }
    }
    if (formData.role === 'organizer' && !formData.description.trim()) {
      setErrors((prev) => ({ ...prev, general: 'Description is required for organizers', email: '', password: '' }));
      return;
    }

    // Prepare data to send based on role
    const payload = {
      role: formData.role,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      ...(formData.role === 'student' ? { yearOfStudy: formData.yearOfStudy, dob: formData.dob } : {}),
      ...(formData.role === 'organizer' ? { description: formData.description } : {}),
    };

    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setErrors({ email: '', password: '', general: '' });
        alert(`${formData.role.charAt(0).toUpperCase() + formData.role.slice(1)} registered successfully!`);
        navigate('/login');
      } else {
        setErrors((prev) => ({
          ...prev,
          general: data.error || 'Registration failed',
        }));
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Network error. Please try again.';
      setErrors((prev) => ({
        ...prev,
        general: errorMessage,
      }));
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="register-page">
      <h2 className="register-title">Register for College Event Planner</h2>
      {errors.general && <div className="error-message">{errors.general}</div>}
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select role
            </option>
            <option value="student">Student</option>
            <option value="organizer">Organizer</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your full name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="Enter your phone number"
          />
        </div>
        {formData.role === 'student' && (
          <>
            <div className="form-group">
              <label htmlFor="yearOfStudy">Year of Study</label>
              <select
                id="yearOfStudy"
                name="yearOfStudy"
                value={formData.yearOfStudy}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select year
                </option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="dob">Date of Birth</label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}
        {formData.role === 'organizer' && (
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe your organization or role"
              rows={4}
            />
          </div>
        )}
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>
        <button type="submit" className="register-button">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;