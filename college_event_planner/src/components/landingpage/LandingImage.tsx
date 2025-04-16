import React from 'react';
import '../../styles/landingpage/LandingImage.css';
// import backgroundImage from '../../assets/background.jpg'; // <-- Import image
import backgroundImage from "../../assets/pngimg.com - student_PNG136.png"

const LandingImage: React.FC = () => {
  return (
    <div className="landing-image">
      <img
        src={backgroundImage} // <-- Use imported image
        alt="Event Planning"
        className="landing-image-img"
      />
    </div>
  );
};

export default LandingImage;
