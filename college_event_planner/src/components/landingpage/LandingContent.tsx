// src/components/landingpage/LandingContent.tsx
import React from 'react';
import '../../styles/landingpage/LandingContent.css';

const LandingContent: React.FC = () => {
  return (
    <div className="landing-content">
      <h2 className="landing-content-title">Plan Your College Events with Ease</h2>
      <p className="landing-content-description">
        Transform your campus events from stressful to successful! 🚀
      </p>
      <div className="landing-content-details">
        <p className="landing-content-subtitle">
          We provide comprehensive tools for all your college event needs—whether you're organizing festivals, workshops, fundraisers, or cultural celebrations. 🎭🧠💰🌎
        </p>
        <ul className="landing-content-features">
          <li>Design and manage event schedules 📅</li>
          <li>Process registrations and track attendance 📝</li>
          <li>Market your event effectively with integrated tools 📣</li>
          <li>Coordinate volunteer teams efficiently 👥</li>
          <li>Analyze engagement and collect valuable feedback 📊</li>
        </ul>
        <p className="landing-content-closing">
          We support your entire event journey, from initial concept to successful completion. 💡➡️🏆 Begin creating memorable campus experiences today! 🎉
        </p>
      </div>
    </div>
  );
};

export default LandingContent;