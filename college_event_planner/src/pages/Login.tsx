import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);

    if (!formData.email || !/[^@]+@[^@]+\.[^@]+/.test(formData.email)) {
      setError('Invalid email');
      console.log('Validation failed: Invalid email');
      return;
    }
    if (!formData.password) {
      setError('Invalid password');
      console.log('Validation failed: Invalid password');
      return;
    }
    if (!formData.role || !['student', 'organizer'].includes(formData.role)) {
      setError('Please select a valid role');
      console.log('Validation failed: Invalid role');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      let data;
      try {
        data = await response.json();
        console.log('Response status:', response.status, 'Data:', data);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        setError('Server response error');
        return;
      }

      if (response.ok) {
        if (!data.token || !data.userId || !data.email || !data.role) {
          console.warn('Missing fields in response:', data);
          setError('Invalid server response');
          return;
        }
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('email', data.email);
        localStorage.setItem('role', data.role);
        console.log('localStorage set:', {
          token: data.token,
          userId: data.userId,
          email: data.email,
          role: data.role,
        });
        setError('');
        console.log('Navigating to:', data.role === 'student' ? '/events' : '/organizer-dashboard');
        navigate(data.role === 'student' ? '/events' : '/organizer-dashboard');
      } else {
        setError(data.error || 'Login failed');
        console.log('Login failed with error:', data.error);
        localStorage.clear();
      }
    } catch (err) {
      console.error('Network error:', err);
      setError('Network error. Please check your connection and try again.');
      localStorage.clear();
    }
  };

  return (
    <div className="login-page">
      <h2 className="login-title">Login to College Event Planner</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="login-form">
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
        </div>
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
        </div>
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
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;