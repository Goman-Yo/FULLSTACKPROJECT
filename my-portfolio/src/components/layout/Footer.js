// src/components/layout/Footer.js
import React from 'react';
import './Footer.css'; // Import the CSS file for the footer

// Placeholder for social media icons - we'll use text for now
// We can replace these with actual icons from a library like 'react-icons' later
const SocialLink = ({ href, children, title }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" title={title} className="social-link">
    {children}
  </a>
);

function Footer() {
  const currentYear = new Date().getFullYear();
  const portfolioName = "Yosef Dabous"; // Changed to your actual name for consistency

  return (
    <footer className="site-footer-main"> {/* Changed class name */}
      <div className="footer-content">
        <div className="social-links-container">
          {/* Replace '#' with your actual profile URLs */}
          <SocialLink href="https://www.linkedin.com/in/yosef-dabous-632754303" title="LinkedIn">LinkedIn</SocialLink>
          <SocialLink href="https://github.com/Goman-Yo" title="GitHub">GitHub</SocialLink>
          <SocialLink href="https://yosef123da@gmail.com" title="Email">Email</SocialLink> 
          {/* Add other social links as needed e.g. Twitter, Portfolio_Platform etc. */}
        </div>
        <p className="copyright-text">
          &copy; {currentYear} {portfolioName}. All rights reserved.
        </p>
        {/* Optional: Add a small "Made with..." or other credit */}
        {/* <p className="footer-credit">Designed with Passion</p> */}
      </div>
    </footer>
  );
}

export default Footer;