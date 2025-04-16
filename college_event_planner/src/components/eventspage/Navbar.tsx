// src/components/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaBell, FaHome } from 'react-icons/fa';
import "../../styles/events/Navbar.css"

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-title">College Event Planner</h1>
        <ul className="navbar-menu">
        <li>
             <Link to="/profile" className="navbar-link">
              My Events
            </Link> 
          </li>
          <li>
            <Link to="/notifications" className="navbar-icon" title="Notifications">
              <FaBell />
            </Link>
          </li>
          
          <li>
            <Link to="/" className="navbar-icon" title="Home">
              <FaHome />
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;