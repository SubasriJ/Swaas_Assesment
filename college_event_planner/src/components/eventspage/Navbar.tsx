import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBell, FaHome, FaBars, FaTimes } from 'react-icons/fa';
import "../../styles/events/Navbar.css";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="navbar-container">
        <h1 className="navbar-title">College Event Planner</h1>
        <button
          className="navbar-toggle"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
        
        {/* The key change is here - conditionally render the entire menu */}
        <div className={`navbar-menu-container ${isMenuOpen ? 'show' : ''}`}>
          <ul className="navbar-menu">
            <li>
              <Link
                to="/profile"
                className="navbar-link"
                onClick={() => setIsMenuOpen(false)}
              >
                My Events
              </Link>
            </li>
            <li>
              <Link
                to="/notifications"
                className="navbar-link"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaBell className="navbar-icon" aria-hidden="true" />
                <span className="navbar-link-text">Notifications</span>
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className="navbar-link"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaHome className="navbar-icon" aria-hidden="true" />
                <span className="navbar-link-text">Home</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;