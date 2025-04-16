// src/components/LandingPage.tsx
import React from 'react';
import Navbar from '../components/landingpage/Navbar';
import LandingContent from '../components/landingpage/LandingContent';
import LandingImage from '../components/landingpage/LandingImage';
import "../styles/landingpage/LandingPage.css"

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      <Navbar />
      <div className="landing-section">
        <LandingContent />  
        <LandingImage />
      </div>
    </div>
  );
};

export default LandingPage;