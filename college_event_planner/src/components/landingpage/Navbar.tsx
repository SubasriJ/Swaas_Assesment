// src/components/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/landingpage/Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-title">College Event Planner</h1>
        <ul className="navbar-menu">
          <li>
            <Link to="/register" className="navbar-link">
              Sign Up
            </Link>
          </li>
          <li>
            <Link to="/login" className="navbar-link">
              Sign In
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;